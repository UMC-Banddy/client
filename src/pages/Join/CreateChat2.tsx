import back from "@/assets/icons/join/ic_back.svg";
import clsx from "clsx";
import { useState } from "react";
import happy from "@/assets/icons/join/ic_mood_happy.svg";
import cameraBtn from "@/assets/icons/join/ic_camera_btn.svg";

const CreateChat2 = () => {
  const [enableConfirmBtn, setEnableConfirmBtn] = useState(false);
  return (
    <main className="flex flex-col items-center relative p-[16px] min-h-screen w-[393px] mx-auto bg-[#121212]/90">
      <div className="flex justify-between mb-[16px] w-full">
        <button className="p-[0] bg-transparent border-none cursor-pointer">
          <img src={back} alt="back" />
        </button>
        <button
          className={clsx(
            "p-[0] bg-transparent border-none text-ibm-sb-16",
            enableConfirmBtn ? "text-[#79D000] cursor-pointer" : "text-[#555]"
          )}
        >
          확인
        </button>
      </div>

      <div className="relative mt-[30px] mb-[40px] size-[162px] rounded-full bg-[#CACACA] flex items-center justify-center">
        <img src={happy} alt="happy mood" className="size-[112px]" />
        <button className="absolute right-[0] bottom-[0] p-[0] size-[39px] bg-transparent border-none cursor-pointer">
          <img className="size-full" src={cameraBtn} alt="camera" />
        </button>
      </div>

      <div className="mx-[8px] flex justify-between py-[12px] w-full border-b-[0.75px] border-[#959595]">
        <input
          type="text"
          placeholder="그룹 이름을 입력해주세요."
          className="w-full h-full bg-transparent border-none text-hakgyo-r-16 focus:outline-none"
        />
        <p className="text-hakgyo-r-14 text-[#959595]">0/10</p>
      </div>

      <div className="mt-[16px] w-full">
        <p className="text-hakgyo-r-14 text-[#959595]">
          한 번 설정한 프로필 사진과 이름은 바꿀 수 없습니다. <br />
          신중하게 결정해주세요.
        </p>
      </div>
    </main>
  );
};

export default CreateChat2;
