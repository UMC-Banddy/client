import clsx from "clsx";
import back from "@/assets/icons/join/ic_back.svg";
import { useNavigate } from "react-router-dom";

interface JoinHeaderProps {
  enableConfirmBtn: boolean;
  confirmBtnContent?: string;
  onClick: () => void;
}

/**
 * Join 커스텀 header
 * src/widgets/Layout/Header.tsx에서 nonHeaderRouteNames에 해당 route 추가 후 사용
 *
 * @param {boolean} enableConfirmBtn - 확인 버튼 활성화 여부
 * @param {string} [confirmBtnContent] - optional, default: "확인"
 * @param {() => void} onClick - onClick
 */
const JoinHeader = ({
  enableConfirmBtn,
  confirmBtnContent = "확인",
  onClick,
}: JoinHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between mb-[16px] w-full">
      <button
        className="p-[0] bg-transparent border-none cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <img src={back} alt="back" />
      </button>
      <button
        className={clsx(
          "p-[0] bg-transparent border-none text-ibm-sb-16",
          enableConfirmBtn ? "text-[#79D000] cursor-pointer" : "text-[#555]"
        )}
        onClick={onClick}
      >
        {confirmBtnContent}
      </button>
    </div>
  );
};
export default JoinHeader;
