import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/ui/Loader";

function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("❌ Failed to decode token:", err);
    return null;
  }
}

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const type = params.get("type") || "login";

    if (token) {
      const user = decodeToken(token);
      console.log("✅ Decoded user:", user);

      if (user) {
        const email = user?.email;
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (type === "signup") {
          navigate(`/complete-signup?email=${encodeURIComponent(email)}&status=verified`);
        } else {
          navigate("/post-page");
        }
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Loader show={true} description="Please wait while we set up your account…" />
    </div>
  );
};

export default AuthSuccess;
