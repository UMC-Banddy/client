import guitarActivated from "@/assets/icons/join/ic_guitar_activated.svg";
// import moodHeart from "@/assets/icons/join/ic_mood_heart.svg";
import BandThumbnail from "../_components/saved_band/BandThumbnail";
import { API } from "@/api/API";
import { useEffect, useState } from "react";
import ToggleBtn from "../_components/ToggleBtn";
import { useNavigate } from "react-router-dom";

interface Band {
  bandId: number;
  imageUrl: string | null;
  name: string;
  soundOn: boolean;
  status: "RECRUITING" | "CLOSED";
  memberSummary: string;
  memberCount: number;
  soundUrl: string;
}

const SavedBand = () => {
  const [bands, setBands] = useState<Band[]>([]);
  const [showOnlyRecruiting, setShowOnlyRecruiting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await API.get("/api/bands/bookmarks");
      setBands(data);
    };

    try {
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, []);
  return (
    <main className="relative min-h-screen w-[393px] mx-auto px-[24px] pt-[12px]">
      <div className="flex justify-end w-full mb-[24px]">
        <button
          className="p-[0] bg-transparent border-none cursor-pointer"
          onClick={() => {
            navigate("/join");
          }}
        >
          <img src={guitarActivated} alt="" className="size-[48px]" />
        </button>
        {/* <button className="p-[0] bg-transparent border-none cursor-pointer">
          <img src={moodHeart} alt="" className="size-[48px]" />
        </button> */}
      </div>

      <ToggleBtn toggle={showOnlyRecruiting} setToggle={setShowOnlyRecruiting}>
        모집중만 표시
      </ToggleBtn>

      <section className="grid grid-cols-2 gap-x-[13px] gap-y-[24px] mt-[36px]">
        {bands
          .filter((band) => band.status === "RECRUITING" || !showOnlyRecruiting)
          .map((band) => (
            <BandThumbnail
              key={band.bandId}
              bandId={band.bandId}
              isRecruiting={band.status === "RECRUITING"}
              name={band.name}
              thumbnail={band.imageUrl}
              memberSummary={band.memberSummary}
              memberCount={band.memberCount}
              soundUrl={band.soundUrl}
            />
          ))}
      </section>
    </main>
  );
};

export default SavedBand;
