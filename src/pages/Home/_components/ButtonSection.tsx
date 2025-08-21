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
import { getChatRooms } from "@/store/chatApi";

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
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const isBookmarked = useIsBookmarked(bandId);
  const [starOn, setStarOn] = useState<boolean>(isBookmarked);
  const toggleBookmark = useToggleBandBookmark();

  useEffect(() => {
    setStarOn(isBookmarked);
  }, [isBookmarked]);
  const [open, setOpen] = useState(false);
  const [openSession, setOpenSession] = useState(false);
  const [openSessionError, setOpenSessionError] = useState(false);
  const [sessionErrorMessage, setSessionErrorMessage] = useState<string>("");

  const handleJoinClick = () => {
    // 세션 선택 모달 먼저 표시
    setOpenSession(true);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-x-4 px-4 pr-4 py-0 mt-0 mb-0">
        <button
          className="opacity-50 p-2 hover:opacity-80 transition"
          onClick={async () => {
            if (!representativeSongFileUrl) {
              setToast(true, "해당 밴드의 녹음 파일이 없습니다");
              return;
            }

            try {
              // 재생/중지 토글
              if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                setCurrentAudio(null);
                setSoundOn(false);
                return;
              }

              const audio = new Audio(representativeSongFileUrl);
              audio.loop = true;
              audio.onended = () => {
                setCurrentAudio(null);
                setSoundOn(false);
              };
              await audio.play();
              setCurrentAudio(audio);
              setSoundOn(true);
            } catch {
              setToast(true, "해당 밴드의 녹음 파일이 없습니다");
              setCurrentAudio(null);
              setSoundOn(false);
            }
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
            // 1) 먼저 기존에 이 밴드에 대한 채팅방이 있는지 확인 후 있으면 해당 방으로 이동
            try {
              const rooms = await getChatRooms();
              const existed = rooms?.result?.appliedRoomInfos?.find(
                (r) => Number(r.bandId) === Number(bandId)
              );
              if (existed?.roomId) {
                navigate(
                  `/home/chat?roomId=${existed.roomId}&roomType=BAND-APPLICANT`
                );
                return;
              }
            } catch {
              // 조회 실패 시에는 신규 조인 플로우로 진행
            }

            const res = await postBandJoin(bandId, session);
            const roomId =
              res?.result?.roomId ?? (res as { roomId?: number })?.roomId;
            if (roomId) {
              // 현재 사용자가 밴드 주인장인지 확인
              // TODO: 실제 API에서 밴드 주인장 정보를 가져와서 비교
              // 현재는 임시로 false로 설정 (밴드 주인장 확인 로직 구현 필요)
              const isBandOwner = false;
              const roomType = isBandOwner ? "BAND-MANAGER" : "BAND-APPLICANT";
              console.log(
                `밴드 ${bandId} 조인: ${
                  isBandOwner ? "주인장" : "지원자"
                }로 채팅방 생성`
              );
              navigate(`/home/chat?roomId=${roomId}&roomType=${roomType}`);
            } else if (onJoinClick) {
              onJoinClick();
            } else {
              navigate("/home/chat-demo");
            }
          } catch (err: unknown) {
            const error = err as {
              response?: { data?: { code?: string; message?: string } };
              data?: { code?: string; message?: string };
              code?: string;
              message?: string;
            };
            const code =
              error?.response?.data?.code ?? error?.data?.code ?? error?.code;
            const msg =
              error?.response?.data?.message ??
              error?.data?.message ??
              error?.message;
            if (code === "BAND_SESSION4000") {
              setSessionErrorMessage(msg || "해당 세션은 모집 중이 아닙니다.");
              setOpenSessionError(true);
              return;
            }
            // 기타 실패 시 기존 플로우로 대체
            if (onJoinClick) onJoinClick();
          }
        }}
      />

      {/* 세션 비모집 에러 모달 */}
      <MuiDialog open={openSessionError} setOpen={setOpenSessionError}>
        <div className="flex flex-col items-center justify-center px-6 py-8 min-w-[320px] max-w-[350px]">
          <img src={blackStar} alt="logo" className="w-14 h-14 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            안내
          </h2>
          <p className="text-gray-500 text-base mb-8 text-center whitespace-pre-line">
            {sessionErrorMessage || "해당 세션은 모집 중이 아닙니다."}
          </p>
          <div className="flex gap-4 w-full justify-center">
            <button
              className="flex-1 bg-red-600 text-white font-bold py-3 rounded-full text-lg"
              onClick={() => setOpenSessionError(false)}
            >
              확인
            </button>
          </div>
        </div>
      </MuiDialog>
    </>
  );
};

export default ButtonSection;
