// ... existing code ...

import profileFallback from "@/assets/images/profile1.png";

interface BandProfileHeaderProps {
  imageSrc: string;
  bandName: string;
  description: string;
}

const BandProfileHeader = ({
  imageSrc,
  bandName,
  description,
}: BandProfileHeaderProps) => (
  <div className="flex flex-col items-center mb-4">
    <img
      src={imageSrc || profileFallback}
      alt="Band Profile"
      className="w-64 h-64 object-cover mb-6"
      onError={(e) => {
        e.currentTarget.src = profileFallback;
      }}
    />
    <h2 className="text-xl font-bold text-[#E9E9E9] font-hakgyoansim">
      {bandName}의 {description}
    </h2>
  </div>
);

export default BandProfileHeader;
