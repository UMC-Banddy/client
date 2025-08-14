
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { type AlbumGridProps } from "@/types/album";
import whiteCircle from "@/assets/icons/archive/whitecircle.svg";
import whiteCircleCheck from "@/assets/icons/archive/whitecirclecheck.svg";

interface AlbumGridExtendedProps extends AlbumGridProps {
  selectedAlbums?: number[];
  onAlbumSelect?: (albumId: number) => void;
  onLongPress?: () => void;
  isSelectionMode?: boolean;
}

export default function AlbumGrid({ 
  items, 
  selectedAlbums = [], 
  onAlbumSelect, 
  onLongPress, 
  isSelectionMode = false 
}: AlbumGridExtendedProps) {
  const navigate = useNavigate();
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleAlbumClick = (albumId?: string) => {
    if (albumId) {
      navigate(`/my/archive/album/${albumId}`);
    }
  };

  const handlePointerDown = () => {
    if (!isSelectionMode && onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        onLongPress();
      }, 500);
    }
  };

  const handlePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handlePointerLeave = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <div className="grid grid-cols-2 justify-items-center gap-x-[12px] mb-[3vh]">
      {items.map((item, idx) => {
        const albumId = item.albumId ? parseInt(item.albumId) : 0;
        const isSelected = selectedAlbums.includes(albumId);
        
        return (
          <div 
            key={idx} 
            className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity max-w-[166px] break-keep"
            onClick={() => {
              if (isSelectionMode && onAlbumSelect) {
                onAlbumSelect(albumId);
              } else {
                handleAlbumClick(item.albumId);
              }
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
          >
            <div className="relative w-[42vw] h-[42vw] max-w-[166px] max-h-[166px] overflow-hidden bg-[#232325]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {/* 선택 모드 오버레이 */}
              {isSelectionMode && (
                <div className="absolute inset-0 bg-black/50" />
              )}
              {/* 선택 체크 아이콘 */}
              {isSelectionMode && (
                <div className="absolute top-0 right-0 z-10">
                  <img
                    src={isSelected ? whiteCircleCheck : whiteCircle}
                    alt={isSelected ? "selected" : "unselected"}
                    className="w-[12vw] h-[12vw] max-w-[48px] max-h-[48px]"
                  />
                </div>
              )}
            </div>
            <span className="mt-[1.4vh] mb-[2.8vh] text-[#FFFFFF] text-hakgyo-r-14">
              {item.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}