import downArrow from "@/assets/icons/join/ic_down_arrow.svg";
import guitar from "@/assets/icons/join/ic_guitar.svg";
import moodHeart from "@/assets/icons/join/ic_mood_heart.svg";
import NormalChat from "./_components/chat/NormalChat";
import BandChat from "./_components/chat/BandChat";
import { useState } from "react";
import CategoryContentBtn from "./_components/chat/CategoryContentBtn";
import chatPlus from "@/assets/icons/join/ic_chat_plus.svg";
import handRock from "@/assets/icons/join/ic_hand_rock.svg";
import plus from "@/assets/icons/join/ic_plus.svg";

const Join = () => {
  const [openChatCategory, setOpenChatCategory] = useState(false);
  const [category, setCategory] = useState("전체 채팅방");
  const [openFloatingBtn, setOpenFloatingBtn] = useState(false);

  return (
    <main className="relative min-h-screen w-[393px] mx-auto px-[24px] pt-[12px] bg-[#121212]/90">
      <h1 className="text-hel-26 text-[#fff]">JOIN</h1>
      <div className="flex justify-between mt-[24px] w-full relative">
        <button
          className="flex justify-center items-center gap-[4px] w-[142px] h-[48px] bg-transparent border-[1.5px] border-[#E9E9E9] rounded-[5px] text-hakgyo-b-17 whitespace-nowrap cursor-pointer text-[#fff]"
          onClick={() => setOpenChatCategory(!openChatCategory)}
        >
          {category} <img src={downArrow} alt="" />
        </button>
        {openChatCategory && (
          <div className="flex flex-col absolute top-[5.5px] translate-y-[33.3%] border-[1.5px] border-[#E9E9E9] rounded-[5px] bg-[#292929]">
            <CategoryContentBtn
              onClick={() => {
                setCategory("전체 채팅방");
                setOpenChatCategory(!openChatCategory);
              }}
            >
              전체 채팅방
            </CategoryContentBtn>
            <CategoryContentBtn
              onClick={() => {
                setCategory("일반 채팅방");
                setOpenChatCategory(!openChatCategory);
              }}
            >
              일반 채팅방
            </CategoryContentBtn>
            <CategoryContentBtn
              onClick={() => {
                setCategory("밴드 채팅방");
                setOpenChatCategory(!openChatCategory);
              }}
            >
              밴드 채팅방
            </CategoryContentBtn>
          </div>
        )}
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
        {/* 출력 부분 API 연결 */}
        <NormalChat />
        <BandChat isHost={true} />
        <BandChat />
      </section>

      {/* floating btn */}
      <div className="fixed bottom-[66px] right-[16px]">
        {openFloatingBtn && (
          <div className="flex flex-col gap-[16px] mb-[16px]">
            <button className="flex justify-center items-center size-[61px] border-none rounded-full bg-[#fff] cursor-pointer">
              <img src={chatPlus} alt="+"></img>
            </button>
            <button className="flex justify-center items-center size-[61px] border-none rounded-full bg-[#fff] cursor-pointer">
              <img src={handRock} alt="+"></img>
            </button>
          </div>
        )}
        <button
          onClick={() => setOpenFloatingBtn(!openFloatingBtn)}
          className="flex justify-center items-center size-[61px] border-none rounded-full bg-[#B42127] cursor-pointer"
        >
          <img src={plus} alt="+"></img>
        </button>
      </div>
    </main>
  );
};

export default Join;
