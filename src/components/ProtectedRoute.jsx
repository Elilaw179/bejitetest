import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUser, getAccessToken } from '../utils/tokenManager';
import { toast } from 'react-toastify';

/**
 * Protected Route Component
 * Wraps routes that require authentication
 */
const ProtectedRoute = ({ children, requireVerified = false, requiredRole = null, redirectMessage = null }) => {
  const authenticated = isAuthenticated();
  const user = getUser();

  // Check if user is authenticated
  if (!authenticated) {
    // Check if token exists but is expired
    const token = getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && Date.now() > payload.exp * 1000) {
          sessionStorage.setItem("sessionExpired", "true");
        }
      } catch (e) {
        // Invalid token
      }
    }
    
    if (redirectMessage) {
      toast.error(redirectMessage);
    } else {
      toast.error('Please log in to access this page');
    }
    return <Navigate to="/" replace />;
  }

  // Check if email verification is required
  if (requireVerified && user) {
    const isVerified = user.verified || user.isEmailVerified;
    if (!isVerified) {
      toast.warning('Please verify your email to access this page');
      return <Navigate to={`/auth/email-sent?email=${encodeURIComponent(user.email)}`} replace />;
    }
  }

  // Check if specific role is required
  if (requiredRole && user) {
    if (user.role !== requiredRole) {
      toast.error('You do not have permission to access this page');
      return <Navigate to="/resume" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

