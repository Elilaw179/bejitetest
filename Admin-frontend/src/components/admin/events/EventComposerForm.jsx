import { useState } from "react";
import {
  ArrowLeft,
  Image as ImageIcon,
  CalendarDays,
  Clock,
  MapPin,
  Video,
  Hash,
  Type,
  FileText,
  ChevronDown,
  X,
  Send,
  Loader2,
  Users,
} from "lucide-react";

const CATEGORIES = ["Technology", "Finance", "Product", "Creative"];

const COVER_PRESETS = [
  { name: "Tech & AI", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80" },
  { name: "Finance", url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80" },
  { name: "UX Design", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80" },
  { name: "Marketing", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80" },
  { name: "Healthcare", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80" },
  { name: "Education", url: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&q=80" },
];

/* ─── Reusable Field Wrapper ─── */
const Field = ({ label, icon: Icon, required, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
      {Icon && <Icon size={13} className="text-gray-400" />}
      {label}
      {required && <span className="text-rose-400">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:border-[#16730F] focus:ring-2 focus:ring-[#16730F]/10 outline-none transition-all placeholder:text-gray-400";

const selectClass =
  "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:border-[#16730F] focus:ring-2 focus:ring-[#16730F]/10 outline-none transition-all appearance-none cursor-pointer";

export default function EventComposerForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const isEditing = !!initialData?.id;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    description: initialData?.description || "",
    category: initialData?.category || "Technology",
    type: initialData?.type || "virtual",
    date: initialData?.date || "",
    time: initialData?.time || "",
    host: initialData?.host || "",
    seats: initialData?.seats || 50,
    coverImg: initialData?.coverImg || COVER_PRESETS[0].url,
    tags: initialData?.tags || [],
    link: initialData?.link || "",
    location: initialData?.location || "",
  });

  const [tagInput, setTagInput] = useState("");

  const handleChange = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag) && form.tags.length < 6) {
      handleChange("tags", [...form.tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (t) => handleChange("tags", form.tags.filter((x) => x !== t));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time || !form.host) {
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ─── Back button ─── */}
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#16730F] transition-colors font-medium cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to list
      </button>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Form header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditing ? "Edit Event" : "Create New Event"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEditing
              ? "Update the event details below."
              : "Fill in the details below to publish a partner event."}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Cover Presets */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-2">
              <ImageIcon size={13} className="text-gray-400" /> Cover Image
            </label>
            <div className="flex gap-2 flex-wrap">
              {COVER_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.url}
                  onClick={() => handleChange("coverImg", preset.url)}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    form.coverImg === preset.url
                      ? "border-[#16730F] ring-2 ring-[#16730F]/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  {form.coverImg === preset.url && (
                    <div className="absolute inset-0 bg-[#16730F]/30 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#16730F]" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Summary */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Event Title" icon={Type} required>
              <input
                type="text"
                placeholder="e.g. AI Summit 2026"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={inputClass}
                maxLength={80}
              />
              <p className="text-right text-[10px] text-gray-400 mt-0.5">
                {form.title.length}/80
              </p>
            </Field>
            <Field label="Hosted by" icon={Users} required>
              <input
                type="text"
                placeholder="e.g. Google Nigeria"
                value={form.host}
                onChange={(e) => handleChange("host", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Short Summary" icon={FileText}>
            <textarea
              placeholder="A brief one-liner shown in the event card..."
              value={form.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
              className={`${inputClass} resize-none`}
              rows={2}
              maxLength={150}
            />
            <p className="text-right text-[10px] text-gray-400 mt-0.5">
              {form.summary.length}/150
            </p>
          </Field>

          <Field label="Full Description">
            <textarea
              placeholder="Detailed event description, agenda, speakers..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`${inputClass} resize-none`}
              rows={4}
            />
          </Field>

          {/* Category / Type */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Category" icon={Hash}>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className={selectClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none text-gray-400" />
              </div>
            </Field>

            <Field label="Event Type">
              <div className="flex gap-2">
                {[
                  { val: "virtual", icon: Video, label: "Virtual" },
                  { val: "in-person", icon: MapPin, label: "In Person" },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.val}
                    onClick={() => handleChange("type", opt.val)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      form.type === opt.val
                        ? "bg-[#16730F] text-white border-[#16730F]"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <opt.icon size={14} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Total Seats">
              <input
                type="number"
                min={1}
                max={5000}
                value={form.seats}
                onChange={(e) => handleChange("seats", +e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          {/* Date / Time / Link */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Date" icon={CalendarDays} required>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Time" icon={Clock} required>
              <input
                type="time"
                value={form.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label={form.type === "virtual" ? "Meeting Link" : "Location"} icon={form.type === "virtual" ? Video : MapPin}>
              <input
                type="text"
                placeholder={form.type === "virtual" ? "https://zoom.us/j/..." : "Victoria Island, Lagos"}
                value={form.type === "virtual" ? form.link : form.location}
                onChange={(e) =>
                  handleChange(form.type === "virtual" ? "link" : "location", e.target.value)
                }
                className={inputClass}
              />
            </Field>
          </div>

          {/* Tags */}
          <Field label="Tags" icon={Hash}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-[#16730F]/10 text-[#16730F] text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="px-3 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-semibold hover:bg-gray-200 disabled:opacity-40 transition-all cursor-pointer"
              >
                Add
              </button>
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !form.title || !form.date || !form.time || !form.host}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#16730F] text-white text-sm font-bold rounded-xl hover:bg-[#0e4a09] disabled:opacity-40 transition-all cursor-pointer shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            {isEditing ? "Update Event" : "Publish Event"}
          </button>
        </div>
      </div>
    </form>
  );
}
