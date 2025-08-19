"use client";

import React, { useState, useEffect } from "react";
import { CardImage } from "../_atoms/images";
import { Play } from "../_atoms/Icons";

const VideoCard = ({
  thumbnailLink,
  videoLink,
  title,
  description,
  onVideoClick,
}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(thumbnailLink);

  // YouTube video ID'sini çıkar
  const getVideoId = (url) => {
    const embedUrl = url;
    const match = embedUrl.match(/embed\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  // YouTube thumbnail URL'lerini test et ve en iyi olanı seç
  const getBestYouTubeThumbnail = async (videoId) => {
    const thumbnailOptions = [
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    ];

    for (const url of thumbnailOptions) {
      try {
        const response = await fetch(url, { method: "HEAD" });
        if (response.ok) {
          return url;
        }
      } catch (error) {
        continue;
      }
    }
    return thumbnailLink; // Fallback to original thumbnail
  };

  useEffect(() => {
    const videoId = getVideoId(videoLink);
    if (videoId) {
      getBestYouTubeThumbnail(videoId).then(setThumbnailUrl);
    }
  }, [videoLink, thumbnailLink]);

  return (
    <div
      className="relative bg-white shadow-md rounded-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
      onClick={() => onVideoClick && onVideoClick(videoLink, title)}
    >
      {/* Video Thumbnail */}
      <div className="relative">
        <CardImage
          imageLink={thumbnailUrl}
          imageAlt={title || "Video thumbnail"}
          aspectRatio="aspect-video"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black bg-opacity-50 rounded-full p-4">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Video Info */}
      {(title || description) && (
        <div className="p-4">
          {title && (
            <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoCard;
