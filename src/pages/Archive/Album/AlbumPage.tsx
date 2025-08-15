import { useState } from "react";
import AlbumGrid from "./AlbumGrid";
import AlbumGridSkeleton from "./AlbumGridSkeleton";
import ActionBar from "../_components/ActionBar";
import DeleteConfirmModal from "../_components/DeleteConfirmModal";
import Toast from "@/shared/ui/atoms/Toast";
import lock from "@/assets/icons/archive/lock.svg";
import unlock from "@/assets/icons/archive/unlock.svg";
import plus from "@/assets/icons/archive/plus.svg";
import { useNavigate } from "react-router-dom";
import { useArchivedAlbums } from "@/features/archive/hooks/useArchivedAlbums";
import { useDeleteAlbum } from "@/features/archive/hooks/useDeleteAlbum";

export default function AlbumPage() {
  const [locked, setLocked] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedAlbums, setSelectedAlbums] = useState<number[]>([]);
  const [showActionBar, setShowActionBar] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { albums, isLoading, error } = useArchivedAlbums();
  const { deleteAlbum, toast } = useDeleteAlbum();

  // 핸들러들
  const handleLongPress = () => {
    setIsSelectionMode(true);
    setShowActionBar(true);
  };

  const handleAlbumSelect = (albumId: number) => {
    setSelectedAlbums(prev => {
      if (prev.includes(albumId)) {
        return prev.filter(id => id !== albumId);
      } else {
        return [...prev, albumId];
      }
    });
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setShowActionBar(false);
    setSelectedAlbums([]);
  };

  const handleDeleteClick = () => {
    if (selectedAlbums.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedAlbums.length === 0) return;
    
    selectedAlbums.forEach(albumId => {
      deleteAlbum({ albumId });
    });
    
    handleCancelSelection();
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  // 에러가 있으면 처리
  if (error) {
    return (
      <div className="min-h-[100vh] w-full flex items-center justify-center">
        <div className="text-white">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="">
        <div className="flex items-center justify-end mt-[2vh] mb-[3vh]">
          <div className="flex items-center justify-end mt-[1.6vh] mb-[0.5vh]" onClick={() => navigate("/my/archive/add")}>
            <img src={plus} alt="plus" className="w-[10vw] h-[10vw] max-w-[40px] max-h-[40px] cursor-pointer" />
          </div>
          <div onClick={() => setLocked((prev) => !prev)} className="ml-[1vw] cursor-pointer">
            {locked ? (
              <img src={lock} alt="lock" className="w-[10vw] h-[10vw] max-w-[40px] max-h-[40px]" />
            ) : (
              <img src={unlock} alt="unlock" className="w-[10vw] h-[10vw] max-w-[40px] max-h-[40px]" />
            )}
          </div>
        </div>
        {isLoading ? (
          <AlbumGridSkeleton />
        ) : (
          <AlbumGrid 
            items={(albums || []).map(album => ({
              image: album.imageUrl,
              title: album.name,
              externalUrl: album.externalUrl,
              albumId: album.albumId?.toString()
            }))}
            selectedAlbums={selectedAlbums}
            onAlbumSelect={handleAlbumSelect}
            onLongPress={handleLongPress}
            isSelectionMode={isSelectionMode}
          />
        )}
      </div>

      {/* 액션바 */}
      {showActionBar && (
        <ActionBar
          isVisible={showActionBar}
          onAddToFolder={() => {}} // 앨범은 폴더 기능 없음
          onDelete={handleDeleteClick}
          onCancel={handleCancelSelection}
          showFolderIcon={false}
        />
      )}

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemType="앨범"
        itemCount={selectedAlbums.length}
      />

      {/* 토스트 메시지 */}
      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}