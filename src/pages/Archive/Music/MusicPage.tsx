import MusicGrid from "./MusicGrid";
import MusicGridSkeleton from "./MusicGridSkeleton";
import MusicList from "./MusicList";
import MusicListSkeleton from "./MusicListSkeleton";
import SectionDivider from "@/pages/My/_components/SectionDivider";
import { useNavigate } from "react-router-dom";
import plus from "@/assets/icons/archive/plus.svg";
import folder from "@/assets/icons/archive/folder1.svg";
import folder_plus from "@/assets/icons/archive/folderplus.svg";
import lock from "@/assets/icons/archive/lock.svg";
import unlock from "@/assets/icons/archive/unlock.svg";
import { useSimilarTracks } from "@/features/archive/hooks/useSimilarTracks";
import { useArchivedTracks } from "@/features/archive/hooks/useArchivedTracks";
import { useFolderLogic } from "@/features/archive/hooks/useFolderLogic";
import { useTrackFolders } from "@/features/archive/hooks/useTrackFolders";
import { useTracksInFolder } from "@/features/archive/hooks/useTracksInFolder";
import { useCreateFolder } from "@/features/archive/hooks/useCreateFolder";
import { useAddTracksToFolder } from "@/features/archive/hooks/useAddTracksToFolder";
import { useDeleteTrack } from "@/features/archive/hooks/useDeleteTrack";
import { useFolderTrackCounts } from "@/features/archive/hooks/useFolderTrackCounts";
import ColoredFolder from "./_components/ColoredFolder";
import AddFolderModal from "./_components/AddFolderModal";
import ActionBar from "../_components/ActionBar";
import SelectFolderModal from "./_components/SelectFolderModal";
import Toast from "@/shared/ui/atoms/Toast";
import { ErrorState, EmptyState } from "../_components/StatusComponents";
import DeleteConfirmModal from "../_components/DeleteConfirmModal";

export default function Music() {
  const navigate = useNavigate();
  
  // 기본 데이터 훅들
  const { tracks, isLoading, error } = useSimilarTracks();
  const { tracks: archivedTracks, isLoading: archivedTracksLoading, error: archivedTracksError } = useArchivedTracks();
  
  // 폴더 로직 훅 사용
  const folderLogic = useFolderLogic({
    useFolders: useTrackFolders,
    useItemsInFolder: useTracksInFolder,
    useCreateFolder: useCreateFolder,
    useAddItemsToFolder: useAddTracksToFolder,
    useDeleteItem: useDeleteTrack,
    useItemCounts: useFolderTrackCounts,
    archivedItems: archivedTracks || [],
    archivedItemsLoading: archivedTracksLoading,
    archivedItemsError: archivedTracksError,
    similarItemsLoading: isLoading,
    similarItemsError: error,
    itemType: "음악",
  });

  // 에러 처리
  if (error || archivedTracksError) {
    return <ErrorState message={error || archivedTracksError || "알 수 없는 오류가 발생했습니다."} />;
  }

  return (
    <>
      <div className="flex items-center justify-end mt-[1.6vh] mb-[0.5vh]" onClick={() => navigate("/my/archive/add")}>
        <img src={plus} alt="plus" className="w-[12vw] h-[12vw] cursor-pointer max-w-[48px] max-h-[48px]" />
      </div>
      <span className="text-[#CACACA] text-hakgyo-b-17 flex">
        나와 비슷한 사용자가 많이 저장한 곡
      </span>
      <div className="mt-[2vh]">
        {isLoading ? (
          <MusicGridSkeleton />
        ) : (
          <MusicGrid items={(tracks || []).map(track => ({
            image: track.imageUrl,
            title: track.title,
            subtitle: track.artist
          }))} />
        )}
      </div>
      <SectionDivider />
      <div className="flex items-center justify-between mt-[2vh] mb-[2vh] w-full">
        <div className="flex items-center gap-[8px] text-[#FFFFFF]">
          <div
            className="flex items-center cursor-pointer"
            onClick={folderLogic.handleAllClick}
          >
            <span className={`text-ibm-sb-16 p-[8px] ${folderLogic.activeFilter === "전체" ? "text-white" : "text-[#959595]"}`}>전체</span>
          </div>
          
          {/* 동적 폴더 렌더링 */}
          {folderLogic.foldersLoading ? (
            <div className="cursor-pointer">
              <img src={folder} alt="folder" className="w-[10vw] h-[10vw] max-w-[40px] max-h-[40px] grayscale brightness-75" style={{ filter: "grayscale(1) brightness(0.6)", opacity: 0.7 }} />
            </div>
          ) : (
            folderLogic.limitedFolders.map((folderItem, index) => (
              <ColoredFolder
                key={folderItem.folderId}
                color={folderItem.color}
                folderIndex={index + 1}
                onClick={() => folderLogic.handleFolderClick(folderItem.folderId)}
                className={folderLogic.activeFilter === `폴더${folderItem.folderId}` ? "" : "opacity-70"}
              />
            ))
          )}
          
          <div
            className="cursor-pointer"
            onClick={folderLogic.handleFolderPlusClick}
          >
            <img src={folder_plus} alt="folder_plus" className="w-[10vw] h-[10vw] max-w-[40px] max-h-[40px]" />
          </div>
        </div>
        {folderLogic.locked ? (
          <img src={lock} alt="lock" className="w-[10vw] h-[10vw] cursor-pointer max-w-[40px] max-h-[40px]" onClick={() => folderLogic.setLocked(false)} />
        ) : (
          <img src={unlock} alt="unlock" className="w-[10vw] h-[10vw] cursor-pointer max-w-[40px] max-h-[40px]" onClick={() => folderLogic.setLocked(true)} />
        )}
      </div>
      
      {folderLogic.currentLoading ? (
        <MusicListSkeleton />
      ) : folderLogic.currentItems.length === 0 ? (
        <EmptyState message={folderLogic.activeFilter === "전체" ? "저장된 곡이 없습니다." : "이 폴더에 곡이 없습니다."} />
      ) : (
        <MusicList 
          items={folderLogic.currentItems.map(track => ({
            trackId: track.trackId,
            image: track.imageUrl,
            title: track.title,
            subtitle: track.artist
          }))}
          selectedTracks={folderLogic.selectedItems}
          onTrackSelect={folderLogic.handleItemSelect}
          onLongPress={folderLogic.handleLongPress}
          isSelectionMode={folderLogic.isSelectionMode}
        />
      )}

      {/* 폴더 추가 모달 */}
      <AddFolderModal
        isOpen={folderLogic.isAddFolderModalOpen}
        onClose={folderLogic.closeAddFolderModal}
        onAdd={folderLogic.handleAddFolder}
        currentFolderCount={folderLogic.folders.length}
      />

      {/* 폴더 선택 모달 */}
      <SelectFolderModal
        isOpen={folderLogic.isSelectFolderModalOpen}
        onClose={folderLogic.handleCloseSelectFolderModal}
        onSelectFolder={folderLogic.handleSelectFolder}
        folders={folderLogic.folders}
        trackCounts={folderLogic.itemCounts}
      />

      {/* 액션 바 */}
      <ActionBar
        isVisible={folderLogic.showActionBar}
        onAddToFolder={folderLogic.handleAddToFolder}
        onDelete={folderLogic.handleDeleteClick}
        onCancel={folderLogic.handleCancelSelection}
      />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={folderLogic.isDeleteModalOpen}
        onClose={folderLogic.handleDeleteCancel}
        onConfirm={folderLogic.handleDeleteConfirm}
        itemType={folderLogic.itemType}
        itemCount={folderLogic.selectedItems.length}
      />

      {/* 토스트 메시지 */}
      <Toast message={folderLogic.toast.message} visible={folderLogic.toast.visible} />
    </>
  );
}