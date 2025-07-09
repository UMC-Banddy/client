import downArrow from "@/assets/icons/join/ic_down_arrow.svg";
import guitar from "@/assets/icons/join/ic_guitar.svg";
import moodHeart from "@/assets/icons/join/ic_mood_heart.svg";
import NormalChat from "./_components/chat/NormalChat";
import BandChat from "./_components/chat/BandChat";
import plus from "@/assets/icons/join/ic_plus.svg";

const Join = () => {
  return (
    <main className="relative min-h-screen w-[393px] mx-auto px-[24px] pt-[12px] bg-[#121212]/90">
      <h1 className="text-hel-26 text-[#fff]">JOIN</h1>
      <div className="flex justify-between mt-[24px] w-full">
        <button className="flex justify-center items-center gap-[4px] w-[142px] h-[48px] bg-transparent border-[1.5px] border-[#E9E9E9] rounded-[5px] text-hakgyo-b-17 whitespace-nowrap cursor-pointer text-[#fff]">
          전체 채팅방 <img src={downArrow} alt="" />
        </button>
        <div className="flex">
          <button className="p-[0] bg-transparent border-none cursor-pointer">
            <img src={guitar} alt="" />
          </button>
          <button className="p-[0] bg-transparent border-none cursor-pointer">
            <img src={moodHeart} alt="" />
          </button>
        </div>
      </div>
      <section className="flex flex-col gap-[19px] mt-[48px] w-full">
        <NormalChat />
        <BandChat isHost={true} />
        <BandChat />
      </section>

      {/* floating btn */}
      <button className="fixed bottom-[66px] right-[16px] size-[61px] border-none rounded-full bg-[#B42127] cursor-pointer">
        <img src={plus} alt="+"></img>
      </button>
    </main>
  );
};

export default Join;
