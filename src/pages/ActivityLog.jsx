import React, { useState } from "react";
import { Image, FileText, Briefcase, Video, Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { PostCard } from "../components/card/PostCard";
import NewsFeedLayout from "../components/layout/NewsFeedLayout";

const MOCK_POSTS = [
  {
    id: 1,
    type: "post",
    content:
      "Excited to share that I just completed my AWS certification! 🎉 The journey was tough but worth every moment. Special thanks to everyone who supported me.",
    date: "2026-05-20T10:30:00",
    likes: 142,
    comments: 28,
    shares: 9,
    media: null,
  },
  {
    id: 2,
    type: "job",
    content:
      "Applied for Senior Frontend Engineer at TechCorp. Fingers crossed! 🤞",
    date: "2026-05-18T14:00:00",
    likes: 34,
    comments: 7,
    shares: 0,
    media: null,
  },
  {
    id: 3,
    type: "image",
    content:
      "Team lunch with the crew at the Lagos Tech Summit. Incredible conversations about the future of AI in Africa. 🌍",
    date: "2026-05-15T09:00:00",
    likes: 210,
    comments: 45,
    shares: 12,
    media:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
  },
  {
    id: 4,
    type: "post",
    content:
      "Hot take: The best skill a developer can have in 2026 is knowing how to ask AI the right questions. Prompt engineering is the new coding.",
    date: "2026-05-10T16:45:00",
    likes: 398,
    comments: 93,
    shares: 67,
    media: null,
  },
  {
    id: 5,
    type: "video",
    content:
      "Just dropped a new tutorial on building scalable React apps with TanStack Query. Link in bio!",
    date: "2026-05-05T11:20:00",
    likes: 523,
    comments: 110,
    shares: 88,
    media:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
  },
];

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

export default function ActivityLog() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filters = [
    { value: "all", label: "All" },
    { value: "post", label: "Posts" },
    { value: "image", label: "Photos" },
    { value: "video", label: "Videos" },
    { value: "job", label: "Jobs" },
  ];

  const filtered = MOCK_POSTS.filter((p) => {
    const matchFilter = filter === "all" || p.type === filter;
    const matchSearch = p.content.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <NewsFeedLayout classes={false} showSidebars={false}>
      <div className="h-full w-full max-w-screen-xl mx-auto flex flex-col">
        {/* Header */}
        <div className="bg-[#1A3E32] px-6 py-4 flex-shrink-0">
          <h1 className="text-white font-bold text-xl">Activity Log</h1>
          <p className="text-green-200 text-sm mt-0.5">
            Everything you've shared on Bejite
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your posts..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3E32]/30"
              />
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === f.value
                      ? "bg-[#1A3E32] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Posts", value: MOCK_POSTS.length },
                {
                  label: "Total Likes",
                  value: MOCK_POSTS.reduce((s, p) => s + p.likes, 0),
                },
                {
                  label: "Total Shares",
                  value: MOCK_POSTS.reduce((s, p) => s + p.shares, 0),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl border border-gray-100 p-3 text-center"
                >
                  <p className="text-xl font-bold text-[#1A3E32]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Posts */}
            <AnimatePresence>
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No activity found</p>
                </div>
              ) : (
                filtered.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </NewsFeedLayout>
  );
}
