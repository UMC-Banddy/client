import React from "react";

interface ProfileEditHeaderProps {
  onBack: () => void;
  onComplete: () => void;
}

const ProfileEditHeader: React.FC<ProfileEditHeaderProps> = ({
  onBack,
  onComplete,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <button onClick={onBack} className="p-2">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button onClick={onComplete} className="text-[#7ED957] font-bold text-lg">
        완료
      </button>
    </div>
  );
};

export default ProfileEditHeader;
