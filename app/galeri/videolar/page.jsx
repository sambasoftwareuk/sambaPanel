"use client";

import { useState, useEffect } from "react";
import { Header1 } from "../../_atoms/Headers";
import VideoCard from "../../_molecules/VideoCard";
import Modal from "../../_molecules/Modal";
import { SambaSlider } from "../../_molecules/Slider";
import galleryVideos from "../../mocks/galleryVideos.json";

const Videos = () => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);

  const handleVideoClick = (videoLink, title, index) => {
    setSelectedVideoIndex(index);
  };

  const closeModal = () => {
    setSelectedVideoIndex(null);
  };

  // Slider değiştiğinde önceki videoları durdur
  const handleSlideChange = (newIndex) => {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      if (iframe.src && iframe.src.includes("youtube.com")) {
        const videoId = iframe.src.match(/embed\/([a-zA-Z0-9_-]+)/)?.[1];
        if (videoId) {
          iframe.src = iframe.src.replace(/autoplay=1/, "autoplay=0");
        }
      }
    });
  };

  // Modal açıldığında tüm iframe'leri durdur
  useEffect(() => {
    if (selectedVideoIndex !== null) {
      const iframes = document.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        if (iframe.src && iframe.src.includes("youtube.com")) {
          const videoId = iframe.src.match(/embed\/([a-zA-Z0-9_-]+)/)?.[1];
          if (videoId) {
            iframe.src = iframe.src.replace(/autoplay=1/, "autoplay=0");
          }
        }
      });
    }
  }, [selectedVideoIndex]);

  // YouTube URL'sine parametreler ekle
  const getEnhancedVideoUrl = (videoLink, shouldAutoplay = true) => {
    const baseUrl = videoLink;
    const params = new URLSearchParams({
      autoplay: shouldAutoplay ? "1" : "0",
      controls: "1", 
      disablekb: "0", 
      fs: "1", 
      iv_load_policy: "3",
      modestbranding: "1",
      rel: "0",
      showinfo: "1", 
      loop: "1",
      playlist: videoLink.split("/").pop(),
      mute: "0", 
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto">
      <Header1 className="mb-6 text-center">Videolar</Header1>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {galleryVideos.map((video, index) => (
          <VideoCard
            key={video.id}
            thumbnailLink={video.thumbnailLink}
            videoLink={video.videoLink}
            title={video.title}
            description={video.description}
            onVideoClick={(videoLink, title) =>
              handleVideoClick(videoLink, title, index)
            }
          />
        ))}
      </div>

      {/* Video Modal with Slider */}
      {selectedVideoIndex !== null && (
        <Modal onClose={closeModal}>
          <div className="w-full max-w-6xl mx-auto">
            <SambaSlider
              itemsPerSlide={1}
              isScroll={false}
              isInfinite={true}
              showDots={true}
              showArrows={true}
              size="lg"
              initialSlide={selectedVideoIndex}
              onSlideChange={handleSlideChange}
            >
              {galleryVideos.map((video, index) => (
                <div
                  key={index}
                  className="w-full h-full flex justify-center items-center"
                >
                  <div className="w-full max-w-4xl">
                    <h3 className="text-lg font-semibold mb-4 text-white text-center">
                      {video.title}
                    </h3>
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <iframe
                        key={`video-${index}-${selectedVideoIndex}`}
                        src={getEnhancedVideoUrl(
                          video.videoLink,
                          index === selectedVideoIndex
                        )}
                        title={video.title}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              ))}
            </SambaSlider>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Videos;
