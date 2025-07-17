import React from "react";

interface PreferProfileImageProps {
  src: string;
}

const PreferProfileImage: React.FC<PreferProfileImageProps> = ({ src }) => (
  <div className="flex justify-center mb-6">
    <img
      src={src}
      alt="대표 이미지"
      className="w-40 h-40 rounded-full object-cover shadow-lg"
    />
  </div>
);

export default PreferProfileImage;
