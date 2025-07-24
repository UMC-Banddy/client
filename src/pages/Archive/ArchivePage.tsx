import ArchiveTabs from "./_components/ArchiveTabs";
import Music from "./Music/MusicPage";
import Artist from "./Artist/ArtistPage";
import Album from "./Album/AlbumPage";
import { useState } from "react";

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState("음악");

  return (
    <div className="min-h-[100dvh] w-full flex flex-col pl-[6vw]">
      <ArchiveTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "음악" && <Music />}
      {activeTab === "아티스트" && <Artist />}
      {activeTab === "앨범" && <Album />}
    </div>
  );
} 