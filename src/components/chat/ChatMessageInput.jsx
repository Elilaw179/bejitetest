import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { fileToDataUrl, inferUploadKind, simpleAudioMime } from '../../utils/chatAttachmentUtils';
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
  const textareaRef = useRef(null);
  const [emojiPickerWidth, setEmojiPickerWidth] = useState(320);

  const adjustTextareaHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  useEffect(() => {
    const updateWidth = () => {
      setEmojiPickerWidth(Math.min(320, Math.max(260, window.innerWidth - 32)));
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

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
      const audioMime = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';
      const recorder = audioMime
        ? new MediaRecorder(stream, { mimeType: audioMime })
        : new MediaRecorder(stream);
      recordChunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) recordChunksRef.current.push(ev.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const mime = simpleAudioMime(recorder.mimeType);
        const ext = mime.includes('mp4') ? 'm4a' : 'webm';
        const blob = new Blob(recordChunksRef.current, { type: mime });
        const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: mime });
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
    <div className="shrink-0 z-20 px-2 pt-2 md:px-4 md:pt-3 bg-gray-100 border-t border-gray-200 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
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

      <div className="flex flex-col gap-1 border border-[#16730F] rounded-[2rem] px-4 md:px-5 pt-2.5 pb-2 md:pt-3 md:pb-2.5 bg-[#F3F3F3] shadow-sm">
        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendClick();
            }
          }}
          placeholder="Type a message"
          disabled={busy}
          className="w-full outline-none text-xs md:text-sm bg-transparent text-[#1A3E32] placeholder:text-[#A89B72] disabled:opacity-50 leading-normal resize-none overflow-y-auto max-h-32 break-words"
        />

        <div className="flex justify-between items-center min-h-0">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative" ref={emojiRef}>
              <button
                type="button"
                onClick={() => {
                  setShowEmoji((v) => !v);
                  setShowAttachMenu(false);
                }}
                disabled={busy}
                className="inline-flex items-center justify-center shrink-0 hover:opacity-80 disabled:opacity-50"
                aria-label="Add emoji"
              >
                <img
                  src="/assets/images/Smily.svg"
                  alt=""
                  className="block w-5 h-5"
                />
              </button>
              {showEmoji && (
                <div className="absolute bottom-full left-0 mb-2 z-30 rounded-xl shadow-lg overflow-hidden">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={emojiPickerWidth}
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
                className="inline-flex items-center justify-center shrink-0 hover:opacity-80 disabled:opacity-50"
                aria-label="Attach file"
              >
                <img
                  src="/assets/images/Plus_Icon.svg"
                  alt=""
                  className="block w-4 h-4"
                />
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

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={handleVoiceClick}
              disabled={uploading || disabled}
              className={`inline-flex items-center justify-center shrink-0 disabled:opacity-50 ${
                recording ? 'animate-pulse opacity-80' : 'hover:opacity-80'
              }`}
              aria-label={recording ? 'Stop recording' : 'Record voice'}
            >
              <img
                src="/assets/images/microphone.png"
                alt=""
                className={`block w-5 h-5 ${recording ? 'opacity-70' : ''}`}
              />
            </button>
            <button
              type="button"
              onClick={handleSendClick}
              disabled={busy || !message.trim()}
              className="inline-flex items-center justify-center shrink-0 disabled:opacity-50 transition"
              aria-label="Send message"
            >
              {sending ? (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1A3E32] text-white text-xs">
                  ...
                </span>
              ) : (
                <img
                  src="/assets/images/chat_send.svg"
                  alt=""
                  className="block w-8 h-8 md:w-9 md:h-9"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessageInput;
