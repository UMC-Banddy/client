import back from "@/assets/icons/archive/back.svg";
import folder from "@/assets/icons/archive/folder.svg";
import { type TrackFolder } from "@/types/track";

interface SelectFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFolder: (folderId: number) => void;
  folders: TrackFolder[];
  trackCounts: Record<number, number>; // 각 폴더의 곡 개수
}

export default function SelectFolderModal({ 
  isOpen, 
  onClose, 
  onSelectFolder, 
  folders, 
  trackCounts 
}: SelectFolderModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed bottom-[12.2vh] left-0 right-0 bg-[#E9E9E9] rounded-[20px] z-50 max-w-[400px] mx-auto">
        <div className="w-full max-w-md mx-auto">
          {/* 헤더 */}
          <div className="flex items-center">
            <button onClick={onClose} className="mr-4">
              <img src={back} alt="back" className="w-[12vw] h-[12vw] max-w-[48px] max-h-[48px]" />
            </button>
            <div className="text-[#292929] text-hakgyo-b-17">
              저장 폴더 선택
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-b border-[#E5E5EA] mb-[14px] mx-[16px]"></div>

          {/* 폴더 목록 */}
          <div className="space-y-[16px]">
            {folders.map((folderItem) => (
              <div
                key={folderItem.folderId}
                className="flex items-center justify-between px-[16px] py-[10px] rounded-[12px] hover:bg-gray-50 cursor-pointer mb-[10px]"
                onClick={() => onSelectFolder(folderItem.folderId)}
              >
                <div className="flex items-center">
                  <img src={folder} alt="folder" className="w-[12vw] h-[12vw] max-w-[48px] max-h-[48px] mr-[12px]" />
                  <span className="text-[#121212] text-hakgyo-r-16">
                    {folderItem.name}
                  </span>
                </div>
                <span className="text-[#121212] text-wanted-sb-15">
                  {trackCounts[folderItem.folderId] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
