import { useState } from "react";
import ArtistGrid from "./ArtistGrid";
import ArtistList from "./ArtistList";
import SectionDivider from "../_components/SectionDivider";
import plus from "@/assets/icons/archive/plus.svg";
import folder from "@/assets/icons/archive/folder.svg";
import folder_plus from "@/assets/icons/archive/folderplus.svg";
import lock from "@/assets/icons/archive/lock.svg";
import unlock from "@/assets/icons/archive/unlock.svg";
import { useNavigate } from "react-router-dom";

// 목데이터
const artistGridData = [
  { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", title: "The cabs" },
  { image: "https://mir-s3-cdn-cf.behance.net/user/230/fe74a51202250825.62130870ceb63.jpg", title: "草東沒有派對" },
  { image: "https://pbs.twimg.com/media/F84cL12bwAAvKI9.jpg", title: "asunojokei" },
  { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", title: "The cabs" },
  { image: "https://mir-s3-cdn-cf.behance.net/user/230/fe74a51202250825.62130870ceb63.jpg", title: "草東沒有派對" },
  { image: "https://pbs.twimg.com/media/F84cL12bwAAvKI9.jpg", title: "asunojokei" },
  // ...etc
];

const artistListData = [
  { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", title: "The cabs" },
  { image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgZRLo5GiO8JGV64de6TrsOAv2iaa1j1W1Om_lyVLy9pRCdC-J", title: "Betcover!!" },
  { image: "https://cdfront.tower.jp/~/media/Images/Tol/pc/article/feature_item/Accessories/2019/11/20/20_4001_03.jpg?h=400&w=400", title: "shinsei kamattechan" },
  // ...etc
];

export default function ArtistPage() {
  const [activeFilter, setActiveFilter] = useState("전체");
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-end mt-[1.6vh] mb-[0.5vh]" onClick={() => navigate("/my/archive/add")}>
        <img src={plus} alt="plus" className="w-[12vw] h-[12vw] cursor-pointer mr-[3vw]" />
      </div>
      <span className="text-[#CACACA] text-hakgyo-b-17 flex mb-[4.7vh]">
        나와 비슷한 사용자가 많이 저장한 아티스트
      </span>
      <ArtistGrid items={artistGridData} />
      <div className="pr-[6vw]">
        <SectionDivider />
        <div className="flex items-center justify-between mt-[2vh] mb-[2.8vh] w-full">
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
        <ArtistList items={artistListData} />
      </div>
    </>
  );
}