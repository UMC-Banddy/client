import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { IoEllipsisVertical } from "react-icons/io5";
import Modal from "@/shared/components/MuiDialog";
import profile1 from "@/assets/images/profile1.png";

interface ChatHeaderProps {
  roomId?: string;
  roomName?: string;
  bandAvatar?: string;
  memberCount?: number;
  onBack?: () => void;
  onMenuClick?: () => void;
}

const ChatHeader = ({
  roomId,
  roomName = "채팅방",
  bandAvatar,
  memberCount = 0,
  onBack,
  onMenuClick,
}: ChatHeaderProps) => {
  const navigate = useNavigate();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleLeaveRoom = () => {
    // TODO: 채팅방 나가기 API 호출
    console.log("채팅방 나가기:", roomId);
    setShowLeaveConfirm(false);
    navigate(-1);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoChevronBack className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <img
              src={bandAvatar || profile1}
              alt="밴드"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {roomName}
              </h2>
              <p className="text-xs text-gray-500">{memberCount}명</p>
            </div>
          </div>
        </div>
        <button
          onClick={onMenuClick || (() => setShowLeaveConfirm(true))}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoEllipsisVertical className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <Modal open={showLeaveConfirm} setOpen={setShowLeaveConfirm}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">채팅방 나가기</h3>
          <p className="text-gray-600 mb-6">
            정말로 이 채팅방을 나가시겠습니까?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowLeaveConfirm(false)}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleLeaveRoom}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              나가기
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChatHeader;
