import { User, Pencil } from "lucide-react";
import Share from "@/assets/icons/my/share.svg";

interface ProfileInfoProps {
  avatarUrl?: string;
  nickname: string;
  bio?: string;
  hashtags?: string[];
  showEdit?: boolean;
  showShare?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
}

export default function ProfileInfo({
  avatarUrl, nickname, bio, showEdit = true, showShare = true, onEdit, onShare
}: ProfileInfoProps) {
  return (
    <div className="flex flex-row items-center gap-[7vw] px-[6vw] pt-[1.8vh] pb-[4vh] w-full">
      <div className="w-[25vw] h-[25vw] rounded-full bg-[#9CA3AF] flex items-center justify-center overflow-hidden flex-shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <User size={40} className="text-[#FFFFFF]" />
        )}
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <div className="text-[#FFFFFF] text-left text-hakgyo-b-17 mb-[1vh]">{nickname}</div>
        {bio && <div className="text-[#CACACA] text-left text-hakgyo-r-14 mb-[2vh]">{bio}</div>}
        <div className="flex gap-[3vw]">
          {showEdit && (
            <button
              className="flex items-center gap-[4px] border border-[#959595] bg-[#292929] rounded-full px-[3vw] py-[1vh] text-wanted-sb-12 text-[#FFFFFF] hover:bg-white/10 transition"
              onClick={onEdit}
            >
              <Pencil className="w-[4vw] h-[4vw]"/>수정
            </button>
          )}
          {showShare && (
            <button
              className="flex items-center justify-center text-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition"
              onClick={onShare}
              aria-label="공유"
            >
              <img src={Share} alt="share" className="w-[8vw] h-[8vw]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
