import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logos/white-star.svg";

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
    <div className="flex flex-col min-h-screen bg-black text-white px-6 relative">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate("/signup/nickname")}
        className="absolute top-4 left-4"
        aria-label="뒤로가기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 프로그레스 바 */}
      <div className="h-0.5 w-full bg-neutral-700 mt-10 mb-8 relative">
        <div className="h-full bg-red-500 w-full absolute top-0 left-0" />
      </div>

      {/* 로고 */}
      <img src={logo} alt="Banddy" className="w-8 h-8 absolute top-4 right-4" />

      {/* 내용 */}
      <div className="flex-1 flex flex-col justify-start mt-6">
        <p className="text-sm text-neutral-400 mb-1">Step. 4</p>
        <h1 className="text-lg font-semibold mb-2">기본 정보를 입력해 주세요.</h1>
        <p className="text-xs text-neutral-400 mb-6">* 표시는 필수 입력 사항입니다.</p>

        {/* Scrollable 영역 */}
        <div
          className={`flex flex-col gap-6 overflow-y-auto ${isFormValid ? "max-h-96" : ""}`}
        >
          {/* 나이 */}
          <div>
            <label htmlFor="age" className="block mb-1">
              나이 <span className="text-red-500">*</span>
            </label>
            <input
              id="age"
              type="number"
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border-b border-neutral-500 bg-transparent py-2 focus:outline-none"
            />
          </div>

          {/* 성별 */}
          <div>
            <span className="block mb-1">
              성별 <span className="text-red-500">*</span>
            </span>
            <div className="flex gap-6 mt-2">
              {["남성", "여성"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (gender !== label) {
                      setGender(label === "남성" ? "male" : "female");
                    }
                  }}
                  className={`flex items-center gap-2 focus:outline-none ${
                    gender === (label === "남성" ? "male" : "female")
                      ? "text-white"
                      : "text-neutral-400"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border ${
                      gender === (label === "남성" ? "male" : "female")
                        ? "border-red-500 bg-red-500"
                        : "border-neutral-500"
                    }`}
                  />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 거주 지역 */}
          {isFormValid && (
            <div className="flex flex-col gap-4 mt-2">
              <span className="block mb-1">거주 지역</span>
              <div className="flex gap-2">
                {/* 지역 선택 */}
                <div className="relative w-1/2">
                  <button
                    onClick={() => {
                      setRegionOpen(!regionOpen);
                      setDistrictOpen(false);
                    }}
                    className="w-full border border-neutral-500 py-2 px-3 flex justify-between items-center"
                  >
                    {region || "선택"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transform transition-transform ${
                        regionOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {regionOpen && (
                    <div className="absolute z-10 w-full bg-neutral-800 border border-neutral-500 mt-1 max-h-40 overflow-y-auto">
                      {regions.map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            setRegion(r);
                            setRegionOpen(false);
                            setDistrict("");
                          }}
                          className="block w-full text-left px-3 py-2 hover:bg-neutral-700"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* 구 선택 */}
                <div className="relative w-1/2">
                  <button
                    onClick={() => {
                      if (region) setDistrictOpen(!districtOpen);
                    }}
                    className="w-full border border-neutral-500 py-2 px-3 flex justify-between items-center"
                  >
                    {district || "-"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transform transition-transform ${
                        districtOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {districtOpen && region === "서울" && (
                    <div className="absolute z-10 w-full bg-neutral-800 border border-neutral-500 mt-1 max-h-40 overflow-y-auto">
                      {seoulDistricts.map((d) => (
                        <button
                          key={d}
                          onClick={() => {
                            setDistrict(d);
                            setDistrictOpen(false);
                          }}
                          className="block w-full text-left px-3 py-2 hover:bg-neutral-700"
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
        </div>

        {/* 완료 버튼 */}
        <button
          disabled={!isFormValid}
          onClick={() => navigate("/signup/complete")}
          className={`w-full py-3 mt-10 rounded-[24px] font-semibold transition ${
            isFormValid
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-neutral-700 text-neutral-400 cursor-default"
          }`}
        >
          완료
        </button>

        {/* 사전 테스트 / 로그인 하러가기 */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => navigate("/pretest")}
            className="text-sm underline text-neutral-400"
          >
            사전 테스트 하러가기
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-sm underline text-neutral-400"
          >
            로그인 하러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupProfilePage;
