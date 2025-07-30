import React from "react";
import PlaylistItem from "./PlaylistItem";
import theCabs from "@/assets/images/the-cabs.svg";

const playlistData = [
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

const PlaylistList: React.FC = () => (
  <div className="flex-1 flex flex-col w-full px-2 overflow-y-auto scrollbar-hide">
    {playlistData.map((item) => (
      <PlaylistItem key={item.id} {...item} />
    ))}
  </div>
);

export default PlaylistList;
