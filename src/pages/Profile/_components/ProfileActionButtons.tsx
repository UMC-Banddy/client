import ProfileDetailBtn from "./ProfileDetailBtn";
import chat_request from "@/assets/icons/profile/chat-request.svg";
import friend_request from "@/assets/icons/profile/friend-request.svg";

type ProfileActionButtonsProps = {
  onChat: () => void;
  onFriend: () => void;
};

export default function ProfileActionButtons({ onChat, onFriend }: ProfileActionButtonsProps) {
  return (
    <div className="flex gap-[2vw] mb-[4vh]">
      <ProfileDetailBtn
        color="gray"
        className="flex items-center gap-[1vw] px-[4vw] py-[2vh] text-wanted-b-13"
        onClick={onChat}
      >
        <img src={chat_request} alt="chat" className="w-[5vw] h-[5vw]" /> 채팅 요청
      </ProfileDetailBtn>
      <ProfileDetailBtn
        color="red"
        className="flex items-center gap-[1vw] px-[4vw] py-[2vh]"
        onClick={onFriend}
      >
        <img src={friend_request} alt="friend" className="w-[5vw] h-[5vw]" /> 친구 추가
      </ProfileDetailBtn>
    </div>
  );
}