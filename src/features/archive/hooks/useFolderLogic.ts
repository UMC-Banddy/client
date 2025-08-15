import { useState } from "react";
import { type TrackFolder } from "@/types/track";
import { type ArtistFolder } from "@/types/artist";

interface FolderLogicConfig<T> {
  useFolders: () => {
    folders: TrackFolder[] | ArtistFolder[];
    isLoading: boolean;
    error: string | null;
  };
  useItemsInFolder: (folderId: number | null) => {
    items?: T[];
    tracks?: T[];
    artists?: T[];
    isLoading: boolean;
    error: string | null;
  };
  useCreateFolder: () => {
    createFolder: (params: { name: string; color: string }) => void;
    toast: { message: string; visible: boolean };
  };
  useAddItemsToFolder: () => {
    addTracksToFolder?: (params: { folderId: number; trackIds: number[]; folderName?: string }) => void;
    addArtistsToFolder?: (params: { folderId: number; artistIds: number[]; folderName?: string }) => void;
    toast: { message: string; visible: boolean };
  };
  useDeleteItem: () => {
    deleteTrack?: (params: { trackId: number; folderId?: number }) => void;
    deleteArtist?: (params: { artistId: number; folderId?: number }) => void;
    toast: { message: string; visible: boolean };
  };
  useItemCounts: () => {
    trackCounts?: Record<number, number>;
    artistCounts?: Record<number, number>;
  };
  archivedItems: T[];
  archivedItemsLoading: boolean;
  archivedItemsError: string | null;
  similarItemsLoading: boolean;
  similarItemsError: string | null;
  itemType: "음악" | "아티스트" | "앨범";
}

interface FolderLogicReturn<T> {
  // 상태
  activeFilter: string;
  selectedFolderId: number | null;
  locked: boolean;
  isAddFolderModalOpen: boolean;
  isSelectFolderModalOpen: boolean;
  isSelectionMode: boolean;
  selectedItems: number[];
  showActionBar: boolean;
  isDeleteModalOpen: boolean;
  
  // 데이터
  folders: TrackFolder[] | ArtistFolder[];
  foldersLoading: boolean;
  foldersError: string | null;
  currentItems: T[];
  currentLoading: boolean;
  limitedFolders: TrackFolder[] | ArtistFolder[];
  itemCounts: Record<number, number>;
  itemType: "음악" | "아티스트" | "앨범";
  
  // 토스트
  toast: { message: string; visible: boolean };
  
  // 핸들러들
  setLocked: (locked: boolean) => void;
  handleAddFolder: (name: string, color: string) => void;
  handleFolderPlusClick: () => void;
  handleFolderClick: (folderId: number) => void;
  handleAllClick: () => void;
  handleLongPress: () => void;
  handleItemSelect: (itemId: number) => void;
  handleCancelSelection: () => void;
  handleAddToFolder: () => void;
  handleSelectFolder: (folderId: number) => void;
  handleCloseSelectFolderModal: () => void;
  handleDeleteClick: () => void;
  handleDeleteConfirm: () => void;
  handleDeleteCancel: () => void;
  closeAddFolderModal: () => void;
}

export const useFolderLogic = <T>({
  useFolders,
  useItemsInFolder,
  useCreateFolder,
  useAddItemsToFolder,
  useDeleteItem,
  useItemCounts,
  archivedItems,
  archivedItemsLoading,
  archivedItemsError,
  itemType,
}: FolderLogicConfig<T>): FolderLogicReturn<T> => {
  // 상태 관리
  const [activeFilter, setActiveFilter] = useState("전체");
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const [isSelectFolderModalOpen, setIsSelectFolderModalOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showActionBar, setShowActionBar] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 훅들 사용
  const { folders, isLoading: foldersLoading, error: foldersError } = useFolders();
  const folderItemsResult = useItemsInFolder(selectedFolderId);
  const { createFolder, toast: createFolderToast } = useCreateFolder();
  const addItemsResult = useAddItemsToFolder();
  const deleteItemResult = useDeleteItem();
  const itemCountsResult = useItemCounts();

  // 에러 체크
  const hasError = archivedItemsError || foldersError || folderItemsResult.error;
  if (hasError) {
    throw new Error(archivedItemsError || foldersError || folderItemsResult.error || "알 수 없는 오류가 발생했습니다.");
  }

  // 폴더 아이템 추출 (tracks 또는 artists)
  const folderItems = folderItemsResult.items || folderItemsResult.tracks || folderItemsResult.artists || [];
  const folderItemsLoading = folderItemsResult.isLoading;
  
  // 아이템 개수 추출
  const itemCounts = itemCountsResult.trackCounts || itemCountsResult.artistCounts || {};

  // 폴더 최대 5개로 제한
  const limitedFolders = folders.slice(0, 5);

  // 현재 표시할 아이템 목록 결정
  const getCurrentItems = (): T[] => {
    if (activeFilter === "전체") {
      return archivedItems || [];
    } else if (selectedFolderId) {
      return folderItems || [];
    }
    return archivedItems || [];
  };

  // 현재 로딩 상태 결정
  const getCurrentLoading = (): boolean => {
    if (activeFilter === "전체") {
      return archivedItemsLoading;
    } else if (selectedFolderId) {
      return folderItemsLoading;
    }
    return archivedItemsLoading;
  };

  // 핸들러들
  const handleAddFolder = (name: string, color: string) => {
    createFolder({ name, color });
  };

  const handleFolderPlusClick = () => {
    setIsAddFolderModalOpen(true);
  };

  const handleFolderClick = (folderId: number) => {
    setSelectedFolderId(folderId);
    setActiveFilter(`폴더${folderId}`);
  };

  const handleAllClick = () => {
    setSelectedFolderId(null);
    setActiveFilter("전체");
  };

  const handleLongPress = () => {
    setIsSelectionMode(true);
    setShowActionBar(true);
  };

  const handleItemSelect = (itemId: number) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setShowActionBar(false);
    setSelectedItems([]);
  };

  const handleAddToFolder = () => {
    if (selectedItems.length === 0) return;
    
    setIsSelectFolderModalOpen(true);
    setShowActionBar(false);
  };

  const handleSelectFolder = (folderId: number) => {
    const selectedFolder = folders.find(folder => folder.folderId === folderId);
    const folderName = selectedFolder?.name || "폴더";
    
    // 조건부로 적절한 함수 호출
    if (addItemsResult.addTracksToFolder) {
      addItemsResult.addTracksToFolder({ folderId, trackIds: selectedItems, folderName });
    } else if (addItemsResult.addArtistsToFolder) {
      addItemsResult.addArtistsToFolder({ folderId, artistIds: selectedItems, folderName });
    }
    setIsSelectFolderModalOpen(false);
    handleCancelSelection();
  };

  const handleCloseSelectFolderModal = () => {
    setIsSelectFolderModalOpen(false);
    setShowActionBar(true);
  };

  const handleDeleteClick = () => {
    if (selectedItems.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedItems.length === 0) return;
    
    selectedItems.forEach(itemId => {
      // 조건부로 적절한 함수 호출
      if (deleteItemResult.deleteTrack) {
        deleteItemResult.deleteTrack({ trackId: itemId, folderId: selectedFolderId || undefined });
      } else if (deleteItemResult.deleteArtist) {
        deleteItemResult.deleteArtist({ artistId: itemId, folderId: selectedFolderId || undefined });
      }
    });
    
    handleCancelSelection();
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const closeAddFolderModal = () => {
    setIsAddFolderModalOpen(false);
  };

  // 토스트 메시지 통합
  const toast = createFolderToast.visible ? createFolderToast : 
                addItemsResult.toast.visible ? addItemsResult.toast : 
                deleteItemResult.toast.visible ? deleteItemResult.toast : 
                { message: "", visible: false };

  return {
    // 상태
    activeFilter,
    selectedFolderId,
    locked,
    isAddFolderModalOpen,
    isSelectFolderModalOpen,
    isSelectionMode,
    selectedItems,
    showActionBar,
    isDeleteModalOpen,
    
    // 데이터
    folders,
    foldersLoading,
    foldersError,
    currentItems: getCurrentItems(),
    currentLoading: getCurrentLoading(),
    limitedFolders,
    itemCounts,
    itemType,
    
    // 토스트
    toast,
    
    // 핸들러들
    setLocked,
    handleAddFolder,
    handleFolderPlusClick,
    handleFolderClick,
    handleAllClick,
    handleLongPress,
    handleItemSelect,
    handleCancelSelection,
    handleAddToFolder,
    handleSelectFolder,
    handleCloseSelectFolderModal,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    closeAddFolderModal,
  };
};
