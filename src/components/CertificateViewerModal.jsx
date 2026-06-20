import React, { useEffect, useState } from 'react';
import { profilePhotoUrl } from '../utils/profilePhotoUrl';

const getMediaKind = (url) => {
  if (!url) return null;
  const path = String(url).split('?')[0].toLowerCase();
  if (/\.(jpe?g|png|gif|webp|bmp|svg|heic|heif)$/.test(path)) return 'image';
  if (path.endsWith('.pdf')) return 'pdf';
  return 'unknown';
};

export function CertificateViewerModal({ open, onClose, fileUrl, title }) {
  const resolvedUrl = profilePhotoUrl(fileUrl) || (fileUrl ? String(fileUrl).trim() : '');
  const kind = getMediaKind(resolvedUrl);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!open) setLoadError(false);
  }, [open, resolvedUrl]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !resolvedUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Certificate preview'}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <p className="text-white text-center mb-3 text-sm font-medium truncate px-10">
            {title}
          </p>
        )}

        <div className="flex-1 overflow-auto nfl-scroll rounded-lg flex items-center justify-center min-h-[240px] bg-black/30">
          {loadError ? (
            <div className="text-white text-center p-8">
              <p className="mb-4 text-sm">Could not preview this certificate.</p>
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9AE6B0] underline text-sm"
              >
                Open in new tab
              </a>
            </div>
          ) : kind === 'image' ? (
            <img
              src={resolvedUrl}
              alt={title || 'Certificate'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onError={() => setLoadError(true)}
            />
          ) : (
            <iframe
              src={resolvedUrl}
              title={title || 'Certificate'}
              className="w-full h-[80vh] rounded-lg bg-white border-0"
              onError={() => setLoadError(true)}
            />
          )}
        </div>

        <button
          type="button"
          aria-label="Close certificate viewer"
          className="absolute top-0 right-0 text-white text-2xl bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}

/**
 * Button that opens certificate file in an overlay modal (images + PDFs).
 */
export function CertificateViewLink({
  fileUrl,
  title,
  className = '',
  children = 'View certificate',
}) {
  const [open, setOpen] = useState(false);
  const resolvedUrl = profilePhotoUrl(fileUrl) || (fileUrl ? String(fileUrl).trim() : '');

  if (!resolvedUrl) return null;

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      <CertificateViewerModal
        open={open}
        onClose={() => setOpen(false)}
        fileUrl={fileUrl}
        title={title}
      />
    </>
  );
}
