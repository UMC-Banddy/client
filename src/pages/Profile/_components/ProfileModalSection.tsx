import ProfileRequestModal from "@/shared/ui/organisms/ProfileRequestModal";
import Toast from "@/shared/ui/atoms/Toast";

interface ProfileModalSectionProps {
  modalType: "chat" | "friend" | null;
  modalMsg: string;
  profileName: string;
  onSend: () => void;
  onClose: () => void;
  onMessageChange: (msg: string) => void;
  toast: { message: string; visible: boolean };
}

export default function ProfileModalSection({
  modalType,
  modalMsg,
  profileName,
  onSend,
  onClose,
  onMessageChange,
  toast
}: ProfileModalSectionProps) {

  return (
    <>
      {/* 모달 */}
      <ProfileRequestModal
        open={!!modalType}
        type={modalType as "chat" | "friend"}
        profileName={profileName}
        message={modalMsg}
        onMessageChange={onMessageChange}
        onSend={onSend}
        onClose={onClose}
      />
      {/* 토스트 */}
      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
} 