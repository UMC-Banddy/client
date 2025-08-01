import SongListItemSkeleton from "./SongListItemSkeleton";

interface SongListSkeletonProps {
  count?: number;
}

const SongListSkeleton = ({ count = 6 }: SongListSkeletonProps) => {
  return (
    <div className="flex flex-col gap-[1.4vh] mt-[2.3vh] mb-[3.5vh]">
      {Array.from({ length: count }).map((_, i) => (
        <SongListItemSkeleton key={i} />
      ))}
    </div>
  );
};

export default SongListSkeleton; 