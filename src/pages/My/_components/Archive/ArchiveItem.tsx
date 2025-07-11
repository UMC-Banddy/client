import no_sound from "@/assets/icons/no-sound.svg";

interface ArchiveItemProps {
  coverUrl?: string;
  title: string;
  muted?: boolean;
}

export default function ArchiveItem({ coverUrl, title, muted }: ArchiveItemProps) {
  return (
    <div className="flex flex-col items-start">
      <div className="relative w-[29vw] h-[29vw] overflow-hidden flex items-center justify-center">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[#FFFFFF] text-3xl" />
        )}
        {muted && (
          <div className="absolute bottom-[1vw] right-[1vw] w-[8vw] h-[8vw] rounded-full bg-black/70 flex items-center justify-center shadow-lg">
            <img src={no_sound} alt="no-sound" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      <span className="text-hakgyo-r-14 text-[#FFFFFF] text-left mt-[1vh] truncate w-full">{title}</span>
    </div>
  );
}
