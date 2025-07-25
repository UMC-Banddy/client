import guitarActivated from "@/assets/icons/join/ic_guitar_activated.svg";
import moodHeart from "@/assets/icons/join/ic_mood_heart.svg";
import BandThumbnail from "../_components/saved_band/BandThumbnail";
import SelectWithArrow from "../_components/create_band/SelectWithArrow";

const SavedBand = () => {
  return (
    <main className="relative min-h-screen w-[393px] mx-auto px-[24px] pt-[12px] bg-[#121212]/90">
      <div className="flex justify-end w-full mb-[24px]">
        <button className="p-[0] bg-transparent border-none cursor-pointer">
          <img src={guitarActivated} alt="" className="size-[48px]" />
        </button>
        <button className="p-[0] bg-transparent border-none cursor-pointer">
          <img src={moodHeart} alt="" className="size-[48px]" />
        </button>
      </div>

      <SelectWithArrow value="전체" onChange={() => {}} options={["전체"]} />

      <section className="grid grid-cols-2 gap-x-[13px] gap-y-[24px] mt-[36px]">
        <BandThumbnail isRecruiting={false} />
        <BandThumbnail isRecruiting={true} />
        <BandThumbnail isRecruiting={false} />
        <BandThumbnail isRecruiting={true} />
      </section>
    </main>
  );
};

export default SavedBand;
