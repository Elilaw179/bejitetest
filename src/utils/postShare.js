import { toast } from 'react-toastify';
import { sharePost } from '../services/postsApi';

export function getPostShareUrl(postId) {
  return `${window.location.origin}/p/${encodeURIComponent(postId)}`;
}

export function isPublicShareablePost(post) {
  return post?.visibility === 'public' && post?.status === 'published';
}

export function buildPostShareText(post) {
  const authorName =
    post?.author?.name?.trim() ||
    [post?.author?.firstName, post?.author?.lastName].filter(Boolean).join(' ').trim() ||
    'Someone on Bejite';

  const body = String(post?.body || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (body) {
    const snippet = body.length > 120 ? `${body.slice(0, 117).trimEnd()}...` : body;
    return `${authorName}: ${snippet}`;
  }

  return `Check out ${authorName}'s post on Bejite`;
}

/**
 * Record a share on the server.
 */
export async function recordPostShare(postId) {
  try {
    await sharePost(postId);
    return true;
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.error || err.response?.data?.message;
    if (status !== 409) {
      toast.error(message || 'Failed to share post');
      throw err;
    }
    return true;
  }
}

export async function copyPostLink(postId) {
  const url = getPostShareUrl(postId);
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard.');
    } else {
      toast.success('Share link ready.');
    }
  } catch {
    toast.success('Share link ready.');
  }
  return url;
}

export function openShareWindow(url) {
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
}

export function getSocialShareUrl(platform, postUrl, { text, title } = {}) {
  const encodedUrl = encodeURIComponent(postUrl);
  const shareText = text || title || 'Check out this post on Bejite';
  const encodedText = encodeURIComponent(shareText);

  switch (platform) {
    case 'whatsapp':
      // URL only — WhatsApp builds the preview card from OG tags on the link.
      return `https://wa.me/?text=${encodedUrl}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'x':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'telegram':
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    default:
      return postUrl;
  }
}
