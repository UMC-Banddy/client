import React, { useState } from "react";
import AlbumCard from "./AlbumCard";

interface Album {
  image: string;
  title: string;
  description: string;
}

interface AlbumCarouselProps {
  albums: Album[];
  onJoin?: (album: Album) => void;
  onLike?: (album: Album) => void;
  onMute?: (album: Album) => void;
  className?: string;
}

const AlbumCarousel = ({
  albums,
  onJoin,
  onLike,
  onMute,
  className = "",
}: AlbumCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const total = albums.length;
  const goPrev = () => setCurrent((prev) => (prev - 1 + total) % total);
  const goNext = () => setCurrent((prev) => (prev + 1) % total);
  const album = albums[current];

  return (
    <div
      className={`relative flex flex-col items-center w-full max-w-xs md:max-w-md mx-auto min-h-[420px] gap-8 ${className}`}
    >
      {/* 좌우 버튼 */}
      <button
        onClick={goPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-lg text-black hover:bg-[#FF453A] transition outline-none focus:ring-2 focus:ring-[#FF3B30] border border-gray-200"
        aria-label="이전 앨범"
        tabIndex={0}
        style={{ marginLeft: "-24px" }}
      >
        <span className="text-2xl md:text-3xl font-bold">&#60;</span>
      </button>
      <div className="flex-1 flex items-center justify-center">
        <AlbumCard
          image={album.image}
          title={album.title}
          description={album.description}
          onJoin={() => onJoin?.(album)}
          onLike={() => onLike?.(album)}
          onMute={() => onMute?.(album)}
        />
      </div>
      <button
        onClick={goNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-lg text-black hover:bg-[#FF453A] transition outline-none focus:ring-2 focus:ring-[#FF3B30] border border-gray-200"
        aria-label="다음 앨범"
        tabIndex={0}
        style={{ marginRight: "-24px" }}
      >
        <span className="text-2xl md:text-3xl font-bold">&#62;</span>
      </button>
      {/* 인디케이터 */}
      <div className="flex gap-2 mt-6">
        {albums.map((_, idx) => (
          <div
            key={idx}
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
              idx === current ? "bg-[#FF3B30] scale-110" : "bg-[#8E8E93]"
            }`}
            aria-label={idx === current ? "현재 앨범" : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default AlbumCarousel;
