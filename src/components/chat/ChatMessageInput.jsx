import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { fileToDataUrl, inferUploadKind } from '../../utils/chatAttachmentUtils';
import messagingService from '../../services/messagingService';

function ChatMessageInput({
  message,
  setMessage,
  onSend,
  onSendAttachment,
  disabled = false,
  sending = false,
}) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState(null);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const docInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordChunksRef = useRef([]);
  const emojiRef = useRef(null);
  const attachRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
      if (attachRef.current && !attachRef.current.contains(e.target)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const insertEmoji = (emoji) => {
    setMessage((prev) => `${prev || ''}${emoji}`);
  };

  const handleEmojiClick = (emojiData) => {
    insertEmoji(emojiData.emoji);
  };

  const uploadAndSend = async (file, kindOverride) => {
    if (!file || uploading || disabled) return;
    try {
      setUploading(true);
      setRecordError(null);
      const kind = kindOverride || inferUploadKind(file);
      const dataUrl = await fileToDataUrl(file);
      const { url } = await messagingService.uploadChatMedia(dataUrl, kind);
      const label =
        kind === 'image'
          ? ''
          : kind === 'video'
            ? '🎬 Video'
            : kind === 'audio'
              ? '🎤 Voice message'
              : `📎 ${file.name || 'Document'}`;
      await onSendAttachment(url, label);
    } catch (err) {
      console.error('Upload failed:', err);
      setRecordError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
      setShowAttachMenu(false);
    }
  };

  const handleFileChange = (e, kindOverride) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) uploadAndSend(file, kindOverride);
  };

  const startRecording = async () => {
    if (recording || uploading || disabled) return;
    setRecordError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordChunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) recordChunksRef.current.push(ev.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(recordChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        const file = new File([blob], `voice-${Date.now()}.webm`, {
          type: blob.type,
        });
        await uploadAndSend(file, 'audio');
        setRecording(false);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
      setRecordError('Microphone access denied or unavailable');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleVoiceClick = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSendClick = () => {
    if (message.trim() && !sending && !uploading) {
      onSend();
    }
  };

  const busy = sending || uploading || disabled;

  return (
    <div className="shrink-0 p-2 md:p-4 bg-gray-100">
      {recordError && (
        <p className="text-red-500 text-xs mb-2 px-1">{recordError}</p>
      )}
      {recording && (
        <p className="text-[#16730F] text-xs mb-2 px-1 font-medium animate-pulse">
          Recording… tap microphone again to send
        </p>
      )}
      {uploading && (
        <p className="text-gray-500 text-xs mb-2 px-1">Uploading attachment…</p>
      )}

      <div className="flex flex-col gap-1 md:gap-2 border border-gray-300 rounded-2xl px-3 md:px-4 py-2 md:py-3 bg-gray-100 shadow-sm">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendClick()}
          placeholder="Type a message"
          disabled={busy}
          className="flex-1 outline-none text-xs md:text-sm bg-transparent placeholder-gray-400 disabled:opacity-50"
        />

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="relative" ref={emojiRef}>
              <button
                type="button"
                onClick={() => {
                  setShowEmoji((v) => !v);
                  setShowAttachMenu(false);
                }}
                disabled={busy}
                className="text-gray-500 hover:text-green-600 text-base md:text-lg disabled:opacity-50"
                aria-label="Add emoji"
              >
                😊
              </button>
              {showEmoji && (
                <div className="absolute bottom-full left-0 mb-2 z-30 rounded-xl shadow-lg overflow-hidden">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={320}
                    height={400}
                    searchPlaceholder="Search emojis…"
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              )}
            </div>

            <div className="relative" ref={attachRef}>
              <button
                type="button"
                onClick={() => {
                  setShowAttachMenu((v) => !v);
                  setShowEmoji(false);
                }}
                disabled={busy}
                className="text-gray-500 hover:text-green-600 text-base md:text-lg disabled:opacity-50"
                aria-label="Attach file"
              >
                ＋
              </button>
              {showAttachMenu && (
                <div className="absolute bottom-full left-0 mb-2 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[140px]">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Video
                  </button>
                  <button
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Document
                  </button>
                </div>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'image')}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'video')}
              />
              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'document')}
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2">
            <button
              type="button"
              onClick={handleVoiceClick}
              disabled={uploading || disabled}
              className={`text-base md:text-lg disabled:opacity-50 ${
                recording
                  ? 'text-red-500 animate-pulse'
                  : 'text-gray-500 hover:text-green-600'
              }`}
              aria-label={recording ? 'Stop recording' : 'Record voice'}
            >
              🎤
            </button>
            <button
              type="button"
              onClick={handleSendClick}
              disabled={busy || !message.trim()}
              className="bg-gray-700 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-full p-1 md:p-2 transition"
              aria-label="Send message"
            >
              {sending ? '...' : '➤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessageInput;
