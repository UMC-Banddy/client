import SongListItem from "./SongListItem";
import { type Song } from "@/types/song";

interface SongListProps {
  songs: Song[];
  added: boolean[];
  onToggle: (song: Song) => void;
}

export default function SongList({ songs, added, onToggle }: SongListProps) {
  return (
    <div className="flex flex-col gap-[1.4vh] mt-[2.3vh] mb-[3.5vh]">
      {songs.map((song, i) => (
        <SongListItem
          key={i}
          song={song}
          added={added[i]}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
