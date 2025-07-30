import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileInfo from "@/pages/My/_components/ProfileInfo";
import SectionDivider from "@/pages/Profile/_components/SectionDivider";
import HashtagList from "@/pages/My/_components/HashTagList";
import ArtistGrid from "@/pages/Archive/Artist/ArtistGrid";
import MusicList from "@/pages/Archive/Music/MusicList";
import MyArchiveItem from "@/pages/My/_components/Archive/MyArchiveItem";
import {
  getOtherProfile,
  getOtherSavedTracks,
  getOtherTags,
} from "@/store/userStore";

interface OtherProfileData {
  memberId: number;
  nickname: string;
  bio: string;
  profileImageUrl: string;
  age: number;
  gender: string;
  region: string;
  tags: string[];
  sessions: Array<{ name: string; icon: string }>;
  favoriteArtists: Array<{ name: string; imageUrl: string }>;
  traits: string[];
  youtubeUrl?: string;
  instagramUrl?: string;
  isFriend: boolean;
  isBlocked: boolean;
  canRequestChat: boolean;
}

interface SavedTrack {
  id: number;
  title: string;
  artist: string;
  albumImage?: string;
  duration?: string;
}

export default function OtherProfile() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"곡" | "앨범">("곡");
  const [profile, setProfile] = useState<OtherProfileData | null>(null);
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 상대방 프로필 조회
  const fetchOtherProfile = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const profileData = await getOtherProfile(id);
      setProfile(profileData);

      // 상대방 저장한 곡도 함께 조회
      const tracksData = await getOtherSavedTracks(id);
      setSavedTracks(tracksData.result || []);
    } catch (error: any) {
      console.error("상대방 프로필 조회 실패:", error);
      setError(
        error.response?.data?.message || "프로필을 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOtherProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[100vh] w-full flex flex-col items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[100vh] w-full flex flex-col items-center justify-center">
        <div className="text-white">
          {error || "프로필을 찾을 수 없습니다."}
        </div>
      </div>
    );
  }

  // API 응답 데이터를 컴포넌트에서 사용할 형태로 변환
  const profileForComponent = {
    avatar: profile.profileImageUrl,
    name: profile.nickname,
    bio: profile.bio,
    artists: profile.favoriteArtists.map((artist) => ({
      image: artist.imageUrl,
      title: artist.name,
    })),
    albums: [], // TODO: 상대방 앨범 API 연결 필요
    musics: savedTracks.map((track) => ({
      image: track.albumImage || "https://via.placeholder.com/150",
      title: track.title,
      artist: track.artist,
    })),
    hashtags: profile.tags,
  };

  return (
    <div className="min-h-[100vh] w-full flex flex-col pb-[4vh]">
      <ProfileInfo
        avatarUrl={profileForComponent.avatar}
        nickname={profileForComponent.name}
        bio={profileForComponent.bio}
        showEdit={false}
        showShare={false}
      />
      <HashtagList tags={profileForComponent.hashtags} />

      <div className="pl-[24px] mb-[1vh]">
        <ArtistGrid items={profileForComponent.artists} />
      </div>

      <SectionDivider />

      <div className="flex gap-[2.5vw] px-[24px] mb-[3.2vh]">
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
            items={profileForComponent.musics.map((music) => ({
              image: music.image,
              title: music.title,
              subtitle: music.artist,
            }))}
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-[16px] gap-y-[20px]">
            {profileForComponent.albums.map((album, i) => (
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
