import { useState } from "react";
import MusicGrid from "./MusicGrid";
import MusicList from "./MusicList";
import SectionDivider from "../_components/SectionDivider";
import { useNavigate } from "react-router-dom";
import plus from "@/assets/icons/archive/plus.svg";
import folder from "@/assets/icons/archive/folder.svg";
import folder_plus from "@/assets/icons/archive/folderplus.svg";
import lock from "@/assets/icons/archive/lock.svg";
import unlock from "@/assets/icons/archive/unlock.svg";

const musicGridData = [
  {
    image: "https://image.yes24.com/momo/TopCate0010/hani/L_1303497.jpg",
    title: "PARKLIFE",
    subtitle: "blur",
  },
  {
    image: "https://image.fmkorea.com/files/attach/new5/20250607/8489985601_2120028041_a92cded32079ed870400f29e1f826c7a.png",
    title: "Loveless",
    subtitle: "My bloody valentine",
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/ko/0/01/%ED%95%91%ED%81%AC_%ED%94%8C%EB%A1%9C%EC%9D%B4%EB%93%9C_-_Wish_You_Were_Here.png",
    title: "The wall",
    subtitle: "Pink Floyd",
  },
];

const musicListData = [
  {
    image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg",
    title: "二月の兵隊",
    subtitle: "The cabs",
  },
  {
    image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg",
    title: "No future for us",
    subtitle: "The cabs",
  },
  {
    image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg",
    title: "二月の兵隊",
    subtitle: "The cabs",
  },
  {
    image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg",
    title: "二月の兵隊",
    subtitle: "The cabs",
  },
  {
    image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg",
    title: "No future for us",
    subtitle: "The cabs",
  },
  {
    image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg",
    title: "二月の兵隊",
    subtitle: "The cabs",
  },
];

export default function Music() {
  const [activeFilter, setActiveFilter] = useState("전체");
  const [locked, setLocked] = useState(false); 
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-end mt-[1.6vh] mb-[0.5vh]" onClick={() => navigate("/my/archive/add")}>
        <img src={plus} alt="plus" className="w-[12vw] h-[12vw] cursor-pointer mr-[3vw]" />
      </div>
        <span className="text-[#CACACA] text-hakgyo-b-17 flex">
          나와 비슷한 사용자가 많이 저장한 곡
        </span>
      <div className="mt-[2vh]">
        <MusicGrid items={musicGridData} />
      </div>
      <div className="pr-[6vw]">
        <SectionDivider />
        <div className="flex items-center justify-between mt-[2vh] mb-[2vh] w-full">
          <div className="flex items-center gap-[2vw] text-[#FFFFFF]">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setActiveFilter("전체")}
            >
              <span className={`text-ibm-sb-16 px-[2vw] ${activeFilter === "전체" ? "text-white" : "text-[#959595]"}`}>전체</span>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setActiveFilter("폴더")}
            >
              <img src={folder} alt="folder" className={`w-[10vw] h-[10vw] ${activeFilter === "폴더" ? "" : "grayscale brightness-75"}`} style={{ filter: activeFilter === "폴더" ? "none" : "grayscale(1) brightness(0.6)", opacity: activeFilter === "폴더" ? 1 : 0.7 }} />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setActiveFilter("폴더플러스")}
            >
              <img src={folder_plus} alt="folder_plus" className={`w-[10vw] h-[10vw] ${activeFilter === "폴더플러스" ? "" : "grayscale brightness-75"}`} style={{ filter: activeFilter === "폴더플러스" ? "none" : "grayscale(1) brightness(0.6)", opacity: activeFilter === "폴더플러스" ? 1 : 0.7 }} />
            </div>
          </div>
          {locked ? (
            <img src={lock} alt="lock" className="w-[10vw] h-[10vw] cursor-pointer" onClick={() => setLocked(false)} />
          ) : (
            <img src={unlock} alt="unlock" className="w-[10vw] h-[10vw] cursor-pointer" onClick={() => setLocked(true)} />
          )}
        </div>
        <MusicList items={musicListData} />
      </div>
    </>
  );
}