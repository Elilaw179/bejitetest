import { toast } from 'react-toastify';
import { sharePost } from '../services/postsApi';

export function getPostShareUrl(postId) {
  return `${window.location.origin}/news-feed?post=${encodeURIComponent(postId)}`;
}

/**
 * Record share on the server and copy a shareable link to the clipboard.
 */
export async function sharePostWithLink(postId) {
  try {
    await sharePost(postId);
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.error || err.response?.data?.message;
    if (status !== 409) {
      toast.error(message || 'Failed to share post');
      throw err;
    }
  }

  const url = getPostShareUrl(postId);

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      toast.success('Post shared! Link copied to clipboard.');
    } else {
      toast.success('Post shared!');
    }
  } catch {
    toast.success('Post shared!');
  }

  return url;
}
