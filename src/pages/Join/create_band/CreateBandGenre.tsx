import GenreToggleBtn from "../_components/create_band/genre/GenreToggleBtn";
import GenreStatusBtn from "../_components/create_band/genre/GenreStatusBtn";
import { genres } from "../_constants/genres";
import { createBandStore, createBandActions } from "@/store/createBandStore";
import { useSnapshot } from "valtio";
import JoinHeader from "../_components/JoinHeader";
import { useNavigate } from "react-router-dom";

const CreateBandGenre = () => {
  const { genres: toggledGenre } = useSnapshot(createBandStore);
  const navigate = useNavigate();

  const handleToggle = (text: string) => {
    const newToggled = toggledGenre.includes(text)
      ? toggledGenre.filter((g) => g !== text)
      : [...toggledGenre, text];
    createBandActions.setGenres(newToggled);
  };

  return (
    <main className="relative min-h-screen w-[393px] mx-auto px-[16px] pt-[16px] pb-[200px]">
      <JoinHeader
        enableConfirmBtn={toggledGenre.length > 0}
        onClick={() => navigate("/join/create-band")}
      />

      <section className="px-[8px]">
        <section className="flex flex-col gap-[28px] mt-[24px]">
          <p className="text-hakgyo-b-24 text-[#E9E9E9]">추구하는 장르</p>
          {toggledGenre.length > 0 && (
            <div className="flex flex-nowrap gap-[12px] overflow-x-auto">
              {toggledGenre.map((genre) => (
                <GenreStatusBtn key={genre} onClick={() => handleToggle(genre)}>
                  {genres.find((g) => g.text === genre)?.content === "⚡"
                    ? "⚡Metal"
                    : genres.find((g) => g.text === genre)?.content}
                </GenreStatusBtn>
              ))}
            </div>
          )}
          <div className="h-[0.5px] bg-[#E9E9E9]"></div>
        </section>

        <section className="flex flex-wrap justify-center gap-[16px] mt-[44px] mx-[-12px]">
          {genres.map((genre) => (
            <GenreToggleBtn
              key={genre.id}
              toggled={toggledGenre.includes(genre.text)}
              onClick={() => handleToggle(genre.text)}
            >
              {genre.content === "⚡" ? "⚡Metal" : genre.content}
            </GenreToggleBtn>
          ))}
        </section>
      </section>
    </main>
  );
};

export default CreateBandGenre;
