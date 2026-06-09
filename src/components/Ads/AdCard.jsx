import { useState } from "react";
import {
  ExternalLink,
  Heart,
  Share2,
  Bookmark,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdCard({
  ad,
  onInteraction,
  onClose,
  isSponsored = true,
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (ad.landingDestination) {
      onInteraction?.("click", ad.id);
      window.open(ad.landingDestination, "_blank");
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    onInteraction?.("like", ad.id);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setSaved(!saved);
    onInteraction?.("save", ad.id);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    onInteraction?.("share", ad.id);
    navigator
      .share?.({
        title: ad.headline,
        text: ad.description,
        url: ad.landingDestination,
      })
      .catch(() => console.log("Share cancelled"));
  };

  const description = ad.description || "";
  const shouldTruncate = description.length > 150;
  const displayDescription =
    shouldTruncate && !expanded
      ? description.substring(0, 150) + "..."
      : description;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isSponsored && (
            <>
              <span className="text-xs text-gray-500 font-medium">
                Sponsored
              </span>
              <span className="text-xs bg-[#1A3E32]/10 text-[#1A3E32] px-2 py-0.5 rounded-full font-medium">
                AdPro
              </span>
            </>
          )}
        </div>
        {onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(ad.id);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4 cursor-pointer" onClick={handleClick}>
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
          {ad.headline}
        </h3>

        {ad.mediaUrl && (
          <div className="mb-3 rounded-xl overflow-hidden bg-gray-100">
            {ad.mediaType === "image" ? (
              <img
                src={ad.mediaUrl}
                alt={ad.headline}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <video
                src={ad.mediaUrl}
                className="w-full h-48 object-cover"
                controls
                onClick={(e) => e.stopPropagation()}
                poster={ad.posterUrl}
              />
            )}
          </div>
        )}

        <p className="text-gray-600 text-sm leading-relaxed">
          {displayDescription}
          {shouldTruncate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="text-[#1A3E32] font-medium ml-1 hover:underline inline-flex items-center gap-0.5"
            >
              {expanded ? "See less" : "See more"}
              {expanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          )}
        </p>

        <div className="mt-4">
          <button
            onClick={handleClick}
            className="bg-[#1A3E32] text-white px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-[#2d6a54] transition-all hover:gap-3"
          >
            Learn More <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-around bg-gray-50/50">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm transition-all duration-200 ${
            liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${liked ? "fill-current scale-110" : ""}`}
          />
          <span>Like</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1A3E32] transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 text-sm transition-all duration-200 ${
            saved ? "text-[#1A3E32]" : "text-gray-500 hover:text-[#1A3E32]"
          }`}
        >
          <Bookmark
            className={`w-4 h-4 transition-transform ${saved ? "fill-current" : ""}`}
          />
          <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>
    </div>
  );
}
