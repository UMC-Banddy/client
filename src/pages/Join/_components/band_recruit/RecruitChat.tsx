import clsx from "clsx";
import CheckBox from "./CheckBox";
import { useNavigate } from "react-router-dom";

interface RecruitChatProps {
  roomId?: number;
  enableCheck?: boolean;
  checked?: boolean;
  onCheck?: () => void;
  name?: string;
  thumbnail?: string | null;
  content?: string;
  lastMessageAt?: string | null;
  passFail?: string;
  isOnlyName?: boolean;
}

/**
 *
 * @param [isOnlyName] - 이름만 표시 (default: false)
 * @returns
 */
const RecruitChat = ({
  roomId,
  enableCheck = false,
  checked = false,
  onCheck,
  name,
  thumbnail,
  content,
  lastMessageAt,
  passFail,
  isOnlyName = false,
}: RecruitChatProps) => {
  const navigate = useNavigate();

  const renderPassFail = () => {
    let text = "";
    if (passFail === "PASS") {
      text = "합격";
    } else if (passFail === "FAIL") {
      text = "불합격";
    }

    if (passFail === "PENDING") {
      return null;
    }
    return (
      <div
        className={clsx(
          "flex items-center justify-center w-[34px] h-[16px] rounded-[100px] text-wanted-sb-10 text-[#292929]",
          passFail === "PASS" ? "bg-[#79D000]" : "bg-[#F05A02]"
        )}
      >
        {text}
      </div>
    );
  };

  return (
    <button
      className="flex items-center w-full"
      onClick={() => {
        if (!isOnlyName) {
          navigate(`/home/private-chat?roomId=${roomId}&roomType=BAND-MANAGER`);
        }
      }}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-[12px]">
          <div
            className="size-[50px] rounded-full bg-[#777] bg-cover bg-center"
            style={{ backgroundImage: `url(${thumbnail})` }}
          ></div>
          <div className="flex flex-col gap-[4px]">
            <p className="flex gap-[4px] text-hakgyo-b-17 text-[#fff]">
              {passFail && renderPassFail()} {name}
            </p>
            {!isOnlyName && (
              <p className="w-[233px] text-hakgyo-r-14 text-[#CACACA] line-clamp-1">
                {content}
              </p>
            )}
          </div>
        </div>

        {enableCheck ? (
          <CheckBox checked={checked} onClick={onCheck!} />
        ) : (
          <p className="text-hakgyo-r-14 text-[#959595]">{lastMessageAt}</p>
        )}
      </div>
    </button>
  );
};

export default RecruitChat;
