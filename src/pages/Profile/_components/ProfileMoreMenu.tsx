import { useRef, useEffect } from "react";
import banIcon from "@/assets/icons/profile/ban.svg";
import flagIcon from "@/assets/icons/profile/flag.svg";
import more_vertical from "@/assets/icons/join/ic_dots_vertical.svg";

interface ProfileMoreMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onReport?: () => void;
  onBan?: () => void;
}

export default function ProfileMoreMenu({ open, setOpen, onReport, onBan }: ProfileMoreMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  return (
    <div className="relative">
      <button
        className="w-[8vw] h-[8vw] flex items-center justify-center mr-[3vw] max-w-[32px] max-h-[32px]"
        onClick={() => setOpen(!open)}
      >
        <img src={more_vertical} alt="more-vertical" className="w-[8vw] h-[8vw] max-w-[32px] max-h-[32px]" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute right-[4vw] w-[32vw] bg-white rounded-xl shadow-lg z-50 flex flex-col py-2 max-w-[128px]"
        >
          <button
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-black"
            onClick={() => { setOpen(false); onReport?.(); }}
          >
            <img src={flagIcon} alt="신고" className="w-5 h-5 mr-2" />
            신고
          </button>
          <button
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-black"
            onClick={() => { setOpen(false); onBan?.(); }}
          >
            <img src={banIcon} alt="차단" className="w-5 h-5 mr-2" />
            차단
          </button>
        </div>
      )}
    </div>
  );
} 