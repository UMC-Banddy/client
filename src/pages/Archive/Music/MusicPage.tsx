import { useState } from "react";
import MusicGrid from "./MusicGrid";
import MusicGridSkeleton from "./MusicGridSkeleton";
import MusicList from "./MusicList";
import MusicListSkeleton from "./MusicListSkeleton";
import SectionDivider from "@/pages/My/_components/SectionDivider";
import { useNavigate } from "react-router-dom";
import plus from "@/assets/icons/archive/plus.svg";
import folder from "@/assets/icons/archive/folder.svg";
import folder_plus from "@/assets/icons/archive/folderplus.svg";
import lock from "@/assets/icons/archive/lock.svg";
import unlock from "@/assets/icons/archive/unlock.svg";
import { useSimilarTracks } from "@/features/archive/hooks/useSimilarTracks";
import { useArchivedTracks } from "@/features/archive/hooks/useArchivedTracks";

export default function Music() {
  const [activeFilter, setActiveFilter] = useState("전체");
  const [locked, setLocked] = useState(false); 
  const navigate = useNavigate();
  const { tracks, isLoading, error } = useSimilarTracks();
  const { tracks: archivedTracks, isLoading: archivedTracksLoading, error: archivedTracksError } = useArchivedTracks();

  // 에러가 있으면 처리
  if (error || archivedTracksError) {
    return (
      <div className="min-h-[100vh] w-full flex items-center justify-center">
        <div className="text-white">{error || archivedTracksError}</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-end mt-[1.6vh] mb-[0.5vh]" onClick={() => navigate("/my/archive/add")}>
        <img src={plus} alt="plus" className="w-[12vw] h-[12vw] cursor-pointer max-w-[48px] max-h-[48px]" />
      </div>
        <span className="text-[#CACACA] text-hakgyo-b-17 flex">
          나와 비슷한 사용자가 많이 저장한 곡
        </span>
      <div className="mt-[2vh]">
        {isLoading ? (
          <MusicGridSkeleton />
        ) : (
          <MusicGrid items={tracks.map(track => ({
            image: track.imageUrl,
            title: track.title,
            subtitle: track.artist
          }))} />
        )}
      </div>
      <SectionDivider />
        <div className="flex items-center justify-between mt-[2vh] mb-[2vh] w-full">
          <div className="flex items-center gap-[8px] text-[#FFFFFF]">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setActiveFilter("전체")}
            >
              <span className={`text-ibm-sb-16 p-[8px] ${activeFilter === "전체" ? "text-white" : "text-[#959595]"}`}>전체</span>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setActiveFilter("폴더")}
            >
              <img src={folder} alt="folder" className={`w-[10vw] h-[10vw] max-w-[40px] max-h-[40px] ${activeFilter === "폴더" ? "" : "grayscale brightness-75"}`} style={{ filter: activeFilter === "폴더" ? "none" : "grayscale(1) brightness(0.6)", opacity: activeFilter === "폴더" ? 1 : 0.7 }} />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setActiveFilter("폴더플러스")}
            >
              <img src={folder_plus} alt="folder_plus" className={`w-[10vw] h-[10vw] max-w-[40px] max-h-[40px] ${activeFilter === "폴더플러스" ? "" : "grayscale brightness-75"}`} style={{ filter: activeFilter === "폴더플러스" ? "none" : "grayscale(1) brightness(0.6)", opacity: activeFilter === "폴더플러스" ? 1 : 0.7 }} />
            </div>
          </div>
          {locked ? (
            <img src={lock} alt="lock" className="w-[10vw] h-[10vw] cursor-pointer max-w-[40px] max-h-[40px]" onClick={() => setLocked(false)} />
          ) : (
            <img src={unlock} alt="unlock" className="w-[10vw] h-[10vw] cursor-pointer max-w-[40px] max-h-[40px]" onClick={() => setLocked(true)} />
          )}
        </div>
        {archivedTracksLoading ? (
          <MusicListSkeleton />
        ) : (
          <MusicList items={archivedTracks.map(track => ({
            image: track.imageUrl,
            title: track.title,
            subtitle: track.artist
          }))} />
        )}
    </>
  );
}