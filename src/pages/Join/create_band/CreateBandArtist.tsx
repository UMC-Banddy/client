import { useEffect, useState, useRef } from "react";
import SearchField from "../_components/SearchField";
import ArtistToggleBtn from "../_components/create_band/artist/ArtistToggleBtn";
import dummy from "@/assets/images/home-album1.svg";
import deleteIcon from "@/assets/icons/join/ic_delete.svg";
import { API } from "@/api/API";
import JoinHeader from "../_components/JoinHeader";
import { useNavigate } from "react-router-dom";

type Artist = {
  spotifyId: string;
  name: string;
  genres: string;
  imageUrl: string;
  externalUrl: string;
};

const CreateBandArtist: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Artist[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
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
        const { data } = await API.get("/api/music/search/artists", {
          params: { q: searchTerm, limit: 12, offset: 0 },
        });
        if (data.isSuccess) {
          setSearchResults(data.result);
        } else {
          console.error("Search failed:", data.message);
          setSearchResults([]);
        }
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  const toggleArtist = (artist: Artist) => {
    setSelectedArtists((prev) => {
      const exists = prev.some((a) => a.spotifyId === artist.spotifyId);
      if (exists) {
        return prev.filter((a) => a.spotifyId !== artist.spotifyId);
      } else {
        return [...prev, artist];
      }
    });
  };

  return (
    <main className="relative min-h-screen w-[393px] mx-auto px-[16px] pt-[16px] pb-[200px]">
      <JoinHeader
        enableConfirmBtn={selectedArtists.length > 0}
        onClick={() => navigate("/join/create-band")}
      />

      <section className="px-[8px]">
        <section className="flex flex-col gap-[28px] mb-[28px]">
          <p className="text-hakgyo-b-24 text-[#E9E9E9]">대표하는 아티스트</p>
          {selectedArtists.length > 0 && (
            <>
              <section className="flex flex-nowrap gap-[12px] overflow-x-auto">
                {selectedArtists.map((artist) => (
                  <div
                    key={artist.spotifyId}
                    className="flex flex-col items-center gap-[4px] flex-shrink-0"
                  >
                    <div
                      className="relative w-[50px] h-[50px] rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${artist.imageUrl || dummy})`,
                      }}
                    >
                      <button
                        className="absolute -top-1 -right-1 w-[19px] h-[19px] rounded-full bg-[#121212] flex items-center justify-center"
                        onClick={() => toggleArtist(artist)}
                      >
                        <img src={deleteIcon} alt="Remove" />
                      </button>
                    </div>
                    <p className="w-[55px] text-hakgyo-r-14 text-white text-center line-clamp-1">
                      {artist.name}
                    </p>
                  </div>
                ))}
              </section>
              <div className="w-full h-[0.5px] bg-[#E9E9E9]"></div>
            </>
          )}
        </section>

        <SearchField
          placeholder="아티스트 검색하기"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchResults.length > 0 ? (
          <section className="grid grid-cols-3 gap-x-[12px] gap-y-[43px] mt-[32px]">
            {searchResults.map((artist) => (
              <ArtistToggleBtn
                key={artist.spotifyId}
                thumbnail={artist.imageUrl || dummy}
                toggled={selectedArtists.some(
                  (a) => a.spotifyId === artist.spotifyId
                )}
                onClick={() => toggleArtist(artist)}
              >
                {artist.name}
              </ArtistToggleBtn>
            ))}
          </section>
        ) : (
          <p className="mt-[32px] text-hakgyo-r-14 text-[#959595]">
            {searchTerm
              ? "아티스트를 찾을 수 없습니다."
              : "아티스트를 검색해주세요."}
          </p>
        )}
      </section>
    </main>
  );
};

export default CreateBandArtist;
