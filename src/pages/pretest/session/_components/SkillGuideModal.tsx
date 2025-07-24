import React from "react";
import MuiDialog from "@/shared/components/MuiDialog";
import { SkillLevelIcon } from "@/shared/components/images";

interface SkillGuideModalProps {
  open: boolean;
  onClose: () => void;
}

const SkillGuideModal: React.FC<SkillGuideModalProps> = ({ open, onClose }) => {
  const skillLevels = [
    {
      level: "beginner" as const,
      title: "초보",
      emoji: "🍼",
      descriptions: ["코드를 간신히 잡아요.", "처음해봐요."],
    },
    {
      level: "intermediate" as const,
      title: "중수",
      emoji: "",
      descriptions: ["어느정도 익숙해요.", "연습하면 할 수 있어요."],
    },
    {
      level: "expert" as const,
      title: "고수",
      emoji: "🔥",
      descriptions: ["뭐든 해요."],
    },
  ];

  return (
    <MuiDialog open={open} setOpen={() => onClose()}>
      <div className="w-[354px] h-[462px] bg-white rounded-2xl p-6 overflow-hidden flex flex-col justify-center">
        {/* 실력 레벨 목록 */}
        <div className="space-y-6">
          {skillLevels.map((skill, index) => (
            <div
              key={skill.level}
              className="flex items-center justify-center gap-4"
            >
              {/* 아이콘 */}
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-50 flex-shrink-0">
                <SkillLevelIcon
                  level={skill.level}
                  size={40}
                  className="text-gray-600"
                />
              </div>

              {/* 텍스트 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {skill.title}
                  </h3>
                  {skill.emoji && (
                    <span className="text-lg">{skill.emoji}</span>
                  )}
                </div>
                <div className="mt-1">
                  {skill.descriptions.map((description, descIndex) => (
                    <p
                      key={descIndex}
                      className="text-sm text-gray-600 leading-relaxed"
                    >
                      {description}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 확인 버튼 */}
        <div className="mt-8 mb-4">
          <button
            onClick={onClose}
            className="w-full bg-[#C7242D] text-black py-4 rounded-full font-bold text-lg hover:bg-[#B71C1C] transition-colors duration-200"
          >
            OK!
          </button>
        </div>
      </div>
    </MuiDialog>
  );
};

export default SkillGuideModal;
