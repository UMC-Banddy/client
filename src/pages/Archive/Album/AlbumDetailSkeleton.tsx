import MusicListSkeleton from "@/pages/Archive/Music/MusicListSkeleton";
import SectionDivider from "@/pages/My/_components/SectionDivider";

const AlbumDetailSkeleton = () => {
  return (
    <div className="min-h-[100vh] w-full flex flex-col overflow-x-hidden px-6 pt-6 pb-0">
      <div className="flex flex-col items-center mb-6">
        <div className="w-[60vw] h-[60vw] max-w-[240px] max-h-[240px] bg-gray-700 mb-[32px] animate-pulse" />
        <div className="w-48 h-6 bg-gray-700 rounded mb-2 animate-pulse text-hakgyo-r-17" />
      </div>
      <SectionDivider />
      <div className="mb-[40px]"></div>
      <MusicListSkeleton />
    </div>
  );
};

export default AlbumDetailSkeleton;
