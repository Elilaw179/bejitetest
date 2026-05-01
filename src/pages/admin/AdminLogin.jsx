import { Eye, EyeOff } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearErrors, logout } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

const bejiteLogoUrl = "/assets/images/logo.png";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, errors } = useSelector((state) => state.auth);
  const isDisabled = !email || !password || loading;

  useEffect(() => {
    dispatch(clearErrors());
    dispatch(logout()); // Ensure fresh login for admin
  }, [dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((data) => {
        let user = data.confirmedUser || data.user;

        // Verify if user is admin
        if (!user || !user.is_admin) {
          dispatch(logout());
          toast.error("Access Denied. You do not have admin privileges.");
          return;
        }

        toast.success("Admin login successful! Redirecting...");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 500);
      })
      .catch((err) => {
        const errorMessage = err.error || err.message;
        toast.error(errorMessage || "Login failed. Please try again.");
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="w-full flex justify-center py-6 bg-white shadow-sm border-b">
        <img src={bejiteLogoUrl} alt="Logo" className="h-10" />
      </div>

      <div className="flex-1 flex justify-center items-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Admin Access</h2>
            <p className="text-gray-500 mt-2">Login to access the analytics dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="admin@bejite.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-[#16730F] focus:ring-1 focus:ring-[#16730F] transition"
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-[#16730F] focus:ring-1 focus:ring-[#16730F] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-500 right-4 top-10"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors?.error && (
              <p className="text-sm text-red-500 text-center bg-red-50 py-2 rounded-lg">{errors.error}</p>
            )}

            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full py-3.5 rounded-xl text-white font-semibold shadow-md transition ${
                isDisabled ? "bg-[#16730F]/50 cursor-not-allowed" : "bg-[#16730F] hover:bg-[#115a0c]"
              }`}
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
