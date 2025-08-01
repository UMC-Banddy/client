import back from "@/assets/icons/join/ic_back.svg";
import dotsVertical from "@/assets/icons/join/ic_dots_vertical.svg";
import bandRecruit from "@/assets/icons/join/band_recruit.png";
import mic from "@/assets/icons/join/ic_mic.svg";
import micRed from "@/assets/icons/join/ic_mic_red.svg";
import guitar from "@/assets/icons/join/ic_guitar_brighter.svg";
import RecruitChat from "./_components/band_recruit/RecruitChat";
import { useState } from "react";
import BandMenuContentBtn from "./_components/band_recruit/BandMenuContentBtn";
import CheckBox from "./_components/band_recruit/CheckBox";
import MuiDialog from "@/shared/components/MuiDialog";
import CommonBtn from "@/shared/components/CommonBtn";
import { useNavigate } from "react-router-dom";

const dummyData = [
  {
    id: 0,
  },
  {
    id: 1,
  },
  {
    id: 2,
  },
];

const BandRecruit = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const [checkEnabled, setCheckEnabled] = useState(false);
  const [checkedId, setCheckedId] = useState<number[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPassDialog, setOpenPassDialog] = useState(false);
  const [isPassDialog, setIsPassDialog] = useState(false);

  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen w-[393px] mx-auto">
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
                onClick={() => {
                  setCheckEnabled(true);
                  setOpenMenu(false);
                }}
              >
                합격 / 불합격 관리
              </BandMenuContentBtn>
              <BandMenuContentBtn
                onClick={() => {
                  navigate("/join/create-band");
                  setOpenMenu(false);
                }}
              >
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
        <MuiDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog}>
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
              <CommonBtn
                color="gray"
                onClick={() => setOpenDeleteDialog(false)}
              >
                아니오
              </CommonBtn>
              <CommonBtn color="red" onClick={() => setOpenDeleteDialog(false)}>
                예
              </CommonBtn>
            </div>
          </div>
        </MuiDialog>

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
        {dummyData.map((item) => {
          const isChecked = checkedId.includes(item.id);
          return (
            <RecruitChat
              key={item.id}
              enableCheck={checkEnabled}
              checked={isChecked}
              onCheck={() => {
                if (isChecked) {
                  // 선택 해제
                  setCheckedId((prev) => prev.filter((i) => i !== item.id));
                } else {
                  setCheckedId((prev) => [...prev, item.id]);
                }
              }}
            />
          );
        })}
      </section>

      {checkEnabled && (
        <section className="flex justify-between items-center fixed bottom-[104px] px-[20px] w-[393px] h-[69px] rounded-t-[12px] bg-[#292929] z-[60]">
          <div className="flex items-center gap-[8px] ">
            <CheckBox
              checked={checkedId.length === dummyData.length}
              onClick={() => {
                if (checkedId.length === dummyData.length) {
                  setCheckedId([]);
                } else {
                  setCheckedId(dummyData.map((item) => item.id));
                }
              }}
              checkboxColor="#959595"
            />
            <p className="wanted-sb-13 text-[#959595]">전체 선택</p>
          </div>

          <div className="flex gap-[8px]">
            <button
              className="w-[108px] h-[33px] border-none rounded-[100px] bg-[#555] text-ibm-sb-16 text-[#fff] whitespace-nowrap cursor-pointer"
              onClick={() => {
                setIsPassDialog(false);
                setOpenPassDialog(true);
              }}
            >
              불합격 처리
            </button>
            <button
              className="w-[108px] h-[33px] border-none rounded-[100px] bg-[#555] text-ibm-sb-16 text-[#fff] whitespace-nowrap cursor-pointer"
              onClick={() => {
                setIsPassDialog(true);
                setOpenPassDialog(true);
              }}
            >
              합격 처리
            </button>
          </div>

          {/* 합격/불합격 처리 dialog */}
          <MuiDialog open={openPassDialog} setOpen={setOpenPassDialog}>
            <div className="flex flex-col items-center pt-[48px] pb-[27px] px-[40px] w-[334px] bg-[#E9E9E9] text-center">
              <p className="mb-[12px] text-hakgyo-b-24">
                일괄 {isPassDialog ? "합격" : "불합격"}
              </p>
              <p className="mb-[20px] text-wanted-sb-15">
                다음 지원자를 모두 {isPassDialog ? "합격" : "불합격"} 처리
                <br />
                하시겠습니까?
              </p>
              <p className="text-hakgyo-r-14 text-[#555] text-start">
                예를 누르시면 즉시 {isPassDialog ? "합격" : "불합격"} 통보가
                전송되며, 취소할 수 없습니다.{" "}
                {isPassDialog && "또한 친구 신청이 자동으로 발송됩니다."}
              </p>

              <section className="mt-[28px] w-full">
                <div className="flex justify-between items-center w-full">
                  <p>noko</p>
                  <div className="flex items-center gap-[4px]">
                    <img src={micRed} alt="mic" />
                    <p className="text-wanted-sb-13 text-[#B42127]">보컬</p>
                  </div>
                </div>
              </section>

              <div className="flex gap-[16px] mt-[39px]">
                <CommonBtn
                  color="gray"
                  onClick={() => setOpenPassDialog(false)}
                >
                  아니오
                </CommonBtn>
                <CommonBtn color="red" onClick={() => setOpenPassDialog(false)}>
                  예
                </CommonBtn>
              </div>
            </div>
          </MuiDialog>
        </section>
      )}
    </main>
  );
};

export default BandRecruit;
