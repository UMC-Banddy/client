import React, { useState, useEffect } from "react";
import SettingList from "./_components/SettingList";
import MuiDialog from "@/shared/components/MuiDialog";
import CommonBtn from "@/shared/components/CommonBtn";
import backIcon from "@/assets/icons/back.svg";
import { useNavigate } from "react-router-dom";
import { useWithdrawal } from "@/features/setting/hooks/useWithdrawal";
import { type SettingItem } from "@/types/setting";
import alarmIcon from "@/assets/icons/setting/alarm.svg";
import noteIcon from "@/assets/icons/setting/note.svg";
import ghostIcon from "@/assets/icons/setting/ghost.svg";
import exitIcon from "@/assets/icons/setting/exit.svg";

const SettingsPage = () => {
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const navigate = useNavigate();
  
  // 커스텀 훅 사용
  const { isLoading, error, handleWithdrawal } = useWithdrawal();
  
  // 에러가 있으면 로그 출력
  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);
  
  // 설정 아이템 데이터
  const settingsItems: SettingItem[] = [
    {
      icon: alarmIcon,
      title: "알림 설정",
      onClick: () => console.log("알림 설정 클릭")
    },
    {
      icon: noteIcon,
      title: "이용약관 및 처리방침",
      onClick: () => console.log("이용약관 클릭")
    },
    {
      icon: ghostIcon,
      title: "밴디 식구들",
      onClick: () => console.log("밴디 식구들 클릭")
    },
    {
      icon: exitIcon,
      title: "회원 탈퇴",
      onClick: () => setWithdrawalOpen(true)
    }
  ];

  return (
    <div className="min-h-[100vh] w-full flex flex-col">
      <header className="absolute top-0 left-0 w-full h-14 flex items-center px-[4vw] text-[#FFFFFF] z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-[10vw] h-[10vw] flex items-center justify-center focus:outline-none"
        >
          <img src={backIcon} alt="Back" className="w-[10vw] h-[10vw] max-w-[40px] max-h-[40px]" />
        </button>
        <span className="text-[#FFFFFF] text-hel-26 ml-[12px]">Settings</span>
      </header>
      <div className="flex-1 px-[4vw] mt-14 pt-[2.3vh]">
        <SettingList items={settingsItems} />
      </div>

      <MuiDialog open={withdrawalOpen} setOpen={setWithdrawalOpen}>
        <div className="flex flex-col items-center justify-center bg-[#e9e9e9] rounded-[14px] pt-[7vh] pb-[3vh] px-[6vw] max-w-[336px]">
          <div className="text-hakgyo-b-24 text-[#292929] mb-[1.4vh]">탈퇴하시겠습니까?</div>
          <div className="text-hakgyo-r-14 text-[#555555] mx-[12vw] mb-[5vh] text-center leading-relaxed w-[61vw] break-keep max-w-[240px]">
            탈퇴 시 밴드 지원 기록 및 사용자 아카이브를 포함한 모든 정보가 삭제되며, 되돌릴 수 없습니다.
          </div>
          <div className="flex gap-[2vw] w-full justify-center">
            <CommonBtn 
              color="gray" 
              onClick={handleWithdrawal}
              disabled={isLoading}
            >
              {isLoading ? "처리중..." : "예"}
            </CommonBtn>
            <CommonBtn 
              color="red" 
              onClick={() => setWithdrawalOpen(false)}
              disabled={isLoading}
            >
              아니오
            </CommonBtn>
          </div>
        </div>
      </MuiDialog>
    </div>
  );
};

export default SettingsPage;
