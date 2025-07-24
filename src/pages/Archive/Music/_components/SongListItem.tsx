import Plus from "@/assets/icons/archive/plusfilled.svg";
import Check from "@/assets/icons/archive/checkfilled.svg";

interface Song {
  image: string;
  title: string;
  artist: string;
}

interface SongListItemProps {
  song: Song;
  added: boolean;
  onToggle: (title: string) => void;
}

export default function SongListItem({ song, added, onToggle }: SongListItemProps) {
  return (
    <div className="flex items-center">
      <div className="relative w-[14vw] h-[14vw] mr-[4vw]">
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
        <div onClick={() => onToggle(song.title)}>
          <img src={Check} alt="check" className="w-[7.8vw] h-[7.8vw]" />
        </div>
      ) : (
        <div onClick={() => onToggle(song.title)}>
          <img src={Plus} alt="plus" className="w-[7.8vw] h-[7.8vw]" />
        </div>
      )}
    </div>
  );
}
