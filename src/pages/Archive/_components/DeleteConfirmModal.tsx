import MuiDialog from "@/shared/components/MuiDialog";
import CommonBtn from "@/shared/components/CommonBtn";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: "음악" | "아티스트" | "앨범";
  itemCount: number;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  itemCount,
}: DeleteConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <MuiDialog open={isOpen} setOpen={onClose}>
      <div className="flex flex-col items-center justify-center bg-[#e9e9e9] rounded-[14px] pt-[62px] pb-[28px]">
        <div className="text-hakgyo-b-24 text-[#292929] mb-[1.4vh]">
          {itemType} 삭제
        </div>
        <div className="text-hakgyo-r-14 text-[#555555] mb-[5vh] w-[61vw] max-w-[220px] text-center">
          {itemCount}개의 항목을 삭제하시겠습니까?
          <br />
          되돌릴 수 없습니다.
        </div>
        <div className="flex gap-[2vw] w-full justify-center mx-[59px]">
          <CommonBtn color="gray" onClick={onClose}>
            아니오
          </CommonBtn>
          <CommonBtn color="red" onClick={handleConfirm}>
            예
          </CommonBtn>
        </div>
      </div>
    </MuiDialog>
  );
}
