import { useState, useRef } from "react";
import SearchBar from "./Music/_components/SearchBar";
import SuggestionList from "./Music/_components/SuggestionList";
import SongList from "./Music/_components/SongList";
import Search from "@/assets/icons/archive/search.svg";
import Cancel from "@/assets/icons/archive/cancel.svg";

interface Song {
  image: string;
  title: string;
  artist: string;
}

interface RecommendedUser {
  name: string;
  favoriteArtist: string;
  recommendedSongs: Song[];
}

interface AddPageProps {
  recommendedUser?: RecommendedUser;
  defaultRecommendedSongs?: Song[];
}

const defaultRecommendedUser: RecommendedUser = {
  name: "붉은사슴뿔버섯",
  favoriteArtist: "The cabs",
  recommendedSongs: [
    { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", title: "二月の兵隊", artist: "The cabs" },
    { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", title: "No future for us", artist: "The cabs" },
    { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", title: "兵隊", artist: "The cabs" },
  ]
};

const searchedSongs = [
  { image: "https://mblogthumb-phinf.pstatic.net/20160405_13/syj953_1459826431623RjriH_JPEG/Keitaidenwa.jpg?type=w420", title: "Hyperventilation", artist: "Radwimps" },
  { image: "https://image.bugsm.co.kr/album/images/500/40780/4078016.jpg", title: "hypeboy", artist: "New jeans" },
  { image: "https://i.scdn.co/image/ab67616d0000b273885ce9079556b4aef55ea719", title: "Hypernova", artist: "m–flo, Maya" },
];

const mockSuggestions = ["Hyperventilation", "Hype boy", "Hyperpop"];

export default function AddPage({ 
  recommendedUser = defaultRecommendedUser,
  defaultRecommendedSongs 
}: AddPageProps) {
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean; type: "add" | "remove"; songTitle?: string }>({ message: "", visible: false, type: "add" });
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);

  const filteredSuggestions = mockSuggestions.filter(s =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSongs = searchedSongs.filter(
    song =>
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (title: string) => {
    setAdded(prev => {
      const isAdded = prev.includes(title);
      if (isAdded) {
        setToast({ message: "아카이브에서 삭제되었습니다.", visible: true, type: "remove", songTitle: title });
      } else {
        setToast({ message: "아카이브에 추가되었습니다!", visible: true, type: "add", songTitle: title });
      }
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
      // 실제 추가/제거
      return isAdded ? prev.filter(t => t !== title) : [...prev, title];
    });
  };

  const handleToastCancel = () => {
    if (toast.type === "add" && toast.songTitle) {
      setAdded(prev => prev.filter(t => t !== toast.songTitle));
      setToast({ message: "아카이브에서 삭제되었습니다.", visible: true, type: "remove" });
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const showSongs = search ? filteredSongs : (defaultRecommendedSongs || recommendedUser.recommendedSongs);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col px-[6vw]"> 
        <SearchBar
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="자주 듣는 곡을 검색해보세요."
          leftIcon={<img src={Search} alt="search" className="w-[6vw] h-[6vw]" />}
          rightIcon={<img src={Cancel} alt="cancel" className="w-[10vw] h-[10vw]" />}
          onRightIconClick={handleClearSearch}
          className="mt-[2vh]"
        />
        {!search && (
          <div className="text-wanted-sb-12 text-[#71717A] mb-[1.4vh] mt-[2.3vh] text-left">
            {recommendedUser.name} 님이 좋아하는 {recommendedUser.favoriteArtist}의 곡은 어때요?
          </div>
        )}
        {search && (
          <SuggestionList suggestions={filteredSuggestions} />
        )}
        <SongList songs={showSongs} added={added} onToggle={handleToggle} />
      {toast.visible && (
        <div className="fixed bottom-[14vh] left-1/2 -translate-x-1/2 bg-[#121212] text-[#FFFFFF] rounded-[10px] px-[4vw] flex items-center z-50 w-[91.8vw] h-[6.5vh]">
          <span className="flex-1 text-left">{toast.message}</span>
          <div className="w-[18vw] h-[4vh] flex items-center justify-center">
            {toast.type === "add" && (
              <button
                className="bg-[#B42127] text-[#FFFFFF] rounded-[6px] px-[6vw] py-[1vh] text-wanted-sb-13 w-full h-full"
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