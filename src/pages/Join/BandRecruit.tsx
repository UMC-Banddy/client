import back from "@/assets/icons/join/ic_back.svg";
import dotsVertical from "@/assets/icons/join/ic_dots_vertical.svg";
import bandRecruit from "@/assets/icons/join/band_recruit.png";
import mic from "@/assets/icons/join/ic_mic.svg";
import guitar from "@/assets/icons/join/ic_guitar_brighter.svg";
import RecruitChat from "./_components/band_recruit/RecruitChat";
import { useState } from "react";
import BandMenuContentBtn from "./_components/band_recruit/BandMenuContentBtn";

const BandRecruit = () => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <main className="relative min-h-screen w-[393px] mx-auto bg-[#121212]/90">
      <section
        className="flex flex-col justify-between w-full h-[228px] bg-cover bg-center bg-no-repeat px-[16px] pt-[16px]"
        style={{ backgroundImage: `url(${bandRecruit})` }}
      >
        <div className="flex justify-between">
          <button className="p-[0] bg-transparent border-none cursor-pointer">
            <img src={back} alt="back" />
          </button>
          <button
            className="p-[0] bg-transparent border-none cursor-pointer"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <img src={dotsVertical} alt="dotsVertical" />
          </button>
          {openMenu && (
            <div className="flex flex-col absolute top-[0] right-[12px] translate-y-[33.3%]">
              <BandMenuContentBtn
                radius="top"
                onClick={() => setOpenMenu(false)}
              >
                합격 / 불합격 관리
              </BandMenuContentBtn>
              <BandMenuContentBtn onClick={() => setOpenMenu(false)}>
                밴드 모집방 편집
              </BandMenuContentBtn>
              <BandMenuContentBtn
                radius="bottom"
                onClick={() => setOpenMenu(false)}
              >
                밴드 모집방 삭제
              </BandMenuContentBtn>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-[8px] mb-[20px]">
          <p className="text-hakgyo-b-24 text-[#fff]">Shinsei Kamattechan</p>
          <div className="flex items-center gap-[12px]">
            <div className="px-[11px] py-[4px] rounded-full bg-[#B42127] text-[#fff] text-wanted-sb-13">
              모집중
            </div>
            <div className="flex gap-[4px]">
              <img className="size-[16px]" src={mic} alt="mic" />
              <p className="text-wanted-sb-13 text-[#CACACA]">보컬</p>
            </div>
            <div className="flex gap-[4px]">
              <img className="size-[16px]" src={guitar} alt="guitar" />
              <p className="text-wanted-sb-13 text-[#CACACA]">일렉기타</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-[20px] px-[16px] pt-[32px] w-full">
        <RecruitChat />
        <RecruitChat />
        <RecruitChat />
      </section>
    </main>
  );
};

export default BandRecruit;
