import NotificationItemSkeleton from "./NotificationItemSkeleton";

interface NotificationListSkeletonProps {
  count?: number;
}

const NotificationListSkeleton = ({ count = 3 }: NotificationListSkeletonProps) => {
  return (
    <div className="flex flex-col px-[3vw]">
      {Array.from({ length: count }).map((_, index) => (
        <NotificationItemSkeleton key={index} />
      ))}
    </div>
  );
};

export default NotificationListSkeleton;
