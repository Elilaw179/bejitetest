import React, { useRef, useState } from "react";
import { Camera, Upload } from "lucide-react";
import NavigationButtons from "../../components/NavigationButtons";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const CoperateUploadDoc = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl("");
      }
    }
  };

  const handleUpload = () => {
    if (fileName) {
      // Simulate upload logic
      setIsUploaded(true);
    }
  };

  const isFormComplete = isUploaded;

  return (
    <div className="min-h-screen bg-white px-4 text-center">
      <Header />

      <div className="max-w-4xl mx-auto mt-6 flex flex-col items-center justify-center gap-8 p-4">
        {/* Instructions */}
        <div className="text-xs text-black mb-6 text-center max-w-lg">
          <p className="font-semibold mb-2">Instructions:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              Upload an ID card (PDF/PNG) 
            </li>
            <li>Supported formats: PNG, JPG, PDF (max 2MB)</li>
          </ul>
        </div>

        {/* Upload Section */}
        <div className="w-full max-w-lg">

          {/* Preview Area */}
          <div className="w-full h-60 bg-gray-200 rounded-md flex items-center justify-center mb-4 overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="object-contain h-full w-full "
              />
            ) : (
              <Camera className="w-10 h-10 text-gray-500" />
            )}
          </div>

          {/* Choose File (hide only after upload) */}
          {!isUploaded && (
            <div className="mb-3">
              <label
                htmlFor="file-upload"
                className="cursor-pointer border overflow-hidden border-green-700 rounded-md px-4 py-3 flex items-center justify-center gap-2 text-green-700"
              >
                <Upload className="w-4 h-4" />
                {fileName || "Choose File"}
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/png, image/jpeg, application/pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Upload or Uploaded Button */}
          <button
            onClick={handleUpload}
            disabled={!fileName || isUploaded}
            className={`w-full py-3 rounded-md font-semibold transition ${
              isUploaded
                ? "bg-gray-500 text-white cursor-not-allowed"
                : fileName
                ? "bg-green-700 text-white hover:bg-green-800"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {isUploaded ? "Uploaded" : "Upload"}
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <NavigationButtons
        isFormComplete={isFormComplete}
        onBack={() => navigate(-1)}
        onNext={() => isFormComplete && navigate("/coperate/inreview")}
      />
    </div>
  );
};

export default CoperateUploadDoc;
