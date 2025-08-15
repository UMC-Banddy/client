import right from "@/assets/icons/notification/chevronright.svg";

const NotificationItemSkeleton = () => {
  return (
    <div className="flex items-center py-[12px] animate-pulse">
      <div className="w-[16vw] h-[16vw] max-w-[64px] max-h-[64px] rounded-full bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 mr-[20px]" />
      
      <div className="flex-1">
        <div className="w-3/4 h-4 bg-gray-700 rounded mb-1 text-hakgyo-r-16" />
        <div className="w-1/2 h-3 bg-gray-700 rounded text-hakgyo-r-16" />
      </div>
      
      <img src={right} alt="right" className="w-[12.2vw] h-[12.2vw] max-w-[48px] max-h-[48px] text-left ml-[8px]" />
    </div>
  );
};

export default NotificationItemSkeleton;
