import { useRef, useState } from "react";
import { showMembers } from "../../_utils/showMembers";
import Modal from "@/shared/components/MuiDialog";
import CommonBtn from "@/shared/components/CommonBtn";
import { API } from "@/api/API";
import { useNavigate } from "react-router-dom";

interface NormalChatProps {
  roomId?: number;
  name: string;
  thumbnail: string | null;
  members: string[];
  unreadCount: number | null;
  pinnedAt: string | null;
  roomType?: "PRIVATE" | "GROUP";
}

const NormalChat = ({
  roomId,
  name,
  thumbnail,
  members,
  unreadCount,
  pinnedAt,
  roomType,
}: NormalChatProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showExitChat, setShowExitChat] = useState(false);
  const timerRef = useRef<number | null>(null);

  const navigate = useNavigate();

  const startPressTimer = () => {
    // 500ms 이상 누르면 롱프레스 인식
    timerRef.current = window.setTimeout(() => {
      setShowMenu(true);
    }, 500);
  };

  const cancelPressTimer = () => {
    // 터치가 끝나면 타이머 취소
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePinChat = async () => {
    try {
      await API.patch(
        !pinnedAt ? "/api/chat/rooms/pin" : "/api/chat/rooms/unpin",
        {},
        {
          params: {
            chatId: roomId,
          },
        }
      );
      setShowMenu(false);
      window.location.reload();
    } catch {
      console.log("채팅방 고정 실패");
    }
  };

  const handleExitChat = async () => {
    try {
      await API.post(`/api/chat/rooms/${roomId}/members/exit`);
      setShowExitChat(false);
      setShowMenu(false);
      window.location.reload();
    } catch {
      console.log("채팅방 나가기 실패");
    }
  };

  const handleClick = () => {
    if (roomType === "PRIVATE") {
      navigate(`/home/private-chat?roomId=${roomId}&roomType=PRIVATE`);
    }
  };

  return (
    <button
      className="flex justify-between items-center w-full bg-transparent border-none cursor-pointer"
      // 모바일 터치 이벤트
      onTouchStart={startPressTimer}
      onTouchEnd={cancelPressTimer}
      onTouchMove={cancelPressTimer}
      // 데스크톱 마우스 이벤트
      onMouseDown={startPressTimer}
      onMouseUp={cancelPressTimer}
      onMouseLeave={cancelPressTimer}
      onContextMenu={(e) => e.preventDefault()} // 기본 우클릭 메뉴 방지
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
      <div className="flex items-center gap-[8.92px]">
        {unreadCount && roomType !== "PRIVATE" && (
          <div className="flex justify-center items-center size-[22px] rounded-full bg-[#C7242D] text-[#fff] text-wanted-sb-10">
            {unreadCount}
          </div>
        )}
        {pinnedAt && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M12.5942 2.67524L12.6725 2.74441L17.2559 7.32774C17.3963 7.46897 17.4816 7.65585 17.4961 7.85452C17.5107 8.05318 17.4536 8.25049 17.3352 8.41069C17.2168 8.57089 17.045 8.68339 16.8508 8.72779C16.6566 8.7722 16.4529 8.74557 16.2767 8.65274L13.6334 11.2952L12.4467 14.4594C12.4154 14.5429 12.371 14.6208 12.315 14.6902L12.2567 14.7569L11.0067 16.0069C10.8631 16.1503 10.6721 16.2363 10.4696 16.2489C10.2671 16.2615 10.0669 16.1997 9.90669 16.0752L9.82753 16.0061L7.50003 13.6794L4.33919 16.8394C4.18923 16.9889 3.988 17.0756 3.77637 17.0821C3.56475 17.0886 3.3586 17.0142 3.19979 16.8742C3.04099 16.7342 2.94144 16.5389 2.92136 16.3282C2.90128 16.1174 2.96218 15.9069 3.09169 15.7394L3.16086 15.6611L6.32086 12.5002L3.99419 10.1727C3.85071 10.0292 3.76452 9.83833 3.75178 9.63581C3.73905 9.43329 3.80065 9.23308 3.92503 9.07274L3.99419 8.99441L5.24419 7.74441C5.30707 7.68131 5.37966 7.62869 5.45919 7.58857L5.54086 7.55357L8.70419 6.36607L11.3467 3.72441C11.2566 3.55593 11.2271 3.36161 11.2632 3.17399C11.2993 2.98638 11.3987 2.81685 11.5449 2.69382C11.6911 2.57079 11.8751 2.50172 12.0661 2.49819C12.2571 2.49466 12.4436 2.5577 12.5942 2.67524Z"
              fill="#E9E9E9"
            />
          </svg>
        )}
      </div>

      <Modal open={showMenu} setOpen={setShowMenu}>
        <div className="w-[323px] h-[210px]">
          <button
            className="p-[24px] w-full h-[70px] text-start text-hakgyo-b-17"
            onClick={() => {
              navigate("/join/change-chat-info", {
                state: {
                  roomId,
                },
              });
            }}
          >
            채팅방 정보 설정
          </button>
          <button
            className="p-[24px] w-full h-[70px] text-start text-hakgyo-b-17"
            onClick={handlePinChat}
          >
            {!pinnedAt ? "채팅방 상단 고정" : "채팅방 고정 해제"}
          </button>
          <button
            className="p-[24px] w-full h-[70px] text-start text-hakgyo-b-17"
            onClick={() => {
              setShowExitChat(true);
              setShowMenu(false);
            }}
          >
            채팅방 나가기
          </button>
        </div>
      </Modal>

      <Modal open={showExitChat} setOpen={setShowExitChat}>
        <div className="flex flex-col items-center pt-[62px] w-[336px] h-[229px]">
          <h1 className="text-hakgyo-b-24">채팅방 나가기</h1>
          <p className="mt-[12px] mb-[44px] text-hakgyo-r-14">
            채팅방에서 나가시겠습니까?
          </p>
          <div className="flex gap-[8px]">
            <CommonBtn color="gray" onClick={() => setShowExitChat(false)}>
              아니오
            </CommonBtn>
            <CommonBtn color="red" onClick={handleExitChat}>
              네
            </CommonBtn>
          </div>
        </div>
      </Modal>
    </button>
  );
};

export default NormalChat;
