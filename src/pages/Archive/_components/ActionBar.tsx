import additem from "@/assets/icons/archive/additem.svg";
import trash from "@/assets/icons/archive/trash.svg";

interface ActionBarProps {
  isVisible: boolean;
  onAddToFolder: () => void;
  onDelete: () => void;
  onCancel: () => void;
  showFolderIcon?: boolean;
}

export default function ActionBar({ isVisible, onAddToFolder, onDelete, onCancel, showFolderIcon = true }: ActionBarProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-[12.2vh] left-0 right-0 bg-[#212121] backdrop-blur-sm z-50 p-4 max-w-[400px] mx-auto rounded-[20px]">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* 취소 버튼 */}
        <button
          onClick={onCancel}
          className="text-[#e9e9e9] text-ibm-sb-16"
        >
          취소
        </button>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-[8px]">
          {/* 폴더로 추가 버튼 */}
          {showFolderIcon && (
            <button
              onClick={onAddToFolder}
              className="flex items-center gap-2 text-white"
            >
              <img src={additem} alt="add to folder" className="w-[12vw] h-[12vw] max-w-[48px] max-h-[48px]" />
            </button>
          )}

          {/* 삭제 버튼 */}
          <button
            onClick={onDelete}
            className="flex items-center gap-2 text-white"
          >
            <img src={trash} alt="delete" className="w-[12vw] h-[12vw] max-w-[48px] max-h-[48px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
