import React from "react";
import PlaylistItem from "./PlaylistItem";
import theCabs from "@/assets/images/the-cabs.svg";

interface Track {
  id: number;
  title: string;
  artist: string;
  image?: string;
  albumImage?: string;
  duration?: string;
}

interface PlaylistListProps {
  tracks?: Track[];
}

// 기본 데이터 (API 연결 전까지 사용)
const defaultPlaylistData: Track[] = [
  {
    id: 1,
    title: "いらないもの",
    artist: "The Cabs",
    image: theCabs,
    duration: "3:45",
  },
  {
    id: 2,
    title: "いらないもの",
    artist: "The Cabs",
    image: theCabs,
    duration: "3:45",
  },
  {
    id: 3,
    title: "いらないもの",
    artist: "The Cabs",
    image: theCabs,
    duration: "3:45",
  },
  {
    id: 4,
    title: "いらないもの",
    artist: "The Cabs",
    image: theCabs,
    duration: "3:45",
  },
  {
    id: 5,
    title: "いらないもの",
    artist: "The Cabs",
    image: theCabs,
    duration: "3:45",
  },
];

const PlaylistList: React.FC<PlaylistListProps> = ({
  tracks = defaultPlaylistData,
}) => (
  <div className="flex-1 flex flex-col w-full px-2 overflow-y-auto scrollbar-hide">
    {tracks.map((item) => (
      <PlaylistItem
        key={item.id}
        title={item.title}
        artist={item.artist}
        image={item.albumImage || item.image || theCabs}
      />
    ))}
  </div>
);

export default PlaylistList;
