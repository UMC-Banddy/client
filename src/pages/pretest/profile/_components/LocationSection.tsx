import React, { useState, useEffect } from "react";

interface LocationSectionProps {
  city: string;
  district: string;
  onCityChange?: (city: string) => void;
  onDistrictChange?: (district: string) => void;
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

// 시도별 구/군 데이터
const districtsByCity: Record<string, string[]> = {
  서울특별시: [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  부산광역시: [
    "강서구",
    "금정구",
    "남구",
    "동구",
    "동래구",
    "부산진구",
    "북구",
    "사상구",
    "사하구",
    "서구",
    "수영구",
    "연제구",
    "영도구",
    "중구",
    "해운대구",
    "기장군",
  ],
  대구광역시: [
    "남구",
    "달서구",
    "동구",
    "북구",
    "서구",
    "수성구",
    "중구",
    "달성군",
  ],
  인천광역시: [
    "계양구",
    "남구",
    "남동구",
    "동구",
    "부평구",
    "서구",
    "연수구",
    "중구",
    "강화군",
    "옹진군",
  ],
  광주광역시: ["광산구", "남구", "동구", "북구", "서구"],
  대전광역시: ["대덕구", "동구", "서구", "유성구", "중구"],
  울산광역시: ["남구", "동구", "북구", "중구", "울주군"],
  세종특별자치시: ["세종특별자치시"],
  경기도: [
    "수원시",
    "성남시",
    "의정부시",
    "안양시",
    "부천시",
    "광명시",
    "평택시",
    "동두천시",
    "안산시",
    "고양시",
    "과천시",
    "구리시",
    "남양주시",
    "오산시",
    "시흥시",
    "군포시",
    "의왕시",
    "하남시",
    "용인시",
    "파주시",
    "이천시",
    "안성시",
    "김포시",
    "화성시",
    "광주시",
    "여주시",
    "양평군",
    "고양군",
    "연천군",
    "포천군",
    "가평군",
  ],
  강원도: [
    "춘천시",
    "원주시",
    "강릉시",
    "동해시",
    "태백시",
    "속초시",
    "삼척시",
    "홍천군",
    "횡성군",
    "영월군",
    "평창군",
    "정선군",
    "철원군",
    "화천군",
    "양구군",
    "인제군",
    "고성군",
    "양양군",
  ],
  충청북도: [
    "청주시",
    "충주시",
    "제천시",
    "보은군",
    "옥천군",
    "영동군",
    "증평군",
    "진천군",
    "괴산군",
    "음성군",
    "단양군",
  ],
  충청남도: [
    "천안시",
    "공주시",
    "보령시",
    "아산시",
    "서산시",
    "논산시",
    "계룡시",
    "당진시",
    "금산군",
    "부여군",
    "서천군",
    "청양군",
    "홍성군",
    "예산군",
    "태안군",
  ],
  전라북도: [
    "전주시",
    "군산시",
    "익산시",
    "정읍시",
    "남원시",
    "김제시",
    "완주군",
    "진안군",
    "무주군",
    "장수군",
    "임실군",
    "순창군",
    "고창군",
    "부안군",
  ],
  전라남도: [
    "목포시",
    "여수시",
    "순천시",
    "나주시",
    "광양시",
    "담양군",
    "곡성군",
    "구례군",
    "고흥군",
    "보성군",
    "화순군",
    "장흥군",
    "강진군",
    "해남군",
    "영암군",
    "무안군",
    "함평군",
    "영광군",
    "장성군",
    "완도군",
    "진도군",
    "신안군",
  ],
  경상북도: [
    "포항시",
    "경주시",
    "김천시",
    "안동시",
    "구미시",
    "영주시",
    "영천시",
    "상주시",
    "문경시",
    "경산시",
    "군위군",
    "의성군",
    "청송군",
    "영양군",
    "영덕군",
    "청도군",
    "고령군",
    "성주군",
    "칠곡군",
    "예천군",
    "봉화군",
    "울진군",
    "울릉군",
  ],
  경상남도: [
    "창원시",
    "진주시",
    "통영시",
    "사천시",
    "김해시",
    "밀양시",
    "거제시",
    "양산시",
    "의령군",
    "함안군",
    "창녕군",
    "고성군",
    "남해군",
    "하동군",
    "산청군",
    "함양군",
    "거창군",
    "합천군",
  ],
  제주특별자치도: ["제주시", "서귀포시"],
};

const LocationSection: React.FC<LocationSectionProps> = ({
  city,
  district,
  onCityChange,
  onDistrictChange,
}) => {
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (city && districtsByCity[city]) {
      setAvailableDistricts(districtsByCity[city]);
    } else {
      setAvailableDistricts([]);
    }
  }, [city]);

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
        <div className="flex-1 relative">
          <select
            value={district}
            onChange={(e) => onDistrictChange?.(e.target.value)}
            className="w-full bg-gray-600 text-white px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 lg:px-8 lg:py-6 xl:px-10 xl:py-7 2xl:px-12 2xl:py-8 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl xl:rounded-4xl 2xl:rounded-5xl text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!city}
          >
            <option value="">구/군 선택</option>
            {availableDistricts.map((districtName) => (
              <option
                key={districtName}
                value={districtName}
                className="text-black"
              >
                {districtName}
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
