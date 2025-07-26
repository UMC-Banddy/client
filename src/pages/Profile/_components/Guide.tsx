import { useRef, useEffect } from "react";
import guideSvg from "@/assets/icons/profile/guide.svg";

interface GuideProps {
  showGuide: boolean;
  onClose: () => void;
}

export default function Guide({ showGuide, onClose }: GuideProps) {
  const guideRef = useRef<HTMLDivElement>(null);

  // 가이드 바깥 클릭 시 가이드 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (guideRef.current && !guideRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (showGuide) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGuide, onClose]);

  if (!showGuide) return null;

  return (
    <>
      {/* 가이드 오버레이 */}
      <div className="fixed inset-0 bg-black/50 z-10" />
      
      {/* 가이드 툴팁 */}
      <div
        ref={guideRef}
        className="absolute top-[14vh] left-1/2 z-30"
        style={{
          transform: "translateY(2vh) translateX(-25%)",
        }}
      >
        <img 
          src={guideSvg} 
          alt="guide" 
          className="min-w-[44.64vw] min-h-[16.26vh] drop-shadow-lg max-w-[175.4px] max-h-[138.5px]"
        />
      </div>
    </>
  );
} 