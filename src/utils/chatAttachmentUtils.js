/** Infer attachment render type from Cloudinary URL or file name. */
export function getAttachmentType(url) {
  if (!url || typeof url !== 'string') return null;
  const lower = url.toLowerCase();

  const isAudioExt = /\.(webm|mp3|wav|m4a|ogg)(\?|$)/i.test(lower);

  // Voice recordings are uploaded as raw files (not video)
  if (lower.includes('/raw/upload/') && isAudioExt) {
    return 'audio';
  }
  if (lower.includes('/video/upload/') || /\.(mp4|mov|webm|ogg)(\?|$)/i.test(lower)) {
    return 'video';
  }
  if (isAudioExt) {
    return 'audio';
  }
  if (
    lower.includes('/raw/upload/') ||
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip)(\?|$)/i.test(lower)
  ) {
    return 'document';
  }
  if (lower.includes('/image/upload/') || /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(lower)) {
    return 'image';
  }
  return 'image';
}

/**
 * Cloudinary only accepts simple data URLs (e.g. data:audio/webm;base64,...).
 * FileReader can produce data:audio/webm;codecs=opus;base64,... which fails.
 */
export function normalizeDataUrlForUpload(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return dataUrl;
  }
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) return dataUrl;

  const header = dataUrl.slice(0, commaIdx);
  const payload = dataUrl.slice(commaIdx + 1);
  const isBase64 = header.includes('base64');
  if (!isBase64) return dataUrl;

  const mime = header.slice(5).split(';')[0];
  return `data:${mime};base64,${payload}`;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(normalizeDataUrlForUpload(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Plain MIME for MediaRecorder blobs (no ;codecs=opus). */
export function simpleAudioMime(recorderMime) {
  const raw = recorderMime || 'audio/webm';
  return raw.split(';')[0] || 'audio/webm';
}

export function inferUploadKind(file) {
  if (!file?.type) return 'document';
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  return 'document';
}

export function isVoiceMessageCaption(caption) {
  return caption === '🎤 Voice message';
}

export function inferAudioMimeFromUrl(url) {
  if (!url || typeof url !== 'string') return 'audio/webm';
  const ext = url.toLowerCase().split('.').pop()?.split('?')[0];
  if (ext === 'm4a' || ext === 'mp4') return 'audio/mp4';
  if (ext === 'mp3') return 'audio/mpeg';
  if (ext === 'ogg') return 'audio/ogg';
  if (ext === 'wav') return 'audio/wav';
  return 'audio/webm';
}

export function isCloudinaryRawAudioUrl(url) {
  return /\/raw\/upload\/.*\.(webm|m4a|mp3|ogg|wav)(\?|$)/i.test(url || '');
}

export async function resolveVoicePlaybackUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (!isCloudinaryRawAudioUrl(url)) return url;

  const response = await fetch(url, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(`Failed to load voice message (${response.status})`);
  }

  const mime = inferAudioMimeFromUrl(url);
  const blob = new Blob([await response.arrayBuffer()], { type: mime });
  return URL.createObjectURL(blob);
}
