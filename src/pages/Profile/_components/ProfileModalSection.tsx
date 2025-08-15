import ProfileRequestModal from "@/shared/ui/organisms/ProfileRequestModal";

interface ProfileModalSectionProps {
  modalType: "chat" | "friend" | null;
  modalMsg: string;
  profileName: string;
  onSend: (toastMessage: string) => void;
  onClose: () => void;
  onMessageChange: (msg: string) => void;
  targetMemberId: number;
}

export default function ProfileModalSection({
  modalType,
  modalMsg,
  profileName,
  onSend,
  onClose,
  onMessageChange,
  targetMemberId
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
        targetMemberId={targetMemberId}
      />
    </>
  );
} 