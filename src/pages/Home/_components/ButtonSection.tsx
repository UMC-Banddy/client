import React, { useState } from "react";
import whiteStar from "@/assets/logos/white-star.svg";
import blackStar from "@/assets/logos/black-star.svg";
import muteIcon from "@/assets/icons/home/no-sound.svg";
import onSoundIcon from "@/assets/icons/home/on-sound.svg";
import starIcon from "@/assets/icons/home/like-star.svg";
import scrabStarIcon from "@/assets/icons/home/scrab-star.svg";
import MuiDialog from "@/shared/components/MuiDialog";

const ButtonSection = ({}: { onJoinClick?: () => void }) => {
  const [soundOn, setSoundOn] = useState(false);
  const [starOn, setStarOn] = useState(false);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // 토스트 자동 닫기
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 토스트 애니메이션: 위에서 아래로 fade-in, 아래로 fade-out
  React.useEffect(() => {
    if (toast) {
      setToastVisible(true);
      const timer = setTimeout(() => setToastVisible(false), 1600); // fade-out 시작
      const timer2 = setTimeout(() => setToast(false), 2000); // 완전 제거
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    }
  }, [toast]);

  return (
    <>
      <div className="flex items-center justify-center gap-x-4 px-4 pr-4 py-0 mt-0 mb-0">
        <button
          className="opacity-50 p-2 hover:opacity-80 transition"
          onClick={() => setSoundOn((prev) => !prev)}
        >
          <img
            src={soundOn ? onSoundIcon : muteIcon}
            alt={soundOn ? "on-sound" : "mute"}
            className="w-6 h-6"
          />
        </button>
        <button
          className="bg-red-600 text-white px-6 py-2 rounded-full flex items-center gap-2 font-bold hover:bg-red-500 transition"
          onClick={() => setOpen(true)}
        >
          <img src={whiteStar} alt="join" className="w-4 h-4" />
          JOIN
        </button>
        <button
          className="opacity-50 p-2 hover:opacity-80 transition"
          onClick={() => {
            setStarOn((prev) => {
              if (!prev) setToast(true); // scrab-star가 되는 순간만 토스트
              return !prev;
            });
          }}
        >
          <img
            src={starOn ? scrabStarIcon : starIcon}
            alt={starOn ? "scrab-star" : "like-star"}
            className="w-6 h-6"
          />
        </button>
      </div>
      <MuiDialog open={open} setOpen={setOpen}>
        <div className="flex flex-col items-center justify-center px-6 py-8 min-w-[320px] max-w-[350px]">
          <img src={blackStar} alt="logo" className="w-14 h-14 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            밴드에 조인하시겠습니까?
          </h2>
          <p className="text-gray-500 text-base mb-8 text-center">
            밴드 모집 채팅방에 참가합니다.
          </p>
          <div className="flex gap-4 w-full justify-center">
            <button
              className="flex-1 bg-gray-200 text-red-600 font-bold py-3 rounded-full text-lg"
              onClick={() => setOpen(false)}
            >
              아니요
            </button>
            <button
              className="flex-1 bg-red-600 text-white font-bold py-3 rounded-full text-lg"
              onClick={() => setOpen(false)}
            >
              예
            </button>
          </div>
        </div>
      </MuiDialog>
      {toast && (
        <div
          className={`fixed left-1/2 bottom-26 z-50 px-8 py-3 bg-black text-white rounded-full text-xl font-hakgyoansim -translate-x-1/2 transition-all duration-400
            ${
              toastVisible ? "animate-toast-slidein" : "animate-toast-slideout"
            }`}
          style={{
            minWidth: 220,
            maxWidth: "90vw",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            userSelect: "none",
          }}
        >
          밴드가 저장 되었습니다.
        </div>
      )}
    </>
  );
};

export default ButtonSection;
