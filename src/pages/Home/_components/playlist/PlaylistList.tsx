import React from "react";
import PlaylistItem from "./PlaylistItem";

const mockList = [
  {
    image: "/src/assets/images/the-cabs.svg",
    title: "二月の兵隊",
    artist: "The cabs",
  },
  {
    image: "/src/assets/images/the-cabs.svg",
    title: "二月の兵隊",
    artist: "The cabs",
  },
  {
    image: "/src/assets/images/the-cabs.svg",
    title: "二月の兵隊",
    artist: "The cabs",
  },
  {
    image: "/src/assets/images/the-cabs.svg",
    title: "二月の兵隊",
    artist: "The cabs",
  },
  {
    image: "/src/assets/images/the-cabs.svg",
    title: "二月の兵隊",
    artist: "The cabs",
  },
];

const PlaylistList: React.FC = () => (
  <div className="flex-1 flex flex-col w-full px-2 overflow-y-auto scrollbar-hide">
    {mockList.map((item, idx) => (
      <PlaylistItem key={idx} {...item} />
    ))}
  </div>
);

export default PlaylistList;
