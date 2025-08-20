import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import whiteStar from "@/assets/logos/white-star.svg";
import blackStar from "@/assets/logos/black-star.svg";
import muteIcon from "@/assets/icons/home/no-sound.svg";
import onSoundIcon from "@/assets/icons/home/on-sound.svg";
import starIcon from "@/assets/icons/home/like-star.svg";
import scrabStarIcon from "@/assets/icons/home/scrab-star.svg";
import MuiDialog from "@/shared/components/MuiDialog";
import {
  useIsBookmarked,
  useToggleBandBookmark,
} from "@/features/bandBookmark/hooks";
import SessionSelectModal from "@/features/bandJoin/components/SessionSelectModal";
import { postBandJoin } from "@/features/bandJoin/api";
import type { SessionEmoji } from "@/features/bandJoin/types";

interface ButtonSectionProps {
  setToast: (open: boolean, text?: string) => void;
  onJoinClick?: () => void;
  bandId: number;
  representativeSongFileUrl?: string | null;
}

const ButtonSection = ({
  setToast,
  onJoinClick,
  bandId,
  representativeSongFileUrl,
}: ButtonSectionProps) => {
  const navigate = useNavigate();
  const [soundOn, setSoundOn] = useState(false);
  const isBookmarked = useIsBookmarked(bandId);
  const [starOn, setStarOn] = useState<boolean>(isBookmarked);
  const toggleBookmark = useToggleBandBookmark();

  useEffect(() => {
    setStarOn(isBookmarked);
  }, [isBookmarked]);
  const [open, setOpen] = useState(false);
  const [openSession, setOpenSession] = useState(false);

  const handleJoinClick = () => {
    // 세션 선택 모달 먼저 표시
    setOpenSession(true);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-x-4 px-4 pr-4 py-0 mt-0 mb-0">
        <button
          className="opacity-50 p-2 hover:opacity-80 transition"
          onClick={() => {
            if (!representativeSongFileUrl) {
              // 소리 파일이 없으면 동일 형태의 토스트 메시지 노출
              setToast(true, "해당 밴드에서 올린 음원이 없습니다");
              return;
            }
            setSoundOn((prev) => !prev);
          }}
        >
          <img
            src={soundOn ? onSoundIcon : muteIcon}
            alt={soundOn ? "on-sound" : "mute"}
            className="w-6 h-6"
          />
        </button>
        <button
          className="bg-red-600 text-white px-6 py-2 rounded-full flex items-center gap-2 font-bold hover:bg-red-500 transition"
          onClick={handleJoinClick}
        >
          <img src={whiteStar} alt="join" className="w-4 h-4" />
          JOIN
        </button>
        <button
          className="opacity-50 p-2 hover:opacity-80 transition"
          onClick={() => {
            const next = !starOn;
            setStarOn(next);
            // API 연동 (낙관적 업데이트, 실패 시 롤백)
            toggleBookmark(bandId, next)
              .then(() => {
                if (next) setToast(true, "밴드가 저장 되었습니다.");
              })
              .catch(() => {
                setStarOn(!next);
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

      {/* 세션 선택 → 지원 API → 채팅방 이동 */}
      <SessionSelectModal
        open={openSession}
        onClose={() => setOpenSession(false)}
        onConfirm={async (session: SessionEmoji) => {
          try {
            setOpenSession(false);
            const res = await postBandJoin(bandId, session);
            const roomId =
              res?.result?.roomId ?? (res as { roomId?: number })?.roomId;
            if (roomId) {
              navigate(`/home/chat?roomId=${roomId}&roomType=GROUP`);
            } else if (onJoinClick) {
              onJoinClick();
            } else {
              navigate("/home/chat-demo");
            }
          } catch {
            // 실패 시 기존 플로우로 대체
            if (onJoinClick) onJoinClick();
          }
        }}
      />
    </>
  );
};

export default ButtonSection;
