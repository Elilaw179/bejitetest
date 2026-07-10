import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user.is_admin) {
    return <Navigate to="/" replace />; // Redirect non-admins to home
  }

  return children;
};

export default AdminProtectedRoute;
