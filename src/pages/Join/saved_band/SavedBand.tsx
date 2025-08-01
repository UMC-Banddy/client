import guitarActivated from "@/assets/icons/join/ic_guitar_activated.svg";
import moodHeart from "@/assets/icons/join/ic_mood_heart.svg";
import BandThumbnail from "../_components/saved_band/BandThumbnail";
import { API } from "@/api/API";
import { useEffect, useState } from "react";
import ToggleBtn from "../_components/ToggleBtn";

const SavedBand = () => {
  const [showOnlyRecruiting, setShowOnlyRecruiting] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await API.get("/api/bands/bookmarks");
      console.log(data);
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
        <button className="p-[0] bg-transparent border-none cursor-pointer">
          <img src={guitarActivated} alt="" className="size-[48px]" />
        </button>
        <button className="p-[0] bg-transparent border-none cursor-pointer">
          <img src={moodHeart} alt="" className="size-[48px]" />
        </button>
      </div>

      <ToggleBtn toggle={showOnlyRecruiting} setToggle={setShowOnlyRecruiting}>
        모집중만 표시
      </ToggleBtn>

      <section className="grid grid-cols-2 gap-x-[13px] gap-y-[24px] mt-[36px]">
        {showOnlyRecruiting ? (
          <>
            <BandThumbnail isRecruiting={true} />
            <BandThumbnail isRecruiting={true} />
          </>
        ) : (
          <>
            <BandThumbnail isRecruiting={false} />
            <BandThumbnail isRecruiting={true} />
            <BandThumbnail isRecruiting={false} />
            <BandThumbnail isRecruiting={true} />
          </>
        )}
      </section>
    </main>
  );
};

export default SavedBand;
