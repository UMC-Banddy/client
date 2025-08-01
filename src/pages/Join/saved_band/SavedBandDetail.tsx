import guitarActivated from "@/assets/icons/join/ic_guitar_activated.svg";
import moodHeart from "@/assets/icons/join/ic_mood_heart.svg";
import thumbnail from "@/assets/images/home-album1.svg";
import volumeOff from "@/assets/icons/join/ic_volume_off.svg";
import star from "@/assets/icons/join/ic_star.svg";
import { useState } from "react";
import { Dialog } from "@mui/material";
import closeBtn from "@/assets/icons/join/ic_close_btn.svg";
import StatusIndicator from "../_components/saved_band/StatusIndicator";
import fileMusic from "@/assets/icons/join/saved_band/ic_file_music.svg";
import music from "@/assets/icons/join/saved_band/ic_music_white.svg";
import users from "@/assets/icons/join/saved_band/ic_users.svg";
import youtubeOutlined from "@/assets/icons/join/saved_band/ic_youtube_outlined.svg";
import instagramOutlined from "@/assets/icons/join/saved_band/ic_instagram_outlined.svg";
import tiktokOutlined from "@/assets/icons/join/saved_band/ic_tiktok_outlined.svg";

const SavedBandDetail = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  return (
    <main className="relative min-h-screen w-[393px] mx-auto px-[24px] pt-[12px]">
      <div className="flex justify-end w-full mb-[24px]">
        <button className="p-[0] bg-transparent border-none cursor-pointer">
          <img src={guitarActivated} alt="" className="size-[48px]" />
        </button>
        <button className="p-[0] bg-transparent border-none cursor-pointer">
          <img src={moodHeart} alt="" className="size-[48px]" />
        </button>
      </div>

      <section className="flex flex-col items-center">
        <div className="relative size-[337px] bg-[#777]">
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${thumbnail})`,
            }}
          ></div>
          <div
            className="absolute top-0 left-0 w-full h-full z-10"
            onClick={() => setShowDetail(!showDetail)}
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%)",
            }}
          ></div>
          <img
            src={isPlaying ? volumeOff : volumeOff}
            alt=""
            className="absolute bottom-[4px] right-[4px] size-[48px] cursor-pointer z-20"
            onClick={() => setIsPlaying((prev) => !prev)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-[8px] mt-[24px] mb-[44px]">
        <p className="text-hakgyo-b-24 text-[#fff]">생태계교란종</p>
        <p className="text-hakgyo-r-14 text-[#CACACA]">
          광대족, 베스, 황소개구리 외 7명
        </p>
      </section>

      <section className="flex justify-between">
        <button className="w-[164px] h-[50px] rounded-[61px] bg-[#CACACA] text-ibm-sb-16 text-[#B42127]">
          삭제
        </button>
        <button className="flex justify-center items-center gap-[4px] w-[164px] h-[50px] rounded-[61px] bg-[#B42127] text-ibm-sb-16 text-[#fff]">
          <img src={star} alt="" />
          JOIN
        </button>
      </section>

      <Dialog
        open={showDetail}
        onClose={() => setShowDetail(false)}
        sx={{
          "& .css-10d30g3-MuiPaper-root-MuiDialog-paper": {
            margin: "0",
          },
        }}
      >
        <section
          className="flex flex-col items-center relative w-[361px] h-[485px] rounded-[16px] shadow-[0_4px_13px_0_rgba(0,0,0,0.25)]"
          style={{
            backgroundColor:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.81) 0%, rgba(255, 255, 255, 0.45) 100%)",
          }}
        >
          <button
            className="absolute right-0 bg-transparent border-none cursor-pointer"
            onClick={() => setShowDetail(false)}
          >
            <img src={closeBtn} alt="" />
          </button>

          <h1 className="mt-[64px] text-hakgyo-b-20">생태계교란종</h1>
          <div className="flex gap-[8px] mt-[20px] mb-[32px]">
            <StatusIndicator status="red" src={fileMusic} />
            <StatusIndicator status="red" src={music} />
            <StatusIndicator status="red" src={users} />
            <StatusIndicator status="black" src={youtubeOutlined} />
            <StatusIndicator status="black" src={instagramOutlined} />
            <StatusIndicator status="black" src={tiktokOutlined} />
          </div>
        </section>
      </Dialog>
    </main>
  );
};

export default SavedBandDetail;
