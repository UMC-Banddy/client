import back from "@/assets/icons/join/ic_back.svg";
import dotsVertical from "@/assets/icons/join/ic_dots_vertical.svg";
import bandRecruit from "@/assets/icons/join/band_recruit.png";
import mic from "@/assets/icons/join/ic_mic.svg";
import guitar from "@/assets/icons/join/ic_guitar_brighter.svg";
import RecruitChat from "./_components/band_recruit/RecruitChat";
import { useState } from "react";
import BandMenuContentBtn from "./_components/band_recruit/BandMenuContentBtn";
import Dialog from "@mui/material/Dialog";

const BandRecruit = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
                onClick={() => {
                  setOpenDeleteDialog(true);
                  setOpenMenu(false);
                }}
              >
                밴드 모집방 삭제
              </BandMenuContentBtn>
            </div>
          )}
        </div>

        {/* 방 삭제 dialog */}
        <Dialog
          onClose={() => setOpenDeleteDialog(false)}
          open={openDeleteDialog}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "14px",
            },
          }}
        >
          <div className="flex flex-col items-center pt-[62px] pb-[28px] px-[26px] w-[336px] h-[332px] bg-[#E9E9E9] text-center">
            <p className="text-hakgyo-b-24">
              정말
              <br />
              'Shinseikamattechan'을
              <br />
              삭제하시겠습니까?
            </p>
            <p className="mt-[16px] w-[240px] text-hakgyo-r-14 text-[#555]">
              삭제 시 되돌릴 수 없으며 지원자들의 채팅방에서 모두 나가기 처리가
              됩니다. 또한 밴드 모집방과 관련된 모든 데이터가 삭제되며 확인할 수
              없게 됩니다.{" "}
            </p>
            <div className="flex gap-[16px] mt-[24px]">
              <button
                className="w-[105px] h-[41px] border-none rounded-[50px] bg-[#CACACA] text-ibm-sb-16 text-[#B42127] whitespace-nowrap cursor-pointer"
                onClick={() => setOpenDeleteDialog(false)}
              >
                아니오
              </button>
              <button
                className="w-[105px] h-[41px] border-none rounded-[50px] bg-[#B42127] text-ibm-sb-16 text-[#fff] whitespace-nowrap cursor-pointer"
                onClick={() => setOpenDeleteDialog(false)}
              >
                예
              </button>
            </div>
          </div>
        </Dialog>

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
