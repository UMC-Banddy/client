import React from "react";

interface ArtistGridItem {
  image: string;
  title: string;
}

interface ArtistGridProps {
  items: ArtistGridItem[];
}

export default function ArtistGrid({ items }: ArtistGridProps) {
  return (
    <div className="flex gap-[3vw] overflow-x-auto scrollbar-hide">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center flex-shrink-0"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-[25vw] h-[25vw] rounded-full object-cover border border-[#FFFFFF]/20"
          />
          <span className="text-hakgyo-r-14 text-[#FFFFFF] mt-[1.4vh] text-center whitespace-nowrap max-w-[72px] truncate">
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
} 