import React from "react";

interface BandProfileHeaderProps {
  imageSrc: string;
  title: string;
}

const BandProfileHeader = ({ imageSrc, title }: BandProfileHeaderProps) => (
  <div className="flex flex-col items-center mb-4">
    <img
      src={imageSrc}
      alt="Band Profile"
      className="w-64 h-64 object-cover mb-6"
    />
    <h2 className="text-xl font-bold text-[#E9E9E9] font-hakgyoansim">
      냥커버!!의 인원 구성 정보
    </h2>
  </div>
);

export default BandProfileHeader;
