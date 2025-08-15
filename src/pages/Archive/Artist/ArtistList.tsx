import React, { useRef } from "react";
import graycirclecheck from "@/assets/icons/archive/graycirclecheck.svg";
import circle from "@/assets/icons/archive/circle.svg";

interface ArtistListItem {
  artistId?: number;
  image: string;
  title: string;
  externalUrl?: string;
}

interface ArtistListProps {
  items: ArtistListItem[];
  selectedArtists: number[];
  onArtistSelect: (artistId: number) => void;
  onLongPress: () => void;
  isSelectionMode: boolean;
}

export default function ArtistList({ 
  items, 
  selectedArtists, 
  onArtistSelect, 
  onLongPress, 
  isSelectionMode 
}: ArtistListProps) {
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = (artistId: number, e: React.PointerEvent) => {
    e.preventDefault(); // 기본 동작 방지
    
    if (isSelectionMode) {
      // 선택 모드에서는 즉시 선택 처리
      onArtistSelect(artistId);
      return;
    }

    // 길게 누르기 타이머 설정
    longPressTimeoutRef.current = setTimeout(() => {
      onLongPress();
      onArtistSelect(artistId);
    }, 500);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    e.preventDefault();
    
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const handleArtistClick = (externalUrl?: string) => {
    if (!isSelectionMode && externalUrl) {
      window.open(externalUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-col gap-[12px] mb-[3vh]">
      {items.map((item, idx) => {
        const isSelected = item.artistId ? selectedArtists.includes(item.artistId) : false;
        
        return (
          <div 
            key={idx} 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onPointerDown={(e) => item.artistId && handlePointerDown(item.artistId, e)}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onClick={() => handleArtistClick(item.externalUrl)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-[14vw] h-[14vw] max-w-[55px] max-h-[55px] rounded-full object-cover mr-[16px]"
            />
            <span className="text-[#FFFFFF] text-hakgyo-r-16 flex-1">{item.title}</span>

            {/* 체크박스 - 우측에 위치 */}
            {isSelectionMode && (
              <img 
                src={isSelected ? graycirclecheck : circle} 
                alt={isSelected ? "selected" : "unselected"}
                className="w-[7.8vw] h-[7.8vw] max-w-[31px] max-h-[31px]"
              />
            )}
          </div>
        );
      })}
    </div>
  );
} 