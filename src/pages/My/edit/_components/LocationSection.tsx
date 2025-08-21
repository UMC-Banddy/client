interface LocationSectionProps {
  city: string;
  onCityChange?: (city: string) => void;
}

// 한국 시도 데이터
const cities = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

const LocationSection: React.FC<LocationSectionProps> = ({
  city,
  onCityChange,
}) => {



  return (
    <div className="mb-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-white mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9">
        거주 지역
      </h3>
      <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
        <div className="flex-1 relative">
          <select
            value={city}
            onChange={(e) => onCityChange?.(e.target.value)}
            className="w-full bg-gray-600 text-white px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 lg:px-8 lg:py-6 xl:px-10 xl:py-7 2xl:px-12 2xl:py-8 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl xl:rounded-4xl 2xl:rounded-5xl text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl appearance-none cursor-pointer"
          >
            <option value="">시도 선택</option>
            {cities.map((cityName) => (
              <option key={cityName} value={cityName} className="text-black">
                {cityName}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 md:pr-5 lg:pr-6 xl:pr-7 2xl:pr-8 pointer-events-none">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
