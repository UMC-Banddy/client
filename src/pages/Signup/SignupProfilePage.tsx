import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "@/store/authStore";
import { signupMember } from "@/store/auth";
import whiteStar from "../../assets/logos/white-star.svg";

/* 전체 지역 */
const regions = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주"
];

const SignupProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [region, setRegion] = useState("");
  const [regionOpen, setRegionOpen] = useState(false);

  const isFormValid = !!(age && gender);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    authStore.age = Number(age);
    authStore.gender = gender === "male" ? "남성" : "여성";
    authStore.region = region;

    try {
      await signupMember({
        email: authStore.email,
        password: authStore.password,
        nickname: authStore.nickname,
        gender: authStore.gender,
        region: authStore.region,
        age: authStore.age,
      });
      navigate("/signup/complete");
    } catch (err) {
      console.error("회원가입 실패", err);
    }
  };

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
            {[
              { label: "남성", value: "male" as const },
              { label: "여성", value: "female" as const }
            ].map(({ label, value }) => {
              const selected = gender === value;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setGender(value)}
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
              <div className="relative w-[120px]">
                <button
                  onClick={() => setRegionOpen(!regionOpen)}
                  className="w-full border bg-[#121212]  border-[#E9E9E9] py-2 px-3 text-left text-[#E9E9E9] text-sm flex justify-between items-center"
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
                  <div className="absolute z-10 w-full bg-[#555555] mt-1 max-h-40 overflow-y-auto">
                    {regions.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRegion(r);
                          setRegionOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-[#E9E9E9] text-sm hover:bg-neutral-700"
                      >
                        {r}
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
          onClick={handleSubmit}
          className={`w-full py-3 mt-4 rounded-[24px] font-semibold transition ${
            isFormValid
              ? "bg-[#C7242D] text-[#000000]"
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
