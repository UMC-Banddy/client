import { useState } from "react";
import AlbumGrid from "./AlbumGrid";
import AlbumGridSkeleton from "./AlbumGridSkeleton";
import lock from "@/assets/icons/archive/lock.svg";
import unlock from "@/assets/icons/archive/unlock.svg";
import plus from "@/assets/icons/archive/plus.svg";
import { useNavigate } from "react-router-dom";
import { useArchivedAlbums } from "@/features/archive/hooks/useArchivedAlbums";

export default function AlbumPage() {
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();
  const { albums, isLoading, error } = useArchivedAlbums();

  // 에러가 있으면 처리
  if (error) {
    return (
      <div className="min-h-[100vh] w-full flex items-center justify-center">
        <div className="text-white">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="">
        <div className="flex items-center justify-end mt-[2vh] mb-[3vh]">
          <div className="flex items-center justify-end mt-[1.6vh] mb-[0.5vh]" onClick={() => navigate("/my/archive/add")}>
            <img src={plus} alt="plus" className="w-[10vw] h-[10vw] max-w-[40px] max-h-[40px] cursor-pointer" />
          </div>
          <div onClick={() => setLocked((prev) => !prev)} className="ml-[1vw] cursor-pointer">
            {locked ? (
              <img src={lock} alt="lock" className="w-[10vw] h-[10vw] max-w-[40px] max-h-[40px]" />
            ) : (
              <img src={unlock} alt="unlock" className="w-[10vw] h-[10vw] max-w-[40px] max-h-[40px]" />
            )}
          </div>
        </div>
        {isLoading ? (
          <AlbumGridSkeleton />
        ) : (
          <AlbumGrid items={(albums || []).map(album => ({
            image: album.imageUrl,
            title: album.name,
            externalUrl: album.externalUrl
          }))} />
        )}
      </div>
    </>
  );
}