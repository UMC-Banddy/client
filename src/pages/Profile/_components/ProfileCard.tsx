import { useNavigate } from "react-router-dom";
import ProfileActionButtons from "./ProfileActionButtons";
import ProfileSessionList from "./ProfileSessionList";
import ProfileGenreList from "./ProfileGenreList";
import ProfileArtistList from "./ProfileArtistList";
import ProfileTagList from "./ProfileTagList";
import ProfileBio from "./ProfileBio";
import Guide from "./Guide";
import file_music from "@/assets/icons/profile/file-music.svg";
import youtube from "@/assets/icons/profile/youtube.svg";

interface ProfileData {
  avatar: string;
  id: number;
  name: string;
  age: number;
  gender: string;
  location: string;
  session: Array<{ icon: React.ReactNode }>;
  genres: Array<{ icon: string; label: string }>;
  artists: Array<{ image: string; name: string }>;
  tags: string[];
  bio: string;
  youtubeUrl?: string | null;
}

interface ProfileCardProps {
  profile: ProfileData;
  onChat: () => void;
  onFriend: () => void;
  showGuide: boolean;
  onGuideClose: () => void;
}

export default function ProfileCard({ 
  profile, 
  onChat, 
  onFriend, 
  showGuide, 
  onGuideClose 
}: ProfileCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#CACACA] rounded-[3vh] w-[87vw] px-[24px] mt-[4vh] mb-[3vh] flex flex-col items-center relative max-w-md mx-auto">
      <div className="absolute top-[1rem] right-[4vw] flex flex-col gap-[0.5rem]">
        <button
          className="bg-[#B42127] rounded-full w-[12vw] h-[12vw] flex items-center justify-center max-w-[48px] max-h-[48px] cursor-pointer"
          onClick={() => navigate(`/profile-other/${profile.id}`)}
        >
          <img src={file_music} alt="file-music" className="w-[12vw] h-[12vw] max-w-[48px] max-h-[48px]" />
        </button>
        <button 
          className="bg-black rounded-full w-[12vw] h-[12vw] flex items-center justify-center max-w-[48px] max-h-[48px] cursor-pointer"
          onClick={() => {
            if (profile.youtubeUrl) {
              window.open(profile.youtubeUrl, "_blank");
            }
          }}
        >
          <img src={youtube} alt="youtube" className="w-[12vw] h-[12vw] max-w-[48px] max-h-[48px]" />
        </button>
      </div>
      
      {/* 프로필 이미지와 가이드 */}
      <div className="relative">
        <div 
          className="w-[38vw] h-[38vw] max-w-[152px] max-h-[152px] rounded-full bg-[#808080] flex items-center justify-center overflow-hidden mt-[4vh] mb-[1vh] cursor-pointer"
        >
          <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
        </div>
        
        {/* 가이드 */}
        <Guide showGuide={showGuide} onClose={onGuideClose} />
      </div>
      
      <div className="text-black text-hakgyo-b-24 mb-[0.8vh]">{profile.name}</div>
      <div className="text-black text-hakgyo-r-14 mb-[1.8vh]">{profile.age}세 | {profile.gender} · {profile.location}</div>
      
      <ProfileActionButtons
        onChat={onChat}
        onFriend={onFriend}
      />
      
      <div className="w-full flex flex-col items-start">
        <ProfileSessionList sessions={profile.session} />
        <ProfileGenreList genres={profile.genres} />
        <ProfileArtistList artists={profile.artists} />
        <ProfileTagList tags={profile.tags} />
        <ProfileBio bio={profile.bio} />
      </div>
    </div>
  );
} 