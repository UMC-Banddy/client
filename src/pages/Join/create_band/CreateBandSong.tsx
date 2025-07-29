import plusIcon from "@/assets/icons/join/ic_plus_btn.svg";
import dummyImage from "@/assets/images/home-album1.svg";
import playIcon from "@/assets/icons/join/ic_play.svg";
import checkIcon from "@/assets/icons/join/ic_check_transparent.svg";
import deleteIcon from "@/assets/icons/join/ic_delete.svg";
import { useState } from "react";
import SearchField from "../_components/SearchField";

const songList = [
  {
    id: 1,
    thumbnail: dummyImage,
    title: "Seagull",
    artist: "Ride",
  },
  {
    id: 2,
    thumbnail: "",
    title: "Vapour Trail",
    artist: "Ride",
  },
  {
    id: 3,
    thumbnail: "",
    title: "Dreams Burn Down",
    artist: "Ride",
  },
];

const CreateBandSong = () => {
  const [selectedSong, setSelectedSong] = useState<number[]>([]);

  return (
    <main className="relative min-h-screen w-[393px] mx-auto bg-[#121212]/90 px-[24px] pt-[16px] pb-[200px]">
      <section className="flex flex-col gap-[28px]">
        <p className="text-hakgyo-b-24 text-[#E9E9E9]">목표하는 곡</p>
        {selectedSong.length > 0 && (
          <div className="flex gap-[20px]">
            {selectedSong.map((song) => (
              <div key={song} className="flex flex-col gap-[4px]">
                <div className="relative size-[50px]">
                  <img
                    src={songList[song - 1].thumbnail}
                    alt=""
                    className="size-full"
                  />
                  <div
                    className="absolute top-[0] left-[0] size-full z-10"
                    style={{
                      background: `linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.35) 0%,
                        rgba(0, 0, 0, 0.35) 100%
                    )`,
                    }}
                  ></div>
                  <button
                    className="flex items-center justify-center absolute top-[-2px] right-[-4px] size-[19px] rounded-full bg-[#121212] cursor-pointer z-20"
                    onClick={() =>
                      setSelectedSong((prev) =>
                        prev.filter((id) => id !== song)
                      )
                    }
                  >
                    <img src={deleteIcon} alt="" />
                  </button>
                </div>
                <p className="w-[50px] text-hakgyo-r-16 text-[#fff] overflow-ellipsis line-clamp-1">
                  {songList[song - 1].title}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="h-[0.5px] bg-[#E9E9E9]"></div>

        <section>
          <SearchField placeholder="곡 검색하기" />
          <p className="mt-[20px] mb-[32px] text-wanted-sb-12 text-[#959595]">
            Shoegaze 장르의 Ride의 곡은 어때요?
          </p>
        </section>
      </section>
      <div className="flex flex-col gap-[16px]">
        {songList.map((song) => (
          <div
            key={song.id}
            className="flex justify-between items-center gap-[16px]"
          >
            <div className="flex gap-[15px]">
              <div className="relative size-[55px]">
                <img
                  src={song.thumbnail}
                  alt=""
                  className="size-full bg-[#CACACA]"
                />
                <div
                  className="absolute top-[0] left-[0] size-full z-10"
                  style={{
                    background: `linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.35) 0%,
                        rgba(0, 0, 0, 0.35) 100%
                    )`,
                  }}
                ></div>
                <img
                  src={playIcon}
                  alt=""
                  className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] size-[26px] z-20"
                />
              </div>
              <div className="flex flex-col justify-center gap-[2px]">
                <p className="text-hakgyo-r-16 text-[#fff]">{song.title}</p>
                <p className="text-hakgyo-r-16 text-[#CACACA]">{song.artist}</p>
              </div>
            </div>
            <button
              className="cursor-pointer"
              onClick={() =>
                setSelectedSong((prev) =>
                  prev.includes(song.id)
                    ? prev.filter((id) => id !== song.id)
                    : [...prev, song.id]
                )
              }
            >
              <img
                src={selectedSong.includes(song.id) ? checkIcon : plusIcon}
                alt=""
                className="size-[31px]"
              />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default CreateBandSong;
