import host from "@/assets/icons/join/ic_host.svg";
import { useNavigate } from "react-router-dom";

interface BandChatProps {
  id: number;
  name: string;
  thumbnail: string | null;
  unreadCount: number | null;
  isHost?: boolean;
  roomId?: number;
  roomType?: "BAND";
}

const BandChat = ({
  id,
  name,
  thumbnail,
  unreadCount,
  isHost = false,
  // roomId, // eslint 에러로 인해 임시 주석
  // roomType, // eslint 에러로 인해 임시 주석
}: BandChatProps) => {
  const navigate = useNavigate();

  /* eslint로 인해 임시 비활성화
  const handleClick = () => {
    if (isHost) {
      // 밴드 관리자인 경우 밴드 모집 페이지로 이동
      navigate(`/join/band-recruit/${id}`);
    } else if (roomId && roomType) {
      // 밴드 지원자인 경우 채팅방으로 이동
      navigate(`/home/chat?roomId=${roomId}&roomType=${roomType}`);
    }
  };
  */

  return (
    <button
      className="flex justify-between items-center w-full bg-transparent border-none cursor-pointer"
      onClick={() => {
        if (isHost) {
          // 채팅 선택 페이지 이동
          navigate(`/join/band-recruit/${id}`);
        } else {
          // 밴드 채팅방 이동
          navigate(`/home/private-chat?roomId=${id}&roomType=BAND-APPLICANT`);
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
