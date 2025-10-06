import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/ui/Loader';

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Dynamically import jwt-decode to avoid Vite ESM/CommonJS issues
      import('jwt-decode')
        .then((jwtDecode) => {
          const user = jwtDecode.default(token); // use .default for CommonJS
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));

          navigate('/signup-role');
        })
        .catch((err) => {
          console.error('Token decode failed', err);
          navigate('/signin'); // fallback
        });
    } else {
      navigate('/signin'); // fallback if token is missing
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
