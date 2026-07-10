import { useRef, useEffect, useState, useCallback } from "react";
import {
  Sparkles,
  Code,
  Image as ImageIcon,
  FileText,
  Bold,
  Italic,
  List,
  Upload,
  ChevronUp,
  ChevronDown,
  ArrowDownToLine,
} from "lucide-react";
import { toast } from "react-toastify";

import FontSelectorDropdown from "./FontSelectorDropdown";
import VisualCropWorkspace from "./VisualCropWorkspace";
import AttachmentsList from "./AttachmentsList";

const IMAGE_PRESETS = [
  {
    name: "Career Growth Banner",
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Interview Guidance Banner",
    url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=60",
  },
];

const FONT_SIZE_LABELS = {
  1: "X-Small (10px)",
  2: "Small (13px)",
  3: "Normal (16px)",
  4: "Large (18px)",
  5: "X-Large (24px)",
  6: "Huge (32px)",
  7: "Giant (48px)",
};

let globalImgCounter = 0;
const getNextImageId = () => {
  globalImgCounter += 1;
  return `camp-img-${globalImgCounter}`;
};

const ComposeEmailStep = ({
  campaignForm = {},
  setCampaignForm = () => {},
  onNavigateTemplates = () => {},
}) => {
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [showImagePresets, setShowImagePresets] = useState(false);
  const [currentFontName, setCurrentFontName] = useState("Sans-Serif (Clean)");

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    h1: false,
    h2: false,
    h3: false,
    h4: false,
    h5: false,
    ul: false,
    ol: false,
  });
  const [fontSize, setFontSize] = useState(3);

  const selectedImgRef = useRef(null);
  const [selectedImgId, setSelectedImgId] = useState(null);
  const [selectedImgSrc, setSelectedImgSrc] = useState(null);
  const [imgWidth, setImgWidth] = useState(100);
  const [imgAlign, setImgAlign] = useState("center");
  const [imgAspect, setImgAspect] = useState("cover");
  const [cropTop, setCropTop] = useState(0);
  const [cropRight, setCropRight] = useState(0);
  const [cropBottom, setCropBottom] = useState(0);
  const [cropLeft, setCropLeft] = useState(0);

  useEffect(() => {
    if (
      editorRef.current &&
      campaignForm.body &&
      editorRef.current.innerHTML !== campaignForm.body
    ) {
      editorRef.current.innerHTML = campaignForm.body;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateActiveFormats = () => {
    if (!editorRef.current) return;
    const blockVal = document.queryCommandValue("formatBlock");
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      h1: blockVal === "h1" || blockVal === "H1",
      h2: blockVal === "h2" || blockVal === "H2",
      h3: blockVal === "h3" || blockVal === "H3",
      h4: blockVal === "h4" || blockVal === "H4",
      h5: blockVal === "h5" || blockVal === "H5",
      ul: document.queryCommandState("insertUnorderedList"),
      ol: document.queryCommandState("insertOrderedList"),
    });

    const sizeVal = document.queryCommandValue("fontSize");
    if (sizeVal) setFontSize(parseInt(sizeVal, 10));
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      if (document.activeElement === editorRef.current) updateActiveFormats();
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      setCampaignForm((prev) => ({
        ...prev,
        body: editorRef.current.innerHTML,
      }));
    }
  }, [setCampaignForm]);

  const handleEditorClick = (e) => {
    if (e.target.tagName === "IMG") {
      selectedImgRef.current = e.target;
      setSelectedImgId(e.target.id || "selected-img");
      setSelectedImgSrc(e.target.src);
      setImgWidth(
        e.target.style.width ? parseInt(e.target.style.width, 10) : 100,
      );
      setImgAspect(e.target.style.objectFit || "cover");

      const clip = e.target.style.clipPath || "";
      if (clip.startsWith("inset")) {
        const matches = clip.match(/\d+/g);
        if (matches && matches.length >= 4) {
          setCropTop(Number(matches[0]));
          setCropRight(Number(matches[1]));
          setCropBottom(Number(matches[2]));
          setCropLeft(Number(matches[3]));
        }
      } else {
        setCropTop(0);
        setCropRight(0);
        setCropBottom(0);
        setCropLeft(0);
      }
    } else {
      selectedImgRef.current = null;
      setSelectedImgId(null);
      setSelectedImgSrc(null);
    }
    updateActiveFormats();
  };

  const runCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    handleEditorInput();
    if (editorRef.current) editorRef.current.focus();
    updateActiveFormats();
  };

  const formatBlock = (tag) => runCommand("formatBlock", tag);

  const handleFontSelect = (font) => {
    setCurrentFontName(font.name);
    runCommand("fontName", font.value);
  };

  const handleFontSizeChange = (increase) => {
    const newSize = increase
      ? Math.min(7, fontSize + 1)
      : Math.max(1, fontSize - 1);
    setFontSize(newSize);
    runCommand("fontSize", newSize.toString());
  };

  const insertPlaceholder = (placeholder) => {
    runCommand("insertText", placeholder);
    toast.success(`Inserted: ${placeholder}`);
  };

  const triggerImageUpload = () => {
    if (imageInputRef.current) imageInputRef.current.click();
  };

  const triggerDocUpload = () => {
    if (docInputRef.current) docInputRef.current.click();
  };

  const handleImageFileLoad = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) =>
        ev.target?.result && handleInsertImage(ev.target.result);
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleDocFileLoad = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr =
        file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
          : (file.size / 1024).toFixed(0) + " KB";
      setCampaignForm({
        ...campaignForm,
        attachments: [
          ...(campaignForm.attachments || []),
          { name: file.name, size: sizeStr },
        ],
      });
      toast.success(`Attached: ${file.name}`);
    }
    e.target.value = "";
  };

  const handleInsertImage = (url) => {
    const html = `<img src="${url}" class="rounded-xl my-4 max-w-full select-none cursor-pointer border-2 border-transparent hover:border-[#16730F] transition-all" style="width: 100%; display: block; margin-left: auto; margin-right: auto;" id="${getNextImageId()}" />&nbsp;`;
    runCommand("insertHTML", html);
    setShowImagePresets(false);
    toast.success("Image banner inserted!");
  };

  const handleRemoveAttachment = (idx) => {
    const updated = (campaignForm.attachments || []).filter(
      (_, i) => i !== idx,
    );
    setCampaignForm({ ...campaignForm, attachments: updated });
    toast.info("Attachment removed.");
  };

  const updateImageWidth = (val) => {
    const selectedImg = selectedImgRef.current;
    if (selectedImg) {
      selectedImg.style.width = `${val}%`;
      setImgWidth(val);
      handleEditorInput();
    }
  };

  const updateImageAspect = (mode) => {
    const selectedImg = selectedImgRef.current;
    if (selectedImg) {
      selectedImg.style.objectFit = mode;
      setImgAspect(mode);
      handleEditorInput();
    }
  };

  const updateImageAlign = (align) => {
    const selectedImg = selectedImgRef.current;
    if (selectedImg) {
      setImgAlign(align);
      selectedImg.style.marginLeft = align === "left" ? "0" : "auto";
      selectedImg.style.marginRight = align === "right" ? "0" : "auto";
      handleEditorInput();
    }
  };

  const deleteSelectedImage = () => {
    if (selectedImgRef.current) {
      selectedImgRef.current.remove();
      selectedImgRef.current = null;
      setSelectedImgId(null);
      setSelectedImgSrc(null);
      handleEditorInput();
      toast.info("Image removed.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (ev) =>
            ev.target?.result && handleInsertImage(ev.target.result);
          reader.readAsDataURL(file);
        } else {
          const sizeStr =
            file.size > 1024 * 1024
              ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
              : (file.size / 1024).toFixed(0) + " KB";
          setCampaignForm({
            ...campaignForm,
            attachments: [
              ...(campaignForm.attachments || []),
              { name: file.name, size: sizeStr },
            ],
          });
          toast.success(`Attached drop file: ${file.name}`);
        }
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageFileLoad}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={docInputRef}
        onChange={handleDocFileLoad}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div className="text-left">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Compose Email Message
          </h3>
          <p className="text-gray-500 text-xs">
            Write your email body. Drag and drop file uploads supported.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateTemplates}
          className="text-[#16730F] text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
        >
          <Sparkles size={14} />
          Load Template Layout
        </button>
      </div>

      <div className="space-y-4">
        <div className="text-left">
          <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Placeholders (Click to insert):
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              "{First Name}",
              "{Profession}",
              "{Job Link}",
              "{Unsubscribe Link}",
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertPlaceholder(tag)}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 cursor-pointer transition-all animate-fadeIn"
              >
                + {tag.replace("{", "").replace("}", "")}
              </button>
            ))}
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingFile(true);
          }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={handleDrop}
          className={`border rounded-2xl overflow-hidden shadow-sm transition-all relative ${
            isDraggingFile
              ? "border-dashed border-green-500 bg-green-50/20 scale-[1.01] border-2"
              : "border-gray-300 bg-white"
          }`}
        >
          {isDraggingFile && (
            <div className="absolute inset-0 bg-green-50/90 flex flex-col items-center justify-center z-50 text-[#16730F] pointer-events-none animate-fadeIn">
              <ArrowDownToLine size={48} className="animate-bounce mb-3" />
              <span className="font-extrabold text-lg">
                Drop Files to Upload
              </span>
            </div>
          )}

          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5 flex flex-wrap items-center gap-1.5 shadow-inner">
            <FontSelectorDropdown
              currentFontName={currentFontName}
              onSelectFont={handleFontSelect}
            />
            <span className="h-4 w-px bg-gray-300 mx-1" />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runCommand("bold")}
              className={`p-1.5 rounded cursor-pointer transition-all ${
                activeFormats.bold
                  ? "bg-[#16730F] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              title="Bold"
            >
              <Bold size={16} />
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runCommand("italic")}
              className={`p-1.5 rounded cursor-pointer transition-all ${
                activeFormats.italic
                  ? "bg-[#16730F] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <span className="h-4 w-px bg-gray-300 mx-1" />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleFontSizeChange(true)}
              className="p-1.5 rounded text-gray-600 hover:bg-gray-200 cursor-pointer flex items-center gap-0.5"
              title="Increase Size"
            >
              <ChevronUp size={16} />
              <span className="text-[10px] font-bold">A+</span>
            </button>

            <span
              className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm min-w-[95px] text-center select-none"
              style={{ userSelect: "none" }}
            >
              {FONT_SIZE_LABELS[fontSize] || "Normal (16px)"}
            </span>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleFontSizeChange(false)}
              className="p-1.5 rounded text-gray-600 hover:bg-gray-200 cursor-pointer flex items-center gap-0.5"
              title="Decrease Size"
            >
              <ChevronDown size={16} />
              <span className="text-[10px] font-bold">A-</span>
            </button>
            <span className="h-4 w-px bg-gray-300 mx-1" />

            {["h1", "h2", "h3", "h4", "h5"].map((h) => (
              <button
                key={h}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => formatBlock(`<${h}>`)}
                className={`p-1.5 rounded text-xs font-extrabold cursor-pointer uppercase transition-all ${
                  activeFormats[h]
                    ? "bg-[#16730F] text-white font-bold"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {h}
              </button>
            ))}
            <span className="h-4 w-px bg-gray-300 mx-1" />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runCommand("insertUnorderedList")}
              className={`p-1.5 rounded cursor-pointer transition-all ${
                activeFormats.ul
                  ? "bg-[#16730F] text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <List size={16} />
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runCommand("insertOrderedList")}
              className={`p-1.5 rounded cursor-pointer transition-all text-xs font-bold ${
                activeFormats.ol
                  ? "bg-[#16730F] text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              1.
            </button>
            <span className="h-4 w-px bg-gray-300 mx-1" />

            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowImagePresets(!showImagePresets)}
                className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-[#16730F] flex items-center gap-1 cursor-pointer text-xs font-semibold"
              >
                <ImageIcon size={16} />+ Image
              </button>

              {showImagePresets && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl z-30 p-3 space-y-2 text-left">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Select preset banner:
                  </span>

                  <div className="space-y-1.5">
                    {IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInsertImage(preset.url)}
                        className="w-full flex items-center gap-2 p-1 hover:bg-green-50 border border-transparent hover:border-green-100 rounded-lg text-left transition-all cursor-pointer"
                      >
                        <img
                          src={preset.url}
                          alt=""
                          className="w-10 h-7 object-cover rounded"
                        />
                        <span className="text-[10px] text-gray-700 font-bold truncate">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-2 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={triggerImageUpload}
                      className="w-full bg-[#16730F]/15 hover:bg-[#16730F] text-[#16730F] hover:text-white transition-all text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Upload size={12} />
                      Choose Local System Image
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={triggerDocUpload}
              className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-[#16730F] flex items-center gap-1 cursor-pointer text-xs font-semibold"
            >
              <FileText size={16} />+ Attach Document
            </button>
          </div>

          <div
            ref={editorRef}
            contentEditable={true}
            onInput={handleEditorInput}
            onClick={handleEditorClick}
            className="w-full min-h-[300px] max-h-[500px] overflow-y-auto px-6 py-4 bg-white focus:outline-none text-sm text-gray-900 leading-relaxed text-left [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:my-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2.5 [&_h4]:text-base [&_h4]:font-bold [&_h4]:my-2 [&_h5]:text-sm [&_h5]:font-bold [&_h5]:my-1.5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_li]:my-1.5 [&_strong]:font-bold [&_em]:italic"
          />
        </div>

        {selectedImgId && (
          <VisualCropWorkspace
            selectedImgId={selectedImgId}
            selectedImgSrc={selectedImgSrc}
            imgWidth={imgWidth}
            updateImageWidth={updateImageWidth}
            imgAlign={imgAlign}
            updateImageAlign={updateImageAlign}
            imgAspect={imgAspect}
            updateImageAspect={updateImageAspect}
            deleteSelectedImage={deleteSelectedImage}
            cropTop={cropTop}
            setCropTop={setCropTop}
            cropRight={cropRight}
            setCropRight={setCropRight}
            cropBottom={cropBottom}
            setCropBottom={setCropBottom}
            cropLeft={cropLeft}
            setCropLeft={setCropLeft}
            onUpdateStyle={handleEditorInput}
          />
        )}

        <AttachmentsList
          attachments={campaignForm.attachments}
          onRemove={handleRemoveAttachment}
        />

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 text-left">
            <Code size={16} className="text-[#16730F]" />
            Add Call To Action (CTA) Button
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Button Text Label
              </label>
              <input
                type="text"
                placeholder="e.g. Apply Now / Complete Profile"
                value={campaignForm.ctaText || ""}
                onChange={(e) =>
                  setCampaignForm({ ...campaignForm, ctaText: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#16730F] text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Button Link URL
              </label>
              <input
                type="text"
                placeholder="e.g. https://bejite.com/..."
                value={campaignForm.ctaLink || ""}
                onChange={(e) =>
                  setCampaignForm({ ...campaignForm, ctaLink: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#16730F] text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeEmailStep;
