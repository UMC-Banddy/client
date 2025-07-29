import SongListItem from "./SongListItem";

interface Song {
  image: string;
  title: string;
  artist: string;
}

interface SongListProps {
  songs: Song[];
  added: string[];
  onToggle: (title: string) => void;
}

export default function SongList({ songs, added, onToggle }: SongListProps) {
  return (
    <div className="flex flex-col gap-[1.4vh] mt-[2.3vh]">
      {songs.map((song, i) => (
        <SongListItem
          key={i}
          song={song}
          added={added.includes(song.title)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
