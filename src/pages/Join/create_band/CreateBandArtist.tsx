import { useState } from "react";
import SearchField from "../_components/SearchField";
import ArtistToggleBtn from "../_components/create_band/artist/ArtistToggleBtn";
import dummy from "@/assets/images/home-album1.svg";
import deleteIcon from "@/assets/icons/join/ic_delete.svg";

const artists = [
  {
    id: 0,
    thumbnail: dummy,
    name: "검정치마",
  },
  {
    id: 1,
    thumbnail: "",
    name: "Placebo",
  },
  {
    id: 2,
    thumbnail: "",
    name: "Meow",
  },
  {
    id: 3,
    thumbnail: "",
    name: "BECK",
  },
  {
    id: 4,
    thumbnail: "",
    name: "Tyler, the creator",
  },
  {
    id: 5,
    thumbnail: "",
    name: "Oasis",
  },
  {
    id: 6,
    thumbnail: "",
    name: "Steve Lacy",
  },
  {
    id: 7,
    thumbnail: "",
    name: "Blur",
  },
  {
    id: 8,
    thumbnail: "",
    name: "쏜애플",
  },
];

const CreateBandArtist = () => {
  const [toggledArtist, setToggledArtist] = useState<number[]>([]);
  return (
    <main className="relative min-h-screen w-[393px] mx-auto bg-[#121212]/90 px-[24px] pt-[16px] pb-[200px]">
      <section className="flex flex-col gap-[28px] mb-[28px] ">
        <p className="text-hakgyo-b-24 text-[#E9E9E9]">추구하는 장르</p>
        {toggledArtist.length > 0 && (
          <div className="flex flex-nowrap gap-[12px] overflow-x-auto">
            {toggledArtist.map((artist) => (
              <div className="flex flex-shrink-0 flex-col items-center gap-[4px]">
                <div
                  className="relative size-[50px] bg-[#959595] bg-cover bg-no-repeat rounded-full"
                  style={{
                    backgroundImage: `url(${artists[artist].thumbnail})`,
                  }}
                >
                  <div>
                    <button
                      className="flex items-center justify-center absolute top-[-2px] right-[-4px] size-[19px] rounded-full bg-[#121212] cursor-pointer z-20"
                      onClick={() =>
                        setToggledArtist((prev) =>
                          prev.filter((id) => id !== artist)
                        )
                      }
                    >
                      <img src={deleteIcon} alt="" />
                    </button>
                  </div>
                </div>
                <p className="w-[55px] text-hakgyo-r-14 text-[#fff] text-center overflow-ellipsis line-clamp-1">
                  {artists[artist].name}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="h-[0.5px] bg-[#E9E9E9]"></div>
      </section>

      <SearchField placeholder="아티스트 검색하기" />

      <section className="grid grid-cols-3 gap-x-[12px] gap-y-[43px] mt-[32px]">
        {artists.map((artist) => (
          <ArtistToggleBtn
            key={artist.id}
            thumbnail={artist.thumbnail}
            onClick={() => {
              if (toggledArtist.includes(artist.id)) {
                setToggledArtist(
                  toggledArtist.filter((id) => id !== artist.id)
                );
              } else {
                setToggledArtist([...toggledArtist, artist.id]);
              }
            }}
            toggled={toggledArtist.includes(artist.id)}
          >
            {artist.name}
          </ArtistToggleBtn>
        ))}
      </section>
    </main>
  );
};

export default CreateBandArtist;
