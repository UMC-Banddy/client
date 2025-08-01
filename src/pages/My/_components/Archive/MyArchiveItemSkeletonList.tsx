import MyArchiveItemSkeleton from "./MyArchiveItemSkeleton";

interface MyArchiveItemSkeletonListProps {
  count: number;
}

const MyArchiveItemSkeletonList = ({ count }: MyArchiveItemSkeletonListProps) => {
  return (
    <>
      {new Array(count).fill(0).map((_, idx) => (
        <MyArchiveItemSkeleton key={idx} />
      ))}
    </>
  );
};

export default MyArchiveItemSkeletonList; 