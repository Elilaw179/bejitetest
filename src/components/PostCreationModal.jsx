import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaVideo, FaTimes, FaClock } from 'react-icons/fa';
import { uploadMedia } from '../services/postsApi';

function getDefaultSchedule() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 60);
  d.setSeconds(0, 0);
  return {
    date: d.toISOString().slice(0, 10),
    time: d.toTimeString().slice(0, 5),
  };
}

function formatScheduledLabel(dateStr, timeStr) {
  const scheduled = new Date(`${dateStr}T${timeStr}`);
  if (Number.isNaN(scheduled.getTime())) return '';
  return scheduled.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const PostCreationModal = ({ isOpen, onClose, onPost, initialVisibility = 'public' }) => {
  const [postBody, setPostBody] = useState('');
  const [visibility, setVisibility] = useState(initialVisibility);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [postMode, setPostMode] = useState('now');
  const [scheduleDate, setScheduleDate] = useState(() => getDefaultSchedule().date);
  const [scheduleTime, setScheduleTime] = useState(() => getDefaultSchedule().time);
  const [minDate, setMinDate] = useState(() => new Date().toISOString().slice(0, 10));
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const defaults = getDefaultSchedule();
    setMinDate(new Date().toISOString().slice(0, 10));
    setScheduleDate(defaults.date);
    setScheduleTime(defaults.time);
    setPostMode('now');
    setError(null);
    setSuccess(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMediaSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingMedia(true);
      setError(null);
      const result = await uploadMedia(file);
      const newMedia = {
        kind: result.kind,
        url: result.url,
        thumbnailUrl: result.thumbnailUrl ?? null,
      };
      setMediaFiles([...mediaFiles, newMedia]);
    } catch (err) {
      console.error('Error uploading media:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to upload media. Please try again.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const removeMedia = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const buildScheduledAt = () => {
    const scheduled = new Date(`${scheduleDate}T${scheduleTime}`);
    if (Number.isNaN(scheduled.getTime())) {
      throw new Error('Please choose a valid date and time.');
    }
    if (scheduled.getTime() <= Date.now()) {
      throw new Error('Scheduled time must be in the future.');
    }
    return scheduled.toISOString();
  };

  const handlePost = async () => {
    if (!postBody.trim() && mediaFiles.length === 0) {
      setError('Please write something or add media to your post.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const payload = {
        body: postBody,
        visibility,
        media: mediaFiles,
      };

      if (postMode === 'schedule') {
        payload.status = 'scheduled';
        payload.scheduledAt = buildScheduledAt();
      } else {
        payload.status = 'published';
      }

      await onPost(payload);

      if (postMode === 'schedule') {
        setSuccess(`Post scheduled for ${formatScheduledLabel(scheduleDate, scheduleTime)}.`);
        setTimeout(() => handleClose(), 1200);
      } else {
        handleClose();
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError(
        err?.message ||
          err?.response?.data?.error ||
          'Failed to create post. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    const nextDefault = getDefaultSchedule();
    setPostBody('');
    setMediaFiles([]);
    setError(null);
    setSuccess(null);
    setPostMode('now');
    setScheduleDate(nextDefault.date);
    setScheduleTime(nextDefault.time);
    onClose();
  };

  const isScheduleMode = postMode === 'schedule';
  const canSubmit = postBody.trim() || mediaFiles.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-[#1A3E32]">Create Post</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2"
            type="button"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto nfl-scroll scroll-smooth p-4">
          <textarea
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#16730F] resize-none text-base"
            autoFocus
          />

          {mediaFiles.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="relative">
                    {media.kind === 'image' ? (
                      <img
                        src={media.url}
                        alt={`Media ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              When to publish
            </p>
            <div className="inline-flex rounded-full border border-gray-200 p-1 bg-gray-50">
              <button
                type="button"
                onClick={() => setPostMode('now')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !isScheduleMode
                    ? 'bg-[#16730F] text-white'
                    : 'text-gray-600 hover:text-[#1A3E32]'
                }`}
              >
                Post now
              </button>
              <button
                type="button"
                onClick={() => setPostMode('schedule')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isScheduleMode
                    ? 'bg-[#16730F] text-white'
                    : 'text-gray-600 hover:text-[#1A3E32]'
                }`}
              >
                <FaClock className="text-xs" />
                Schedule
              </button>
            </div>

            {isScheduleMode && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-gray-600 mb-1 block">Date</span>
                  <input
                    type="date"
                    value={scheduleDate}
                    min={minDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#16730F]"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-600 mb-1 block">Time</span>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#16730F]"
                  />
                </label>
                <p className="sm:col-span-2 text-xs text-gray-500">
                  Will publish on{' '}
                  <span className="font-medium text-[#1A3E32]">
                    {formatScheduledLabel(scheduleDate, scheduleTime) || '—'}
                  </span>
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploadingMedia}
              className="flex items-center gap-2 text-[#16730F] hover:bg-gray-100 px-3 py-2 rounded-lg disabled:opacity-50"
            >
              <FaImage className="text-lg" />
              <span className="text-sm">Add Image</span>
            </button>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploadingMedia}
              className="flex items-center gap-2 text-[#16730F] hover:bg-gray-100 px-3 py-2 rounded-lg disabled:opacity-50"
            >
              <FaVideo className="text-lg" />
              <span className="text-sm">Add Video</span>
            </button>
            {uploadingMedia && (
              <span className="text-sm text-gray-500">Uploading...</span>
            )}
          </div>

          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            onChange={handleMediaSelect}
            className="hidden"
          />
          <input
            type="file"
            ref={videoInputRef}
            accept="video/*"
            onChange={handleMediaSelect}
            className="hidden"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/assets/images/public-icon.svg" alt="Public" className="w-4 h-4" />
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="text-sm rounded-md border border-gray-300 px-2 py-1 text-[#1A3E32] bg-white"
              >
                <option value="public">Public</option>
                <option value="connections">Connections Only</option>
              </select>
            </div>
            <button
              onClick={handlePost}
              disabled={submitting || !canSubmit}
              className="bg-[#16730F] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#145a0c] disabled:opacity-50 transition-colors"
            >
              {submitting
                ? isScheduleMode
                  ? 'Scheduling...'
                  : 'Posting...'
                : isScheduleMode
                  ? 'Schedule post'
                  : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreationModal;
