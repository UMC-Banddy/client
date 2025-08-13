import { useState, useRef } from "react";
import SearchBar from "./Music/_components/SearchBar";
import SuggestionList from "./Music/_components/SuggestionList";
import SuggestionListSkeleton from "./Music/_components/SuggestionListSkeleton";
import SongList from "./Music/_components/SongList";
import SongListSkeleton from "./Music/_components/SongListSkeleton";
import Search from "@/assets/icons/archive/search.svg";
import Cancel from "@/assets/icons/archive/cancel.svg";
import { useAutocomplete } from "@/features/archive/hooks/useAutocomplete";
import { useSearch } from "@/features/archive/hooks/useSearch";
import { useSaveItem } from "@/features/archive/hooks/useSaveItem";
import { useArtistQuestion } from "@/features/archive/hooks/useArtistQuestion";
import { useSearchTracks } from "@/features/archive/hooks/useSearchTracks";
import useDebounce from "@/features/archive/hooks/useDebounce";
import { type Song } from "@/types/song";

interface RecommendedUser {
  name: string;
  favoriteArtist: string;
  recommendedSongs: Song[];
}

interface AddPageProps {
  recommendedUser?: RecommendedUser;
  defaultRecommendedSongs?: Song[];
}

export default function AddPage({ 
  recommendedUser,
  defaultRecommendedSongs 
}: AddPageProps) {
  const [search, setSearch] = useState("");
  
  // API 연동
  const { data: artistQuestionData, isLoading: artistQuestionLoading } = useArtistQuestion();
  const { data: recommendedTracksData, isLoading: recommendedTracksLoading } = useSearchTracks({
    q: artistQuestionData?.result?.artistName || "",
    limit: 3,
    offset: 0
  });
  
  // API 데이터로 추천 유저 정보 구성
  const apiRecommendedUser: RecommendedUser = {
    name: artistQuestionData?.result?.memberNickname || "사용자",
    favoriteArtist: artistQuestionData?.result?.artistName || "아티스트",
    recommendedSongs: recommendedTracksData?.result?.map(track => ({
      image: track.imageUrl,
      title: track.title,
      artist: track.artist,
      spotifyId: track.spotifyId,
      type: "track" as const
    })) || []
  };
  
  // 실제 사용할 추천 유저 데이터 (API 데이터 우선, props로 전달된 데이터는 fallback)
  const finalRecommendedUser = apiRecommendedUser.recommendedSongs.length > 0 
    ? apiRecommendedUser 
    : recommendedUser;
  const [toast, setToast] = useState<{ 
    message: string; 
    visible: boolean; 
    type: "add" | "remove"; 
    songTitle?: string;
    spotifyId?: string;
    itemType?: "track" | "artist" | "album";
  }>({ message: "", visible: false, type: "add" });
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // 검색어를 300ms debounce 처리
  const debouncedSearch = useDebounce(search, 300);
  
  const { suggestions, isLoading: suggestionsLoading } = useAutocomplete(debouncedSearch);
  const { searched: searchedSongs, isLoading: searchLoading } = useSearch(debouncedSearch);
  const { saveItem, deleteItem, isSaved } = useSaveItem();

  const handleToggle = async (song: Song) => {
    if (!song.spotifyId || !song.type) return;

    const isAdded = isSaved(song.spotifyId, song.type);
    
    try {
      if (isAdded) {
        await deleteItem(song.spotifyId, song.type);
        setToast({ 
          message: "아카이브에서 삭제되었습니다.", 
          visible: true, 
          type: "remove", 
          songTitle: song.title 
        });
      } else {
        await saveItem(song.spotifyId, song.type);
        setToast({ 
          message: "아카이브에 추가되었습니다!", 
          visible: true, 
          type: "add", 
          songTitle: song.title,
          spotifyId: song.spotifyId,
          itemType: song.type
        });
      }
      
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handleToastCancel = async () => {
    if (toast.type === "add" && toast.spotifyId && toast.itemType) {
      try {
        await deleteItem(toast.spotifyId, toast.itemType);
        setToast({ 
          message: "아카이브에서 삭제되었습니다.", 
          visible: true, 
          type: "remove" 
        });
        if (toastTimeout.current) clearTimeout(toastTimeout.current);
        toastTimeout.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
      } catch (error) {
        console.log("토스트 취소 중 오류:", error);
      }
    }
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const showSongs = search ? (searchedSongs as Song[]) : (defaultRecommendedSongs || finalRecommendedUser?.recommendedSongs || []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col px-[24px]"> 
        <SearchBar
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="자주 듣는 곡을 검색해보세요."
          leftIcon={<img src={Search} alt="search" />}
          rightIcon={<img src={Cancel} alt="cancel" />}
          onRightIconClick={handleClearSearch}
        />
        {!search && (
          <div className="text-wanted-sb-12 text-[#71717A] mb-[1.4vh] mt-[2.3vh] text-left">
            {finalRecommendedUser?.name || "사용자"} 님이 좋아하는 {finalRecommendedUser?.favoriteArtist || "아티스트"}의 곡은 어때요?
          </div>
        )}
        {search && (
          suggestionsLoading ? (
            <SuggestionListSkeleton />
          ) : (
            <SuggestionList 
              suggestions={suggestions} 
              onSuggestionClick={(suggestion) => setSearch(suggestion)}
            />
          )
        )}
        {(searchLoading || (!search && (artistQuestionLoading || recommendedTracksLoading))) ? (
          <SongListSkeleton />
        ) : (
          <SongList 
            songs={showSongs} 
            added={showSongs.map(song => song.spotifyId && song.type ? isSaved(song.spotifyId, song.type) : false)} 
            onToggle={handleToggle} 
          />
        )}
      {toast.visible && (
        <div className="fixed bottom-[14vh] left-1/2 -translate-x-1/2 bg-[#121212] text-[#FFFFFF] rounded-[10px] px-[16px] flex items-center z-50 w-[91.8vw] h-[6.5vh] max-w-[361px]">
          <span className="flex-1 text-left">{toast.message}</span>
          <div className="flex items-center justify-end">
            {toast.type === "add" && (
              <button
                className="bg-[#B42127] text-[#FFFFFF] rounded-[6px] px-[24px] py-[8px] max-w-[73px] max-h-[32px] text-wanted-sb-13 w-full h-full"
                onClick={handleToastCancel}
              >
                취소
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}