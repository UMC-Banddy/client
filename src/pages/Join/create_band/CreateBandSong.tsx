import { useState, useRef, useEffect } from "react";
import SearchField from "../_components/SearchField";
import plusIcon from "@/assets/icons/join/ic_plus_btn.svg";
import checkIcon from "@/assets/icons/join/ic_check_transparent.svg";
import deleteIcon from "@/assets/icons/join/ic_delete.svg";
import dummyImage from "@/assets/images/home-album1.svg";
import playIcon from "@/assets/icons/join/ic_play.svg";
import { API } from "@/api/API";
import JoinHeader from "../_components/JoinHeader";
import { useNavigate } from "react-router-dom";

export type Track = {
  spotifyId: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  imageUrl: string;
  externalUrl: string;
};

const CreateBandSong: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Track[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await API.get("/api/music/search/tracks", {
          params: { q: searchTerm, limit: 10, offset: 0 },
        });
        if (data.isSuccess) setSearchResults(data.result);
        else setSearchResults([]);
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  const toggleSong = (track: Track) => {
    setSelectedSongs((prev) => {
      const exists = prev.some((t) => t.spotifyId === track.spotifyId);
      if (exists) {
        return prev.filter((t) => t.spotifyId !== track.spotifyId);
      }
      return [...prev, track];
    });
  };

  return (
    <main className="relative min-h-screen w-[393px] mx-auto px-[16px] pt-[16px] pb-[200px]">
      <JoinHeader
        enableConfirmBtn={selectedSongs.length > 0}
        onClick={() => navigate("/join/create-band")}
      />

      <section className="px-[8px]">
        <section className="flex flex-col gap-[28px] mb-[28px]">
          <p className="text-hakgyo-b-24 text-[#E9E9E9]">목표하는 곡</p>
          {selectedSongs.length > 0 && (
            <>
              <div className="flex gap-[20px] overflow-x-auto">
                {selectedSongs.map((track) => (
                  <div
                    key={track.spotifyId}
                    className="flex flex-col gap-[4px] flex-shrink-0"
                  >
                    <div
                      className="relative w-[50px] h-[50px] bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${track.imageUrl || dummyImage})`,
                      }}
                    >
                      <button
                        className="absolute -top-1 -right-1 w-[19px] h-[19px] rounded-full bg-[#121212] flex items-center justify-center"
                        onClick={() => toggleSong(track)}
                      >
                        <img src={deleteIcon} alt="Remove" />
                      </button>
                    </div>
                    <p className="w-[50px] text-hakgyo-r-16 text-white text-center line-clamp-1">
                      {track.title}
                    </p>
                  </div>
                ))}
              </div>
              <div className="w-full h-[0.5px] bg-[#E9E9E9]" />
            </>
          )}
        </section>

        <section className="mb-[32px]">
          <SearchField
            placeholder="곡 검색하기"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <p className="mt-[20px] text-wanted-sb-12 text-[#959595]">
            Shoegaze 장르의 Ride의 곡은 어때요?
          </p>
        </section>

        <div className="flex flex-col gap-[16px]">
          {searchResults.length > 0 ? (
            searchResults.map((track) => (
              <div
                key={track.spotifyId}
                className="flex justify-between items-center gap-[16px]"
              >
                <div className="flex gap-[15px] items-center">
                  <div className="relative w-[55px] h-[55px] rounded bg-[#CACACA] overflow-hidden">
                    <img
                      src={track.imageUrl || dummyImage}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/35" />
                    <img
                      src={playIcon}
                      alt="Play"
                      className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[26px] h-[26px]"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-[2px]">
                    <p className="text-hakgyo-r-16 text-white">{track.title}</p>
                    <p className="text-hakgyo-r-16 text-[#CACACA]">
                      {track.artist}
                    </p>
                  </div>
                </div>
                <button onClick={() => toggleSong(track)}>
                  <img
                    src={
                      selectedSongs.some((t) => t.spotifyId === track.spotifyId)
                        ? checkIcon
                        : plusIcon
                    }
                    alt={
                      selectedSongs.some((t) => t.spotifyId === track.spotifyId)
                        ? "Selected"
                        : "Select"
                    }
                    className="w-[31px] h-[31px]"
                  />
                </button>
              </div>
            ))
          ) : (
            <p className="text-hakgyo-r-14 text-[#959595]">
              {searchTerm ? "곡을 찾을 수 없습니다." : "검색어를 입력해주세요."}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default CreateBandSong;
