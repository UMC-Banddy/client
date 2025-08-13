import ArtistGrid from "./ArtistGrid";
import ArtistGridSkeleton from "./ArtistGridSkeleton";
import ArtistList from "./ArtistList";
import ArtistListSkeleton from "./ArtistListSkeleton";
import SectionDivider from "@/pages/My/_components/SectionDivider";
import { useNavigate } from "react-router-dom";
import plus from "@/assets/icons/archive/plus.svg";
import folder from "@/assets/icons/archive/folder1.svg";
import folder_plus from "@/assets/icons/archive/folderplus.svg";
import lock from "@/assets/icons/archive/lock.svg";
import unlock from "@/assets/icons/archive/unlock.svg";
import { useSimilarArtists } from "@/features/archive/hooks/useSimilarArtists";
import { useArchivedArtists } from "@/features/archive/hooks/useArchivedArtists";
import { useFolderLogic } from "@/features/archive/hooks/useFolderLogic";
import { useArtistFolders } from "@/features/archive/hooks/useArtistFolders";
import { useArtistsInFolder } from "@/features/archive/hooks/useArtistsInFolder";
import { useCreateArtistFolder } from "@/features/archive/hooks/useCreateArtistFolder";
import { useAddArtistsToFolder } from "@/features/archive/hooks/useAddArtistsToFolder";
import { useDeleteArtist } from "@/features/archive/hooks/useDeleteArtist";
import { useArtistFolderCounts } from "@/features/archive/hooks/useArtistFolderCounts";
import ColoredFolder from "../Music/_components/ColoredFolder";
import AddFolderModal from "../Music/_components/AddFolderModal";
import SelectFolderModal from "../Music/_components/SelectFolderModal";
import ActionBar from "../_components/ActionBar";
import Toast from "@/shared/ui/atoms/Toast";
import { ErrorState, EmptyState } from "../_components/StatusComponents";
import DeleteConfirmModal from "../_components/DeleteConfirmModal";

export default function ArtistPage() {
  const navigate = useNavigate();
  
  // 기본 데이터 훅들
  const { artists, isLoading, error } = useSimilarArtists();
  const { artists: archivedArtists, isLoading: archivedArtistsLoading, error: archivedArtistsError } = useArchivedArtists();
  
  // 폴더 로직 훅 사용
  const folderLogic = useFolderLogic({
    useFolders: useArtistFolders,
    useItemsInFolder: useArtistsInFolder,
    useCreateFolder: useCreateArtistFolder,
    useAddItemsToFolder: useAddArtistsToFolder,
    useDeleteItem: useDeleteArtist,
    useItemCounts: useArtistFolderCounts,
    archivedItems: archivedArtists || [],
    archivedItemsLoading: archivedArtistsLoading,
    archivedItemsError: archivedArtistsError,
    similarItemsLoading: isLoading,
    similarItemsError: error,
    itemType: "아티스트",
  });

  // 에러 처리
  if (error || archivedArtistsError) {
    return <ErrorState message={error || archivedArtistsError || "알 수 없는 오류가 발생했습니다."} />;
  }

  return (
    <>
      <div className="flex items-center justify-end mt-[1.6vh] mb-[0.5vh]" onClick={() => navigate("/my/archive/add")}>
        <img src={plus} alt="plus" className="w-[12vw] h-[12vw] cursor-pointer max-w-[48px] max-h-[48px]" />
      </div>
      <span className="text-[#CACACA] text-hakgyo-b-17 flex mb-[4.7vh]">
        나와 비슷한 사용자가 많이 저장한 아티스트
      </span>
      {isLoading ? (
        <ArtistGridSkeleton />
      ) : (
        <ArtistGrid items={(artists || []).map(artist => ({
          image: artist.imageUrl,
          title: artist.name
        }))} />
      )}
      <div className="pr-[24px]">
        <SectionDivider />
        <div className="flex items-center justify-between mt-[2vh] mb-[2.8vh] w-full">
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
          <ArtistListSkeleton />
        ) : folderLogic.currentItems.length === 0 ? (
          <EmptyState message={folderLogic.activeFilter === "전체" ? "저장된 아티스트가 없습니다." : "이 폴더에 아티스트가 없습니다."} />
        ) : (
          <ArtistList 
            items={folderLogic.currentItems.map(artist => ({
              artistId: artist.artistId,
              image: artist.imageUrl,
              title: artist.name,
              externalUrl: artist.externalUrl
            }))}
            selectedArtists={folderLogic.selectedItems}
            onArtistSelect={folderLogic.handleItemSelect}
            onLongPress={folderLogic.handleLongPress}
            isSelectionMode={folderLogic.isSelectionMode}
          />
        )}
      </div>

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