import Share from "@/assets/icons/my/share.svg";
import Pencil from "@/assets/icons/my/pencil.svg";
import { useNavigate } from "react-router-dom";
import noImg from "@/assets/icons/profile/no_img.svg";

interface ProfileInfoProps {
  avatarUrl?: string;
  nickname: string;
  bio?: string;
  hashtags?: string[];
  showEdit?: boolean;
  showShare?: boolean;
}

export default function ProfileInfo({
  avatarUrl, nickname, bio, showEdit = true, showShare = true
}: ProfileInfoProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row items-center gap-[28px] px-[24px] pt-[1.8vh] pb-[4vh] w-full">
      <div className="w-[25vw] h-[25vw] rounded-full bg-[#9CA3AF] flex items-center justify-center overflow-hidden flex-shrink-0 max-w-[100px] max-h-[100px]">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <img src={noImg} alt="no image" className="w-[70%] h-[70%] opacity-50" />
        )}
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <div className="text-[#FFFFFF] text-left text-hakgyo-b-17 mb-[1vh]">{nickname}</div>
        {bio && <div className="text-[#CACACA] text-left text-hakgyo-r-14 mb-[2vh]">{bio}</div>}
        <div className="flex gap-[12px]">
          {showEdit && (
            <button
              className="flex items-center gap-[4px] outline outline-[#959595] bg-[#292929] rounded-full px-[15px] py-[10px] text-wanted-sb-12 text-[#E9E9E9] max-w-[71px] max-h-[34px]"
              onClick={() => navigate("/my/edit")}
            >
              <img src={Pencil} alt="pencil" className="w-[4vw] h-[4vw] max-w-[16px] max-h-[16px]"/>수정
            </button>
          )}
          {showShare && (
            <button
              className="flex items-center justify-center text-[#FFFFFF] max-w-[32px] max-h-[32px]"
              onClick={() => alert("공유")}
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
