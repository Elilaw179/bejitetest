import React, { useState, useRef } from 'react';
import { FaImage, FaVideo, FaTimes } from 'react-icons/fa';
import { uploadMedia } from '../services/postsApi';

const PostCreationModal = ({ isOpen, onClose, onPost, initialVisibility = 'public' }) => {
  const [postBody, setPostBody] = useState('');
  const [visibility, setVisibility] = useState(initialVisibility);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  if (!isOpen) return null;

  const handleMediaSelect = async (e, kind) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingMedia(true);
      setError(null);
      const result = await uploadMedia(file);
      const newMedia = {
        kind: result.kind,
        url: result.url
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

  const handlePost = async () => {
    if (!postBody.trim() && mediaFiles.length === 0) {
      setError('Please write something or add media to your post.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onPost({
        body: postBody,
        visibility,
        status: 'published',
        media: mediaFiles
      });
      handleClose();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setPostBody('');
    setMediaFiles([]);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-[#1A3E32]">Create Post</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <textarea
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#16730F] resize-none text-base"
            autoFocus
          />

          {/* Media Preview */}
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

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          {/* Media Buttons */}
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

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            onChange={(e) => handleMediaSelect(e, 'image')}
            className="hidden"
          />
          <input
            type="file"
            ref={videoInputRef}
            accept="video/*"
            onChange={(e) => handleMediaSelect(e, 'video')}
            className="hidden"
          />

          {/* Post Actions */}
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
              disabled={submitting || (!postBody.trim() && mediaFiles.length === 0)}
              className="bg-[#16730F] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#145a0c] disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreationModal;