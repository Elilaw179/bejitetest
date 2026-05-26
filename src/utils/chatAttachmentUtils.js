/** Infer attachment render type from Cloudinary URL or file name. */
export function getAttachmentType(url) {
  if (!url || typeof url !== 'string') return null;
  const lower = url.toLowerCase();

  if (lower.includes('/video/upload/') || /\.(mp4|webm|mov|ogg)(\?|$)/i.test(lower)) {
    return 'video';
  }
  if (lower.includes('/raw/upload/') && /\.(webm|mp3|wav|m4a|ogg)(\?|$)/i.test(lower)) {
    return 'audio';
  }
  if (/\.(webm|mp3|wav|m4a|ogg)(\?|$)/i.test(lower)) {
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

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function inferUploadKind(file) {
  if (!file?.type) return 'document';
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  return 'document';
}
