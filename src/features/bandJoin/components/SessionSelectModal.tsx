import { useState } from "react";
import MuiDialog from "@/shared/components/MuiDialog";
import { SESSION_OPTIONS, type SessionEmoji } from "../types";
import {
  MicImg,
  GuitarImg,
  AcousticGuitarImg,
  BassImg,
  DrumImg,
  PianoImg,
  ViolinImg,
  TrumpetImg,
} from "@/shared/components/images";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (session: SessionEmoji) => void;
}

const iconMap: Record<
  SessionEmoji,
  (props: { size?: number; color?: string }) => JSX.Element
> = {
  "🎤 보컬 🎤": (p) => <MicImg size={p.size ?? 28} color="gray-700" />,
  "🎸 일렉 기타 🎸": (p) => <GuitarImg size={p.size ?? 28} color="gray-700" />,
  "🪕 어쿠스틱 기타 🪕": (p) => (
    <AcousticGuitarImg size={p.size ?? 28} color="gray-700" />
  ),
  "🎵 베이스 🎵": (p) => <BassImg size={p.size ?? 28} color="gray-700" />,
  "🥁 드럼 🥁": (p) => <DrumImg size={p.size ?? 28} color="gray-700" />,
  "🎹 키보드 🎹": (p) => <PianoImg size={p.size ?? 28} color="gray-700" />,
  "🎻 바이올린 🎻": (p) => <ViolinImg size={p.size ?? 28} color="gray-700" />,
  "🎺 트럼펫 🎺": (p) => <TrumpetImg size={p.size ?? 28} color="gray-700" />,
};

export default function SessionSelectModal({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<SessionEmoji | null>(null);

  return (
    <MuiDialog open={open} setOpen={(v) => (v ? undefined : onClose())}>
      <div
        className="bg-white rounded-[28px] w-full max-w-[360px] min-w-[320px] px-6 pt-8 pb-6 flex flex-col items-center"
        style={{ boxShadow: "0px 4px 13px 0px #00000040" }}
      >
        <h2 className="text-[22px] font-extrabold text-black mb-2">
          세션 선택
        </h2>
        <p className="text-[14px] text-gray-600 mb-5">
          어느 세션으로 지원하시겠습니까?
        </p>

        <div className="grid grid-cols-4 gap-x-4 gap-y-4 mb-6">
          {SESSION_OPTIONS.map((opt) => {
            const Icon = iconMap[opt];
            const isSelected = selected === opt;
            return (
              <button
                key={opt}
                aria-pressed={isSelected}
                onClick={() => setSelected(opt)}
                className={`w-[64px] h-[64px] rounded-full flex items-center justify-center border transition ${
                  isSelected
                    ? "bg-[#B42127] border-[#B42127]"
                    : "bg-[#F1F1F1] border-[#E5E7EB]"
                }`}
              >
                <div className={isSelected ? "brightness-200 invert" : ""}>
                  <Icon size={28} color={isSelected ? "red-400" : "gray-700"} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 w-full max-w-[280px]">
          <button
            className="flex-1 h-11 rounded-full bg-gray-200 text-black font-bold"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="flex-1 h-11 rounded-full bg-[#B42127] text-white font-bold disabled:opacity-50"
            disabled={!selected}
            onClick={() => selected && onConfirm(selected)}
          >
            확인
          </button>
        </div>
      </div>
    </MuiDialog>
  );
}
