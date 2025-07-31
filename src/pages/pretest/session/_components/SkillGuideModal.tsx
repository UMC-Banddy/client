import React from "react";
import MuiDialog from "@/shared/components/MuiDialog";
import beginnerIcon from "@/assets/icons/pretest/beginner.svg";
import intermediateIcon from "@/assets/icons/pretest/intermediate.svg";
import expertIcon from "@/assets/icons/pretest/expert.svg";

interface SkillGuideModalProps {
  open: boolean;
  onClose: () => void;
}

const SkillGuideModal: React.FC<SkillGuideModalProps> = ({ open, onClose }) => {
  const skillLevels = [
    {
      level: "beginner" as const,
      title: "초보",
      icon: beginnerIcon,
      descriptions: ["코드를 간신히 잡아요.", "처음해봐요."],
    },
    {
      level: "intermediate" as const,
      title: "중수",
      icon: intermediateIcon,
      descriptions: ["어느정도 익숙해요.", "연습하면 할 수 있어요."],
    },
    {
      level: "expert" as const,
      title: "고수",
      icon: expertIcon,
      descriptions: ["뭐든 해요."],
    },
  ];

  return (
    <MuiDialog open={open} setOpen={() => onClose()}>
      <div className="w-[320px] h-[400px] bg-white rounded-2xl p-5 flex flex-col justify-center items-center overflow-hidden">
        {/* 실력 레벨 목록 */}
        <div className="space-y-4 w-full">
          {skillLevels.map((skill) => (
            <div key={skill.level} className="mb-3 w-full">
              <div className="flex items-center gap-3 mb-2 w-full">
                <img
                  src={skill.icon}
                  alt={`${skill.title} 아이콘`}
                  className="w-7 h-7 flex-shrink-0"
                />
                <h4 className="text-lg font-medium text-gray-800 flex-shrink-0">
                  {skill.title}
                </h4>
              </div>
              <div className="space-y-1 ml-10 w-full">
                {skill.descriptions.map((description, descIndex) => (
                  <p
                    key={descIndex}
                    className="text-sm text-gray-600 break-words"
                  >
                    {description}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 확인 버튼 */}
        <div className="mt-6 w-full">
          <button
            onClick={onClose}
            className="w-full bg-[#C7242D] text-white py-4 rounded-full font-bold text-lg hover:bg-[#B71C1C] transition-colors duration-200"
          >
            OK!
          </button>
        </div>
      </div>
    </MuiDialog>
  );
};

export default SkillGuideModal;
