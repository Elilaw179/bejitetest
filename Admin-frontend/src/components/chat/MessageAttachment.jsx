
import { getAttachmentType } from '../../utils/chatAttachmentUtils';

function MessageAttachment({ url, caption }) {
  const type = getAttachmentType(url);

  if (type === 'video') {
    return (
      <video
        src={url}
        controls
        className="mb-2 w-full max-w-xs rounded-lg max-h-48 bg-black"
      />
    );
  }

  if (type === 'audio') {
    return (
      <audio src={url} controls className="mb-2 w-full max-w-xs" />
    );
  }

  if (type === 'document') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2 block text-sm underline break-all"
      >
        {caption || 'View attachment'}
      </a>
    );
  }

  return (
    <img
      src={url}
      alt={caption || 'attachment'}
      className="mb-2 w-full max-w-xs rounded-lg max-h-48 object-cover"
    />
  );
}

export default MessageAttachment;
