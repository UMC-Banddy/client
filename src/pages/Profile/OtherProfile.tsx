import { useState } from "react";
import { useParams } from "react-router-dom";
import ProfileInfo from "@/pages/My/_components/ProfileInfo";
import SectionDivider from "@/pages/My/_components/SectionDivider";
import HashtagList from "@/pages/My/_components/HashTagList";
import ArtistGrid from "@/pages/Archive/Artist/ArtistGrid";
import MusicList from "@/pages/Archive/Music/MusicList";
import MyArchiveItem from "@/pages/My/_components/Archive/MyArchiveItem";
import { useOtherProfile } from "@/features/profile/hooks/useOtherProfile";
import { useSavedTracks } from "@/features/profile/hooks/useSavedTracks";
import { useSavedAlbums } from "@/features/profile/hooks/useSavedAlbums";

export default function OtherProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"곡" | "앨범">("곡");
  
  const { profile: otherProfile, isLoading: profileLoading, error: profileError } = useOtherProfile(id ? parseInt(id) : null);
  const { tracks, isLoading: tracksLoading, error: tracksError } = useSavedTracks(id ? parseInt(id) : null);
  const { albums, isLoading: albumsLoading, error: albumsError } = useSavedAlbums(id ? parseInt(id) : null);

  // API 데이터를 기존 형식으로 변환
  const profile = otherProfile ? {
    avatar: otherProfile.profileImageUrl,
    name: otherProfile.nickname,
    bio: otherProfile.bio,
    artists: otherProfile.favoriteArtists.map(artist => ({
      image: artist.imageUrl,
      title: artist.name
    })),
    albums: albums.map(album => ({
      image: album.imageUrl,
      title: album.name
    })),
    musics: tracks.map(track => ({
      image: track.imageUrl,
      title: track.title,
      artist: track.artist
    })),
    hashtags: otherProfile.tags,

  } : null;

  // 로딩 중이거나 에러가 있으면 처리
  if (profileLoading || tracksLoading || albumsLoading) {
    return (
      <div className="min-h-[100vh] w-full flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  if (profileError || tracksError || albumsError) {
    return (
      <div className="min-h-[100vh] w-full flex items-center justify-center">
        <div className="text-white">{profileError || tracksError || albumsError}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[100vh] w-full flex items-center justify-center">
        <div className="text-white">프로필을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] w-full flex flex-col pb-[4vh]">
      <ProfileInfo avatarUrl={profile.avatar} nickname={profile.name} bio={profile.bio} showEdit={false} showShare={false} />
      <HashtagList tags={profile.hashtags} />
      
      <div className="pl-[24px]">
        <ArtistGrid items={profile.artists} />
      </div>
      
      <SectionDivider />
      
      <div className="flex gap-[2.5vw] px-[24px] mb-[3.2vh] mt-[1.8vh]">
        <button
          onClick={() => setActiveTab("곡")}
          className={`px-[20px] py-[8px] rounded-[19px] text-wanted-sb-15 ${
            activeTab === "곡" 
              ? "bg-[#B42127] text-[#E9E9E9]" 
              : "bg-[#555555] text-[#E9E9E9]"
          }`}
        >
          곡
        </button>
        <button
          onClick={() => setActiveTab("앨범")}
          className={`px-[20px] py-[8px] rounded-[19px] text-wanted-sb-15 ${
            activeTab === "앨범" 
              ? "bg-[#B42127] text-[#E9E9E9]" 
              : "bg-[#555555] text-[#E9E9E9]"
          }`}
        >
          앨범
        </button>
      </div>
      
      <div className="px-[24px]">
        {activeTab === "곡" ? (
          <MusicList 
            items={profile.musics.map(music => ({
              image: music.image,
              title: music.title,
              subtitle: music.artist
            }))} 
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-[16px] gap-y-[20px]">
            {profile.albums.map((album, i) => (
              <MyArchiveItem
                key={i}
                coverUrl={album.image}
                title={album.title}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}