import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import whiteStar from "../../assets/logos/white-star.svg";

/* 임시 하드 코딩. 수정 필요*/
const regions = ["서울", "경기", "강원", "인천"];
const seoulDistricts = ["노원구", "강남구", "마포구", "종로구"];

const SignupProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [regionOpen, setRegionOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);

  const isFormValid = !!(age && gender);

  return (
    <div className="relative w-full min-h-screen max-w-md mx-auto bg-black text-white overflow-hidden">
      {/* 프로그레스 바 */}
      <div className="w-full h-0.5 bg-[#959595]">
        <div className="w-full h-full bg-[#C7242D]" />
      </div>

      {/* 상단 아이콘 */}
      <img src={whiteStar} alt="step" className="absolute right-6 top-[18px] w-8 h-8" />

      {/* 콘텐츠 */}
      <div className="flex flex-col px-6 pt-[180px] pb-10">
        <p className="text-sm text-[#959595] mb-1">Step. 4</p>
        <h1 className="text-lg font-semibold mb-2">기본 정보를 입력해 주세요.</h1>
        <p className="text-xs text-[#959595] mb-6">* 표시는 필수 입력 사항입니다.</p>

        {/* 나이 */}
        <div className="mb-6">
          <label htmlFor="age" className="block mb-1">
            나이 <span className="text-red-500">*</span>
          </label>
          <input
            id="age"
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border-b border-[#959595] bg-transparent py-2 focus:outline-none text-white"
          />
        </div>

        {/* 성별 */}
        <div className="mb-6">
          <span className="block mb-1">
            성별 <span className="text-red-500">*</span>
          </span>
          <div className="flex gap-6 mt-2">
            {["남성", "여성"].map((label) => {
              const value = label === "남성" ? "male" : "female";
              const selected = gender === value;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setGender(value as "male" | "female")}
                  className={`flex items-center gap-2 text-sm ${selected ? "text-white" : "text-[#CACACA]"}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
      selected ? "bg-white" : "bg-[#CACACA]"
    }`}
                  >
                    {selected && <div className="w-2 h-2 bg-[#292929] rounded-full" />}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 거주 지역 */}
        {isFormValid && (
          <div className="mb-10">
            <span className="block mb-2">거주 지역</span>
            <div className="flex gap-2">
              {/* 지역 선택 */}
              <div className="relative w-[140px]">
                <button
                  onClick={() => {
                    setRegionOpen(!regionOpen);
                    setDistrictOpen(false);
                  }}
                  className="w-full border bg-[#CACACA] py-2 px-3 text-left text-[#292929] text-sm flex justify-between items-center"
                >
                  {region || "선택"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transform transition-transform ${regionOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {regionOpen && (
                  <div className="absolute z-10 w-full bg-[#FFFFFF] border border-[#CACACA] mt-1 max-h-40 overflow-y-auto">
                    {regions.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRegion(r);
                          setRegionOpen(false);
                          setDistrict("");
                        }}
                        className="block w-full text-left px-3 py-2 text-[#292929] text-sm hover:bg-neutral-700"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 구 선택 */}
              <div className="relative w-[140px]">
                <button
                  onClick={() => {
                    if (region) setDistrictOpen(!districtOpen);
                  }}
                  className="w-full border bg-[#CACACA] py-2 px-3 text-left text-[#292929] text-sm flex justify-between items-center"
                >
                  {district || "-"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transform transition-transform ${districtOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {districtOpen && region === "서울" && (
                  <div className="absolute z-10 w-full bg-[#FFFFFF] border border-[#CACACA] mt-1 max-h-40 overflow-y-auto">
                    {seoulDistricts.map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          setDistrict(d);
                          setDistrictOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-[#292929] text-sm hover:bg-neutral-700"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 완료 버튼 */}
        <button
          disabled={!isFormValid}
          onClick={() => navigate("/signup/complete")}
          className={`w-full py-3 mt-4 rounded-[24px] font-semibold transition ${
            isFormValid
              ? "bg-[#C7242D] text-white"
              : "bg-[#959595] text-[#555555] cursor-default"
          }`}
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default SignupProfilePage;
