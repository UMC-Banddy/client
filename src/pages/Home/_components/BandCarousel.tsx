import React, { useState, useEffect, useRef } from "react";
import arrowPrev from "@/assets/icons/home/arrowprev.svg";
import arrowNext from "@/assets/icons/home/arrownext.svg";
import ButtonSection from "./ButtonSection";
import HomeTagSection from "./HomeTagSection";

interface Band {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  tags: string[];
}

const BandCarousel: React.FC<{
  bands: Band[];
  onJoinClick?: (band: Band) => void;
}> = ({ bands, onJoinClick }) => {
  // 빈 배열 처리
  if (!bands || bands.length === 0) {
    return (
      <div className="relative w-full max-w-[420px] flex items-center justify-center">
        <div className="text-white text-center">
          <p>밴드 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const extendedBands = [bands[bands.length - 1], ...bands, bands[0]];

  const [index, setIndex] = useState(1); // 처음은 진짜 첫 번째 밴드 (복제 앞에 있음)
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 토스트 상태를 여기서 관리
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    setIsAnimating(false);

    if (!containerRef.current) return;

    const container = containerRef.current;

    if (index === extendedBands.length - 1) {
      // 마지막 → 첫 번째로 순간 점프
      container.style.transition = "none";
      container.style.transform = "translateX(-100%)";

      // 다음 프레임에 다시 transition 켜기
      requestAnimationFrame(() => {
        setIndex(1);
        requestAnimationFrame(() => {
          container.style.transition = "transform 0.5s ease";
        });
      });
    }

    if (index === 0) {
      // 첫 번째 복제 → 마지막으로 점프
      container.style.transition = "none";
      container.style.transform = `translateX(-${bands.length * 100}%)`;

      requestAnimationFrame(() => {
        setIndex(bands.length);
        requestAnimationFrame(() => {
          container.style.transition = "transform 0.5s ease";
        });
      });
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index]);

  const handleBandClick = (band: Band) => {
    if (onJoinClick) {
      onJoinClick(band);
    }
  };

  return (
    <div className="relative w-full max-w-[420px] ">
      {/* 슬라이드 전체 줄 */}
      <div className="relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          ref={containerRef}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedBands.map((band, i) => (
            <div
              key={i}
              className="min-w-full px-4 py-4 flex flex-col items-center text-center"
            >
              {/* 태그도 함께 슬라이딩 */}
              <div className="w-full mb-4">
                <HomeTagSection tags={band.tags} />
              </div>

              <img
                src={band.image}
                alt={band.title}
                className="w-72 h-72 rounded-xl object-cover mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handleBandClick(band)}
              />
              <h2 className="text-white font-bold text-xl mb-2">
                {band.title}
              </h2>
              <p className="text-gray-400 text-sm mb-4">{band.subtitle}</p>
              <ButtonSection setToast={setToast} />
            </div>
          ))}
        </div>
        {/* 버튼들 */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-[42%] -translate-y-1/2 z-30 bg-transparent rounded-full w-12 h-12 flex items-center justify-center p-0 border-none"
        >
          <img src={arrowPrev} alt="Prev" className="w-12 h-12" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-[42%] -translate-y-1/2 z-30 bg-transparent rounded-full w-12 h-12 flex items-center justify-center p-0 border-none"
        >
          <img src={arrowNext} alt="Next" className="w-12 h-12" />
        </button>
      </div>
      {/* 토스트 메시지 */}
      {toast && (
        <div
          className={
            "fixed left-1/2 bottom-26 z-50 px-8 py-3 bg-black text-white rounded-full text-xl font-hakgyoansim -translate-x-1/2 transition-all duration-400 animate-toast-updown"
          }
          style={{
            minWidth: 220,
            maxWidth: "90vw",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            userSelect: "none",
          }}
        >
          밴드가 저장 되었습니다.
        </div>
      )}
    </div>
  );
};

export default BandCarousel;
