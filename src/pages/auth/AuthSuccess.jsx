import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';
import axiosInstance from '../../utils/axiosInstance';
import { hydrateAuth, verifyTwoFactorLogin } from '../../features/auth/authSlice';
import { storeUser } from '../../utils/tokenManager';
import TwoFactorCodeForm from '../../components/auth/TwoFactorCodeForm';
import { requestTwoFactorRecovery } from '../../services/twoFactorApi';

/**
 * Query/JWT payloads are sometimes sparse; GET /auth/me returns the canonical session user.
 * @param {Record<string, unknown> | null | undefined} u
 */
function needsAuthMeHydration(u) {
  if (!u || typeof u !== 'object') return true;
  const id = u.id ?? u.userId ?? u.sub;
  if (id == null || id === '') return true;
  if (u.role === undefined || u.role === null) return true;
  return false;
}

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, errors } = useSelector((state) => state.auth);
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [awaitingTwoFactor, setAwaitingTwoFactor] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const params = new URLSearchParams(location.search);
      const challengeParam = params.get('challenge');
      const challengeToken = params.get('twoFactorToken');
      const requiresTwoFactor = params.get('requiresTwoFactor') === 'true';

      if (requiresTwoFactor) {
        setChallengeId(challengeParam || '');
        setTwoFactorToken(challengeToken || '');
        setAwaitingTwoFactor(true);
        return;
      }

      const token = params.get('token') || params.get('accessToken');
      const refreshTokenParam = params.get('refreshToken');
      const userParam = params.get('user');
      const profileCompletedParam = params.get('profileCompleted');

      if (refreshTokenParam) {
        localStorage.setItem('refreshToken', refreshTokenParam);
      }

      if (!token) {
        console.warn('No token found in URL parameters');
        toast.error('Invalid authentication. Please log in.');
        setTimeout(() => navigate('/'), 1500);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);

        let userData;
        if (userParam) {
          try {
            userData = JSON.parse(decodeURIComponent(userParam));
          } catch (err) {
            console.warn('Failed to parse user parameter, using token data:', err);
            userData = decodedToken;
          }
        } else {
          userData = decodedToken;
        }

        localStorage.setItem('accessToken', token);
        localStorage.setItem('authToken', token);

        const resolvedFromPayload =
          userData?.id ?? userData?.userId ?? userData?.sub ?? null;

        let sessionUser = {
          ...userData,
          id: resolvedFromPayload,
          profileCompleted: profileCompletedParam === 'true',
        };

        if (needsAuthMeHydration(sessionUser)) {
          try {
            const { data } = await axiosInstance.get('/auth/me');
            if (cancelled) return;
            const me = data?.user ?? data;
            if (me && typeof me === 'object') {
              sessionUser = {
                ...sessionUser,
                ...me,
                id: me.id ?? me.userId ?? sessionUser.id ?? me.sub ?? null,
                profileCompleted:
                  me.profileCompleted ?? sessionUser.profileCompleted,
              };
            }
          } catch (e) {
            if (!cancelled) {
              console.warn(
                '[AuthSuccess] GET /auth/me failed; continuing with OAuth payload',
                e?.message || e,
              );
            }
          }
        }

        if (cancelled) return;

        storeUser(sessionUser);
        dispatch(hydrateAuth());

        const isVerified =
          sessionUser.verified || sessionUser.isEmailVerified;
        const hasCompletedSignup =
          sessionUser.role !== null && sessionUser.role !== undefined;

        if (!isVerified) {
          console.log('User not verified, redirecting to email sent page');
          toast.warning('Please verify your email to continue.');
          setTimeout(() => navigate('/auth/email-sent'), 1000);
        } else if (!hasCompletedSignup) {
          console.log('User verified but signup incomplete, redirecting to complete signup');
          toast.info('Please complete your profile setup.');
          setTimeout(() => {
            const email = sessionUser.email || '';
            navigate(
              `/complete-signup?email=${encodeURIComponent(email)}&status=verified`,
            );
          }, 1000);
        } else {
          // Land on the app; ProfileCompletionReminder prompts incomplete profiles.
          console.log('Signup complete, redirecting to news feed');
          toast.success('Welcome back!');
          setTimeout(() => navigate('/news-feed'), 1000);
        }
      } catch (err) {
        console.error('Token decode failed:', err);
        toast.error('Authentication failed. Please try logging in again.');
        setTimeout(() => navigate('/'), 1500);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [location, navigate, dispatch]);

  const completeSession = (data) => {
    const user = data.confirmedUser || data.user;
    toast.success('Welcome back!');
    const isVerified = user?.verified || user?.isEmailVerified;
    const hasCompletedSignup = user?.role !== null && user?.role !== undefined;
    if (!isVerified) {
      navigate('/auth/email-sent');
    } else if (!hasCompletedSignup) {
      navigate(
        `/complete-signup?email=${encodeURIComponent(user?.email || '')}&status=verified`,
      );
    } else {
      navigate('/news-feed');
    }
  };

  const handleTwoFactorVerify = (code) => {
    dispatch(verifyTwoFactorLogin({ twoFactorToken, challengeId, code }))
      .unwrap()
      .then(completeSession)
      .catch((err) => {
        const errorMessage = err.error || err.message;
        toast.error(errorMessage || 'Invalid authentication code.');
        if (err.code === 'TWO_FACTOR_EXPIRED') {
          navigate('/');
        }
      });
  };

  const handleTwoFactorRecovery = async () => {
    if (recoveryLoading) return;
    setRecoveryLoading(true);
    try {
      const data = await requestTwoFactorRecovery({ twoFactorToken, challengeId });
      toast.success(data.message || 'Check your email for a recovery link.');
    } catch (error) {
      toast.error(error.message || 'Could not send recovery email.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  if (awaitingTwoFactor) {
    return (
      <div className="w-screen min-h-screen flex justify-center items-center bg-white px-6">
        <div className="w-full max-w-md space-y-5">
          <h2 className="text-3xl font-norican font-semibold text-[#16730F] text-center">
            Two-Factor Authentication
          </h2>
          <p className="text-center text-[#16730F] text-md">
            Enter the code from your authenticator app to finish signing in.
          </p>
          <TwoFactorCodeForm
            onSubmit={handleTwoFactorVerify}
            loading={loading}
            error={errors?.error}
            onRequestRecovery={handleTwoFactorRecovery}
            recoveryLoading={recoveryLoading}
            onBack={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Loader
        show={true}
        description="Registration successful. We're setting up your account…"
      />
    </div>
  );
};

export default AuthSuccess;
