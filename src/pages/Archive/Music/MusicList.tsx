import { useRef } from "react";
import graycirclecheck from "@/assets/icons/archive/graycirclecheck.svg";
import circle from "@/assets/icons/archive/circle.svg";

interface MusicListProps {
  items: Array<{ 
    trackId?: number; 
    image: string; 
    title: string; 
    subtitle: string 
  }>;
  selectedTracks?: number[];
  onTrackSelect?: (trackId: number) => void;
  onLongPress?: () => void;
  isSelectionMode?: boolean;
}

export default function MusicList({ 
  items, 
  selectedTracks = [], 
  onTrackSelect = () => {}, 
  onLongPress = () => {}, 
  isSelectionMode = false 
}: MusicListProps) {
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = (trackId: number, e: React.PointerEvent) => {
    e.preventDefault(); // 기본 동작 방지
    
    if (isSelectionMode) {
      // 선택 모드에서는 즉시 선택 처리
      onTrackSelect(trackId);
      return;
    }

    // 길게 누르기 타이머 설정
    longPressTimeoutRef.current = setTimeout(() => {
      onLongPress();
      onTrackSelect(trackId);
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

  return (
    <div className="flex flex-col gap-x-[16px] gap-y-[12px] mb-[4vh]">
      {items.map((item, i) => {
        const isSelected = item.trackId ? selectedTracks.includes(item.trackId) : false;
        
        return (
          <div 
            key={i} 
            className="flex items-center"
            onPointerDown={(e) => item.trackId && handlePointerDown(item.trackId, e)}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
          >
            {/* 앨범 이미지 */}
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-[14vw] h-[14vw] object-cover mr-[16px] max-w-[55px] max-h-[55px]" 
            />
            
            {/* 곡 정보 */}
            <div className="flex-1">
              <div className="text-hakgyo-r-16 text-[#FFFFFF]">{item.title}</div>
              <div className="text-hakgyo-r-14 text-[#CACACA]">{item.subtitle}</div>
            </div>

            {/* 체크박스 - 이미지 우측에 위치 */}
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