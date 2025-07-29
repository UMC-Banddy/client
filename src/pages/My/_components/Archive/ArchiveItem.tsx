interface ArchiveItemProps {
  coverUrl?: string;
  title: string;
}

export default function ArchiveItem({
  coverUrl,
  title,
}: ArchiveItemProps) {
  return (
    <div className="flex flex-col items-start">
      <div className="relative w-[29vw] h-[29vw] overflow-hidden flex items-center justify-center">
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
