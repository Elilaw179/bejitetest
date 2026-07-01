import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Local dev / non-Vercel fallback: /p/:postId → news feed with post query.
 * On Vercel, /p/:postId is rewritten to the OG proxy before this route runs.
 */
export default function SharedPostRedirect() {
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!postId) {
      navigate("/news-feed", { replace: true });
      return;
    }
    navigate(`/news-feed?post=${encodeURIComponent(postId)}`, { replace: true });
  }, [postId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
      Opening post…
    </div>
  );
}
