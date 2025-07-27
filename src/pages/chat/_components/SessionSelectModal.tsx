import React from "react";
import Modal from "@/shared/components/MuiDialog";
import MicImg from "@/shared/components/images/MicImg";
import ElectricGuitarImg from "@/shared/components/images/ElectricGuitarImg";
import GuitarImg from "@/shared/components/images/GuitarImg";
import BassImg from "@/shared/components/images/BassImg";
import DrumImg from "@/shared/components/images/DrumImg";
import PianoImg from "@/shared/components/images/PianoImg";
import ViolinImg from "@/shared/components/images/ViolinImg";
import TrumpetImg from "@/shared/components/images/TrumpetImg";

interface SessionSelectModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedSession: string) => void;
}

const sessions = [
  { id: "vocal", name: "보컬", icon: MicImg },
  { id: "electric-guitar", name: "일렉기타", icon: ElectricGuitarImg },
  { id: "acoustic-guitar", name: "어쿠스틱기타", icon: GuitarImg },
  { id: "bass", name: "베이스", icon: BassImg },
  { id: "drum", name: "드럼", icon: DrumImg },
  { id: "piano", name: "피아노", icon: PianoImg },
  { id: "violin", name: "바이올린", icon: ViolinImg },
  { id: "trumpet", name: "트럼펫", icon: TrumpetImg },
];

export default function SessionSelectModal({
  open,
  onClose,
  onConfirm,
}: SessionSelectModalProps) {
  const [selectedSession, setSelectedSession] = React.useState<string>("");

  const handleConfirm = () => {
    if (selectedSession) {
      onConfirm(selectedSession);
    }
  };

  return (
    <Modal open={open} setOpen={onClose}>
      <div className="bg-gray-50 rounded-[20px] p-6 min-w-[320px] max-w-[400px]">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-black mb-3">세션 선택</h2>
          <p className="text-black text-base">
            어느 세션으로 지원하시겠습니까?
          </p>
        </div>

        {/* 세션 그리드 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setSelectedSession(session.id)}
              className="flex flex-col items-center transition-colors"
            >
              <div className="mb-2 transition-colors">
                {(() => {
                  const IconComponent = session.icon;
                  return (
                    <IconComponent
                      size={68}
                      color={selectedSession === session.id ? "red" : "gray"}
                    />
                  );
                })()}
              </div>
              <span className="text-xs text-gray-700 text-center">
                {session.name}
              </span>
            </button>
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-[25px] font-medium transition-colors bg-gray-200 text-red-600 hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSession}
            className={`flex-1 py-3 px-4 rounded-[25px] font-medium transition-colors ${
              selectedSession
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
}
