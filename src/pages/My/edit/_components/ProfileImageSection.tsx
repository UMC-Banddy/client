import React from "react";
import cameraIcon from "@/assets/icons/camera.svg";

interface ProfileImageSectionProps {
  imageUrl: string;
  onImageChange?: () => void;
  onImageUpload?: () => void;
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  imageUrl,
  onImageChange,
  onImageUpload,
}) => {
  console.log("ProfileImageSection 렌더링, imageUrl:", imageUrl);

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="relative">
        <img
          src={imageUrl}
          alt="프로필"
          className="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 xl:w-56 xl:h-56 2xl:w-60 2xl:h-60 rounded-full object-cover"
        />
        <button
          onClick={onImageChange}
          className="absolute bottom-2 right-2 w-10 h-10 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-13 2xl:h-13 bg-black rounded-full flex items-center justify-center"
        >
          <img
            src={cameraIcon}
            alt="카메라"
            className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9"
          />
        </button>
      </div>
      <button
        onClick={onImageUpload}
        className="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 xl:w-56 xl:h-56 2xl:w-60 2xl:h-60 bg-[#B71C1C] rounded-full flex items-center justify-center"
      >
        <svg
          className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-24 xl:h-24 2xl:w-26 2xl:h-26 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </button>
    </div>
  );
};

export default ProfileImageSection;
