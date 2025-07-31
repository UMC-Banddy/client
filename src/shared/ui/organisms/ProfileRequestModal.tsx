import CustomButton from "@/shared/ui/atoms/CustomButton";

interface ProfileRequestModalProps {
  open: boolean;
  type: "chat" | "friend";
  profileName: string;
  message: string;
  onMessageChange: (msg: string) => void;
  onSend: () => void;
  onClose: () => void;
}

const ProfileRequestModal: React.FC<ProfileRequestModalProps> = ({
  open,
  type,
  profileName,
  message,
  onMessageChange,
  onSend,
  onClose,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-[85.49vw] flex flex-col items-center px-[48px] py-[40px] max-w-[342px]">
        <div className="text-hakgyo-b-24 text-gray-700 mb-[2vh]">{type === "chat" ? "채팅 요청" : "친구 신청"}</div>
        <div className="text-hakgyo-r-14 text-[#555555] mb-[2.5vh] text-center break-keep">
          ‘{profileName}’ 님께 {type === "chat" ? "채팅을 요청하시겠습니까?" : "친구 신청을 하시겠습니까?"}<br />
          상대방이 수락하면 {type === "chat" ? "채팅이 시작됩니다." : "친구로 맺어집니다."}
        </div>
        <div className="w-full text-wanted-sb-13 text-[#555555] mb-[1vh]">전달할 메시지</div>
        <textarea
          id="profile-request-message"
          className="w-full h-20 bg-[#CACACA] p-[8px] text-hakgyo-r-14 text-[#555555] resize-none mb-[2vh] outline-none focus:outline-none"
          maxLength={50}
          placeholder="이곳에 메시지를 입력하세요.
(50자 제한)"
          value={message}
          onChange={e => onMessageChange(e.target.value)}
        />
        <div className="flex w-full gap-3 mt-[0.5vh]">
          <CustomButton className="flex-1" bgColor="bg-[#CACACA]" textColor="text-[#B42127]" onClick={onClose}>아니오</CustomButton>
          <CustomButton className="flex-1" bgColor="bg-[#B42127]" onClick={onSend}>보내기</CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ProfileRequestModal;
