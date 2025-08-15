import host from "@/assets/icons/join/ic_host.svg";
import { useNavigate } from "react-router-dom";

interface BandChatProps {
  id: number;
  name: string;
  thumbnail: string | null;
  unreadCount: number | null;
  isHost?: boolean;
}

const BandChat = ({
  id,
  name,
  thumbnail,
  unreadCount,
  isHost = false,
}: BandChatProps) => {
  const navigate = useNavigate();

  return (
    <button
      className="flex justify-between items-center w-full bg-transparent border-none cursor-pointer"
      onClick={() => {
        if (isHost) {
          navigate(`/join/band-recruit/${id}`);
        }
      }}
    >
      <div className="flex items-center gap-[12px]">
        <div
          className="size-[50px] bg-[#777] bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnail})` }}
        ></div>
        <div className="flex flex-col gap-[4px] text-start">
          <p className="flex items-center gap-[4px] text-hakgyo-r-16 text-[#fff]">
            {isHost && <img className="size-[18px]" src={host} alt="" />}
            {name}
          </p>
        </div>
      </div>
      {unreadCount ? (
        <div className="flex justify-center items-center size-[22px] rounded-full bg-[#C7242D] text-[#fff] text-wanted-sb-10">
          {unreadCount}
        </div>
      ) : null}
    </button>
  );
};

export default BandChat;
