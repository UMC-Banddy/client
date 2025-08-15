import { showMembers } from "../../_utils/showMembers";

interface NormalChatProps {
  name: string;
  thumbnail: string | null;
  members: string[];
  unreadCount: number | null;
}

const NormalChat = ({
  name,
  thumbnail,
  members,
  unreadCount,
}: NormalChatProps) => {
  return (
    <button className="flex justify-between items-center w-full bg-transparent border-none cursor-pointer">
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
      {unreadCount && (
        <div className="flex justify-center items-center size-[22px] rounded-full bg-[#C7242D] text-[#fff] text-wanted-sb-10">
          {unreadCount}
        </div>
      )}
    </button>
  );
};

export default NormalChat;
