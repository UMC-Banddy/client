import { showMembers } from "../../_utils/showMembers";
import { useNavigate } from "react-router-dom";

interface NormalChatProps {
  roomId?: number;
  name: string;
  thumbnail: string | null;
  members: string[];
  unreadCount: number | null;
  roomType?: "PRIVATE" | "GROUP";
}

const NormalChat = ({
  roomId,
  name,
  thumbnail,
  members,
  unreadCount,
  roomType,
}: NormalChatProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (roomType === "PRIVATE") {
      navigate(`/home/private-chat?roomId=${roomId}&roomType=PRIVATE`);
    }
  };

  return (
    <button 
      className="flex justify-between items-center w-full bg-transparent border-none cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-[12px]">
        <div
          className="size-[50px] rounded-full bg-[#777] bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnail})` }}
        ></div>
        <div className="flex flex-col gap-[4px] text-start">
          <p className="text-hakgyo-r-16 text-[#fff]">{name}</p>
          <p className="text-hakgyo-r-14 text-[#959595]">
            {showMembers(members)}
          </p>
        </div>
      </div>
      {unreadCount && roomType !== "PRIVATE" && (
        <div className="flex justify-center items-center size-[22px] rounded-full bg-[#C7242D] text-[#fff] text-wanted-sb-10">
          {unreadCount}
        </div>
      )}
    </button>
  );
};

export default NormalChat;
