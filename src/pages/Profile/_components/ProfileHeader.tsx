import ProfileMoreMenu from "./ProfileMoreMenu";
import arrow_back from "@/assets/icons/back.svg";
import { useNavigate } from "react-router-dom";

// type Profile = {
//   실제 필요한 필드만 정의 (여기선 사용 안함)
// };

type ProfileHeaderProps = {
  // profile: Profile;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onReport: () => void;
  onBan: () => void;
};

export default function ProfileHeader({ 
  // profile, 
  menuOpen, 
  setMenuOpen, 
  onReport, 
  onBan 
}: ProfileHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="w-full h-[12vh] flex items-center justify-between">
      <button className="w-[8vw] h-[8vw] flex items-center justify-center ml-[3vw]" onClick={() => navigate(-1)}>
        <img src={arrow_back} alt="arrow-back" className="w-[8vw] h-[8vw] max-w-[32px] max-h-[32px]" />
      </button>
      <ProfileMoreMenu open={menuOpen} setOpen={setMenuOpen} onReport={onReport} onBan={onBan} />
    </header>
  );
}