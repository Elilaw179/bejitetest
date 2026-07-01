/**
 * Vercel serverless proxy: serves Open Graph HTML for /p/:postId (via vercel.json rewrite).
 * Crawlers and humans hitting the share URL get OG tags; HTML redirects to the app feed.
 */
export default async function handler(req, res) {
  const postId = req.query.postId;

  if (!postId) {
    res.status(400).send("Missing post id");
    return;
  }

  const apiBase = String(
    process.env.VITE_API_URL ||
      process.env.BACKEND_URL ||
      process.env.API_URL ||
      "",
  )
    .trim()
    .replace(/\/+$/, "");

  if (!apiBase) {
    res.status(500).send("Share preview is not configured");
    return;
  }

  try {
    const upstream = await fetch(
      `${apiBase}/share/post/${encodeURIComponent(postId)}`,
      {
        headers: {
          "User-Agent": req.headers["user-agent"] || "BejiteShareProxy/1.0",
        },
      },
    );

    const html = await upstream.text();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.status(upstream.status).send(html);
  } catch (error) {
    console.error("Share preview proxy error:", error);
    res.status(502).send("Failed to load post preview");
  }
}
