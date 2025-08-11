import { useParams } from "react-router-dom";
import { useAlbumDetail } from "@/features/archive/hooks/useAlbumDetail";
import MusicList from "@/pages/Archive/Music/MusicList";
import AlbumDetailSkeleton from "./AlbumDetailSkeleton";
import SectionDivider from "@/pages/My/_components/SectionDivider";

export default function AlbumDetailPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const { data: albumDetail, isLoading, error } = useAlbumDetail(albumId || null);

  if (error) {
    return (
      <div className="min-h-[100vh] w-full flex items-center justify-center">
        <div className="text-white">앨범을 찾을 수 없습니다.</div>
      </div>
    );
  }

  if (isLoading) {
    return <AlbumDetailSkeleton />;
  }

  if (!albumDetail?.result) {
    return (
      <div className="min-h-[100vh] w-full flex items-center justify-center">
        <div className="text-white">앨범 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const album = albumDetail.result;

  return (
    <div className="min-h-[100vh] w-full flex flex-col overflow-x-hidden px-6 pt-6 pb-0">
      <div className="flex flex-col items-center mb-6">
        <img 
          src={album.imageUrl} 
          alt={album.name}
          className="w-[60vw] h-[60vw] max-w-[240px] max-h-[240px] mb-[32px] object-cover"
        />
        <div className="text-white text-hakgyo-b-17 mb-2 text-center">{album.name}</div>
      </div>
      
      <SectionDivider />

      <div className="mb-[40px]"></div>
      
      <MusicList 
            items={album.tracks.map((track: { name: string }) => ({
            image: album.imageUrl,
            title: track.name,
            subtitle: album.artist
          }))} 
        />
    </div>
  );
}
