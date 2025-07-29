interface MyArchiveItemProps {
  coverUrl?: string;
  title: string;
}

export default function MyArchiveItem({
  coverUrl,
  title,
}: MyArchiveItemProps) {
  return (
    <div className="flex flex-col items-start">
      <div className="relative w-[26vw] h-[26vw] overflow-hidden flex items-center justify-center max-w-[104px] max-h-[104px]">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[#CACACA] text-3xl" />
        )}
      </div>
      <span className="text-hakgyo-r-14 text-[#CACACA] text-left mt-[1vh] truncate w-full">
        {title}
      </span>
    </div>
  );
}
