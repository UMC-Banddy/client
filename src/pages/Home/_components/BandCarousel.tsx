import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MyBandCard from "./MyBandCard";
import arrowPrev from "@/assets/icons/arrowprev.svg";
import arrowNext from "@/assets/icons/arrownext.svg";

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
      <div className="relative w-full flex items-center justify-center min-h-[340px]">
        {/* 왼쪽 버튼 - 아이콘 더 크게 */}
        <button
          onClick={() => paginate("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-16 h-16 flex items-center justify-center focus:outline-none bg-transparent p-0 border-none"
          aria-label="이전 밴드"
        >
          <img src={arrowPrev} alt="Prev" className="w-14 h-14" />
        </button>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={bands[index].id}
            className="w-full flex justify-center items-center"
            custom={direction}
            initial={{ x: direction === "left" ? -300 : 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === "left" ? 300 : -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MyBandCard band={bands[index]} />
          </motion.div>
        </AnimatePresence>
        {/* 오른쪽 버튼 - 아이콘 더 크게 */}
        <button
          onClick={() => paginate("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-16 h-16 flex items-center justify-center focus:outline-none bg-transparent p-0 border-none"
          aria-label="다음 밴드"
        >
          <img src={arrowNext} alt="Next" className="w-14 h-14" />
        </button>
      </div>
    </div>
  );
};

export default BandCarousel;
