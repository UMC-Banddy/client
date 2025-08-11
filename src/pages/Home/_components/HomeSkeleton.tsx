import React from "react";

const Pulse = "animate-pulse bg-[#2a2a2a]";

const HomeSkeleton: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[420px] mx-auto px-4">
      {/* tags */}
      <div className="w-full flex items-center justify-center gap-2 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`${Pulse} h-6 rounded-full`} style={{ width: 72 }} />
        ))}
      </div>
      {/* image */}
      <div className={`${Pulse} w-72 h-72 rounded-xl mb-4`} />
      {/* title */}
      <div className={`${Pulse} h-6 rounded w-60 mb-2`} />
      {/* subtitle */}
      <div className={`${Pulse} h-4 rounded w-40 mb-6`} />
      {/* buttons */}
      <div className="w-full flex items-center justify-center gap-3">
        <div className={`${Pulse} h-10 rounded-full`} style={{ width: 120 }} />
        <div className={`${Pulse} h-10 rounded-full`} style={{ width: 120 }} />
      </div>
    </div>
  );
};

export default HomeSkeleton;


