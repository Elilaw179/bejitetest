import { Image, FileText, Briefcase, Video } from "lucide-react";

export const TYPE_ICONS = {
  post: FileText,
  job: Briefcase,
  image: Image,
  video: Video,
};

export const TYPE_COLORS = {
  post: "bg-blue-100 text-blue-600",
  job: "bg-amber-100 text-amber-600",
  image: "bg-purple-100 text-purple-600",
  video: "bg-rose-100 text-rose-600",
};

export const TYPE_LABELS = {
  post: "Post",
  job: "Job Activity",
  image: "Photo",
  video: "Video",
};
