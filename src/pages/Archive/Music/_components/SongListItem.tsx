import Plus from "@/assets/icons/archive/plusfilled.svg";
import Check from "@/assets/icons/archive/checkfilled.svg";
import { type Song } from "@/types/song";

interface SongListItemProps {
  song: Song;
  added: boolean;
  onToggle: (song: Song) => void;
}

export default function SongListItem({ song, added, onToggle }: SongListItemProps) {
  return (
    <div className="flex items-center">
      <div className="relative w-[14vw] h-[14vw] mr-[16px] max-w-[55px] max-h-[55px]">
        <img
          src={song.image}
          alt={song.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="text-[#FFFFFF] text-hakgyo-r-16 text-left">{song.title}</div>
        <div className="text-[#71717A] text-hakgyo-r-14 text-left">{song.artist}</div>
      </div>
      {added ? (
        <div onClick={() => onToggle(song)}>
          <img src={Check} alt="check" className="w-[7.8vw] h-[7.8vw] max-w-[31px] max-h-[31px]" />
        </div>
      ) : (
        <div onClick={() => onToggle(song)}>
          <img src={Plus} alt="plus" className="w-[7.8vw] h-[7.8vw] max-w-[31px] max-h-[31px]" />
        </div>
      )}
    </div>
  );
}
