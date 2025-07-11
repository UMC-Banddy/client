import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import arrowPrev from "@/assets/icons/arrowprev.svg";
import arrowNext from "@/assets/icons/arrownext.svg";
import ButtonSection from "./ButtonSection";

interface Band {
  id: number;
  title: string;
  description: string;
  image: string;
}

const BandCarousel: React.FC<{ bands: Band[] }> = ({ bands }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const paginate = (dir: "left" | "right") => {
    setDirection(dir);
    setIndex((prev) =>
      dir === "left"
        ? prev === 0
          ? bands.length - 1
          : prev - 1
        : prev === bands.length - 1
        ? 0
        : prev + 1
    );
  };

  return (
    <div className="relative w-full max-w-[420px] flex flex-col items-center">
      <div className="flex flex-row items-center justify-center w-full min-h-[320px] relative">
        {/* 왼쪽 버튼 */}
        <button
          onClick={() => paginate("left")}
          className="z-10 w-14 h-14 flex items-center justify-center focus:outline-none bg-transparent p-0 border-none"
          aria-label="이전 밴드"
        >
          <img src={arrowPrev} alt="Prev" className="w-12 h-12" />
        </button>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={bands[index].id}
            className="flex items-center justify-center"
            custom={direction}
            initial={{ x: direction === "left" ? -300 : 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === "left" ? 300 : -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={bands[index].image}
              alt={bands[index].title}
              className="w-72 h-72 rounded-xl object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* 오른쪽 버튼 */}
        <button
          onClick={() => paginate("right")}
          className="z-10 w-14 h-14 flex items-center justify-center focus:outline-none bg-transparent p-0 border-none"
          aria-label="다음 밴드"
        >
          <img src={arrowNext} alt="Next" className="w-12 h-12" />
        </button>
      </div>
      {/* 이미지 아래 텍스트/설명/버튼 */}
      <div className="flex flex-col items-center text-center pt-4 pb-8 px-10 w-full">
        <h2 className="text-white font-bold text-xl mb-2">
          {bands[index].title}
        </h2>
        <p className="text-gray-400 text-sm mb-6">{bands[index].description}</p>
        <div className="mt-2">
          <ButtonSection />
        </div>
      </div>
    </div>
  );
};

export default BandCarousel;
