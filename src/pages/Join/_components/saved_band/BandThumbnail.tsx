import clsx from "clsx";
import { useState } from "react";
import volumeOff from "@/assets/icons/join/ic_volume_off.svg";
import thumbnail from "@/assets/images/home-album1.svg";

interface BandThumbnailProps {
  isRecruiting: boolean;
}

const BandThumbnail = ({ isRecruiting = false }: BandThumbnailProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="flex flex-col gap-[12px]">
      <div className="relative size-[166px] bg-[#777]">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${thumbnail})`,
          }}
        ></div>
        <div
          className="absolute top-0 left-0 w-full h-full z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%)",
          }}
        ></div>
        <div
          className={clsx(
            "flex justify-center items-center absolute top-[8px] left-[8px] w-[62px] h-[24px] rounded-[100px] text-wanted-sb-13 text-[#fff] z-20",
            isRecruiting ? "bg-[#B42127]" : "bg-[#292929]"
          )}
        >
          {isRecruiting ? "모집중" : "모집완료"}
        </div>
        <img
          src={isPlaying ? volumeOff : volumeOff}
          alt=""
          className="absolute bottom-[4px] right-[4px] size-[40px] cursor-pointer z-20"
          onClick={() => setIsPlaying((prev) => !prev)}
        />
      </div>
      <p className="text-hakgyo-r-14 text-[#fff]">생태계교란종</p>
    </div>
  );
};

export default BandThumbnail;
