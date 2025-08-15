import { useState, useEffect } from "react";
import { getFolderColor } from "@/features/archive/utils/colorMapping";
import blackcheck from "@/assets/icons/archive/blackcheck.svg";

interface AddFolderModalProps {
  isOpen: boolean;
onClose: () => void;
  onAdd: (name: string, color: string) => void;
  currentFolderCount: number;
}

const FOLDER_COLORS = ["GRAY", "YELLOW", "GREEN", "RED", "ORANGE", "BLUE"];

export default function AddFolderModal({ isOpen, onClose, onAdd, currentFolderCount }: AddFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState("GRAY");

  // 모달이 열릴 때마다 폴더 이름 초기화
  useEffect(() => {
    if (isOpen) {
      setFolderName(`폴더${currentFolderCount + 1}`);
      setSelectedColor("GRAY");
    }
  }, [isOpen, currentFolderCount]);

  const handleAdd = () => {
    if (folderName.trim()) {
      onAdd(folderName.trim(), selectedColor);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 8자 이내로 제한
    if (value.length <= 8) {
      setFolderName(value);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* 모달 */}
      <div className="fixed bottom-[12.2vh] left-0 right-0 bg-white rounded-[20px] z-50 p-6 max-w-[400px] mx-auto">
        <div className="w-full max-w-md mx-auto">
          {/* 제목 */}
          <div className="text-[#292929] text-hakgyo-b-17 mb-6 text-left">
            폴더 추가
          </div>
          
          {/* 폴더 이름 입력 */}
          <div className="mb-6">
            <input
              type="text"
              value={folderName}
              onChange={handleFolderNameChange}
              onKeyPress={handleKeyPress}
              maxLength={8}
              className="w-full py-3 text-[#1C1C1E] text-hakgyo-r-16 border-b border-[#E5E5EA] focus:outline-none focus:border-[#007AFF]"
              placeholder="폴더 이름을 입력하세요 (8자 이내)"
            />
          </div>
          
          {/* 색상 선택 */}
          <div className="mb-8">
            <div className="flex justify-center gap-4">
              {FOLDER_COLORS.map((color) => (
                <div
                  key={color}
                  className="relative cursor-pointer"
                  onClick={() => setSelectedColor(color)}
                >
                  <div
                    className="w-12 h-12 rounded-full border-2 border-[#E5E5EA]"
                    style={{ backgroundColor: getFolderColor(color) }}
                  />
                  {selectedColor === color && (
                    <img
                      src={blackcheck}
                      alt="selected"
                      className="absolute inset-0 m-auto w-6 h-6"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-[#555555] text-hakgyo-b-17 rounded-[12px]"
            >
              취소
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-3 text-[#B42127] text-hakgyo-b-17 rounded-[12px]"
            >
              추가
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
