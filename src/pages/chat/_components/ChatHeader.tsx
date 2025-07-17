// import MoreIcon from "@/assets/icons/more.svg";

export default function ChatHeader() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-[#181818]">
      <button>
        {/* 뒤로가기 아이콘 */}
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path
            d="M15 19l-7-7 7-7"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="flex flex-col items-center">
        <img
          src="/images/band-profile.jpg"
          alt="밴드"
          className="w-12 h-12 rounded-full object-cover mb-1"
        />
        <span className="text-xs text-[#CACACA]">우리밴드 정상영업합니다</span>
      </div>
      <button>{/* <MoreIcon className="w-6 h-6 text-white" /> */}</button>
    </header>
  );
}
