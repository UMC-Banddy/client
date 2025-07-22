import BackIcon from "@/assets/icons/back.svg";
import SettingIcon from "@/assets/icons/setting.svg";

export default function ChatHeader() {
  return (
    <main className="w-full flex items-center justify-between px-6 py-5 bg-[#181818] h-24">
      <button className="flex items-center justify-center w-12 h-12">
        <img src={BackIcon} alt="Back" className="w-8 h-8" />
      </button>
      <div className="flex flex-col items-center">
        <img
          src="/src/assets/images/profile1.png"
          alt="밴드"
          className="w-16 h-16 rounded-full object-cover mb-2"
        />
        <span className="text-sm text-[#CACACA]">우리밴드 정상영업합니다</span>
      </div>
      <button className="flex items-center justify-center w-12 h-12">
        <img src={SettingIcon} alt="Setting" className="w-8 h-8" />
      </button>
    </main>
  );
}
