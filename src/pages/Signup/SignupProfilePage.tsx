import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "@/store/authStore";
import { signupMember } from "@/store/auth";
import SignupHeader from "./_components/SignupHeader";
import SignupStepTitle from "./_components/SignupStepTitle";
import SignupInputField from "./_components/SignupInputField";
import SignupButton from "./_components/SignupButton";

/* 전체 지역 */
const regions = [
  "-", "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종",
  "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
];

const SignupProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [region, setRegion] = useState("-");
  const [regionOpen, setRegionOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isFormValid = !!(age && gender);

  // 페이지 진입 시 토스트 메시지 표시
  useEffect(() => {
    setShowToast(true);
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000); // 3초 후 자동으로 사라짐

    return () => clearTimeout(timer);
  }, []);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    
    // 음수 입력 방지
    if (value === "" || (numValue >= 0 && numValue <= 120)) {
      setAge(value);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    authStore.age = Number(age);
    authStore.gender = gender === "male" ? "남성" : "여성";
    authStore.region = region === "-" ? "" : region;

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
      <SignupHeader progress={100} />

      <div className="flex flex-col px-6 pt-[180px] pb-10">
        <SignupStepTitle 
          step={4} 
          title="기본 정보를 입력해 주세요." 
          subtitle="* 표시는 필수 입력 사항입니다."
        />

        {/* 나이 */}
        <div className="mb-6">
          <label htmlFor="age" className="block mb-1">
            나이 <span className="text-red-500">*</span>
          </label>
          <SignupInputField
            id="age"
            type="number"
            inputMode="numeric"
            value={age}
            onChange={handleAgeChange}
            min="0"
            max="120"
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
                  className="w-full border bg-[#121212] border-[#E9E9E9] py-2 px-3 text-left text-[#E9E9E9] text-sm flex justify-between items-center"
                >
                  {region}
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
        <SignupButton
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="mt-4"
        >
          완료
        </SignupButton>
      </div>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="text-[#959595] text-sm whitespace-nowrap animate-fade-in-out">
            거의 다 왔어요. 화이팅 !
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupProfilePage;
