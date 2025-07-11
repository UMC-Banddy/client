import { User, Pencil, Share } from 'lucide-react';

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
    <div className="flex flex-row items-center gap-[7vw] px-[6vw] py-[2vh] w-full max-w-[350px]">
      <div className="w-[25vw] h-[25vw] rounded-full bg-[#9CA3AF] flex items-center justify-center overflow-hidden flex-shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <User size={40} className="text-[#FFFFFF]" />
        )}
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <div className="text-[#FFFFFF] text-left text-hakgyo-b-17 mb-[4px] truncate">{nickname}</div>
        {bio && <div className="text-[#D1D5DB] text-left text-hakgyo-r-14 mb-[1vh] truncate">{bio}</div>}
        <div className="flex gap-[3vw]">
          {showEdit && (
            <button
              className="flex items-center gap-[4px] border border-[#959595] bg-[#1C1C1E] rounded-full px-[16px] py-[8px] text-[12px] text-[#FFFFFF] hover:bg-white/10 transition"
              onClick={onEdit}
            >
              <Pencil size={16} /> 수정
            </button>
          )}
          {showShare && (
            <button
              className="flex items-center justify-center text-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition"
              onClick={onShare}
              style={{ border: 'none', background: 'none', padding: 0, borderRadius: 0 }}
              aria-label="공유"
            >
              <Share size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
