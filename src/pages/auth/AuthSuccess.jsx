import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token') || params.get('accessToken');
    const refreshTokenParam = params.get('refreshToken');
    const userParam = params.get('user');
    const profileCompletedParam = params.get('profileCompleted');

    if (refreshTokenParam) {
      localStorage.setItem('refreshToken', refreshTokenParam);
    }

    if (token) {
      try {
        // Decode the JWT token to get user info
        const decodedToken = jwtDecode(token);
        console.log('[AuthSuccess] Decoded token payload:', decodedToken);
        
        // If user parameter is provided, use it; otherwise use decoded token data
        let userData;
        if (userParam) {
          try {
            // Decode the URL-encoded user data
            userData = JSON.parse(decodeURIComponent(userParam));
            console.log('[AuthSuccess] Using user data from query param:', userData);
          } catch (err) {
            console.warn('Failed to parse user parameter, using token data:', err);
            userData = decodedToken;
            console.log('[AuthSuccess] Falling back to decoded token data');
          }
        } else {
          userData = decodedToken;
          console.log('[AuthSuccess] No user query param, using decoded token data');
        }

        // Store both token and user data
        localStorage.setItem('accessToken', token); // Primary token key for authentication checks
        localStorage.setItem('authToken', token); // Legacy key for backward compatibility
        
        // Normalize ID for downstream pages that expect user.id
        const resolvedUserId = userData?.id || userData?.userId || userData?.sub || null;
        console.log('[AuthSuccess] ID resolution:', {
          id: userData?.id,
          userId: userData?.userId,
          sub: userData?.sub,
          resolvedUserId
        });

        // Add profileCompleted flag and normalized id to user data before storing
        const userDataWithProfileStatus = {
          ...userData,
          id: resolvedUserId,
          profileCompleted: profileCompletedParam === 'true'
        };
        localStorage.setItem('user', JSON.stringify(userDataWithProfileStatus));
        console.log('[AuthSuccess] Stored user in localStorage:', userDataWithProfileStatus);

        console.log('Authentication successful:', { token, userData });
        
        // Check if user is verified (now included in JWT token)
        const isVerified = userData.verified || userData.isEmailVerified;
        
        // Check if user has completed the full signup process
        // User has completed signup if they have a role (jobseeker/recruiter)
        const hasCompletedSignup = userData.role !== null && userData.role !== undefined;
        
        // Check profile completion status (from query param for Google OAuth)
        const hasCompletedProfile = profileCompletedParam === 'true';
        const userRole = userData.role;

        if (!isVerified) {
          // User not verified, redirect to email verification
          console.log('User not verified, redirecting to email sent page');
          toast.warning('Please verify your email to continue.');
          setTimeout(() => navigate('/auth/email-sent'), 1000);
        } else if (!hasCompletedSignup) {
          // User is verified but hasn't completed signup, redirect to role selection
          console.log('User verified but signup incomplete, redirecting to complete signup');
          toast.info('Please complete your profile setup.');
          setTimeout(() => {
            navigate(`/complete-signup?email=${encodeURIComponent(userData.email)}&status=verified`);
          }, 1000);
        } else if (userRole === 'recruiter') {
          // User is a recruiter, redirect to employer dashboard
          console.log('User is a recruiter, redirecting to recruitment dashboard');
          toast.success('Welcome back!');
          setTimeout(() => navigate('/recruitment'), 1000);
        } else if (hasCompletedProfile) {
          // User is a jobseeker with completed profile, redirect to dashboard
          console.log('User verified and profile complete, redirecting to recruitment dashboard');
          toast.success('Welcome back!');
          setTimeout(() => navigate('/recruitment'), 1000);
        } else {
          // User is a jobseeker who hasn't completed profile
          console.log('User verified and signup complete, redirecting to resume');
          toast.success('Welcome back!');
          setTimeout(() => navigate('/resume'), 1000);
        }
      } catch (err) {
        console.error('Token decode failed:', err);
        toast.error('Authentication failed. Please try logging in again.');
        setTimeout(() => navigate('/'), 1500);
      }
    } else {
      console.warn('No token found in URL parameters');
      toast.error('Invalid authentication. Please log in.');
      setTimeout(() => navigate('/'), 1500);
    }
  }, [location, navigate]);

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
