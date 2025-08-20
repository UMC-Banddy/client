import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import volumeOff from "@/assets/icons/join/ic_volume_off.svg";
import volumeOn from "@/assets/icons/join/ic_volume_on.svg";
import { useNavigate } from "react-router-dom";

interface BandThumbnailProps {
  isRecruiting: boolean;
  bandId: number;
  name: string;
  thumbnail: string | null;
  memberSummary: string;
  memberCount: number;
  soundUrl: string;
}

const BandThumbnail = ({
  isRecruiting = false,
  bandId,
  name,
  thumbnail,
  memberSummary,
  memberCount,
  soundUrl,
}: BandThumbnailProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.loop = true;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [isPlaying, soundUrl]);

  return (
    <div
      className="flex flex-col gap-[12px]"
      onClick={() =>
        navigate(`/join/saved-band/${bandId}`, {
          state: { memberSummary, memberCount, soundUrl },
        })
      }
    >
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
          src={isPlaying ? volumeOn : volumeOff}
          alt=""
          className="absolute bottom-[4px] right-[4px] size-[40px] cursor-pointer z-30"
          onClick={(event) => {
            event.stopPropagation();
            setIsPlaying((prev) => !prev);
          }}
        />
      </div>
      <p className="text-hakgyo-r-14 text-[#fff]">{name}</p>
    </div>
  );
};

export default BandThumbnail;
