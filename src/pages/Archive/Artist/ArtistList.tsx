import React from "react";

interface ArtistListItem {
  image: string;
  title: string;
}

interface ArtistListProps {
  items: ArtistListItem[];
}

export default function ArtistList({ items }: ArtistListProps) {
  return (
    <div className="flex flex-col gap-[1.4vh] mb-[3vh]">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center">
          <img
            src={item.image}
            alt={item.title}
            className="w-[14vw] h-[14vw] rounded-full object-cover mr-[4vw]"
          />
          <span className="text-[#FFFFFF] text-hakgyo-r-16">{item.title}</span>
        </div>
      ))}
    </div>
  );
} 