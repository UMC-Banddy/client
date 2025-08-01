import CheckBox from "./CheckBox";

interface RecruitChatProps {
  enableCheck?: boolean;
  checked?: boolean;
  onCheck?: () => void;
  name?: string;
  thumbnail?: string | null;
  isOnlyName?: boolean;
}

/**
 *
 * @param [isOnlyName] - 이름만 표시 (default: false)
 * @returns
 */
const RecruitChat = ({
  enableCheck = false,
  checked = false,
  onCheck,
  name,
  thumbnail,
  isOnlyName = false,
}: RecruitChatProps) => {
  return (
    <div className="flex items-center w-full">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-[12px]">
          <div
            className="size-[50px] rounded-full bg-[#777] bg-cover bg-center"
            style={{ backgroundImage: `url(${thumbnail})` }}
          ></div>
          <div className="flex flex-col gap-[4px]">
            <p className="text-hakgyo-b-17 text-[#fff]">{name}</p>
            {!isOnlyName && (
              <p className="w-[233px] text-hakgyo-r-14 text-[#CACACA] line-clamp-1">
                아 뭔가 이상한데 지원 안할래요 취소sdafsdfafsdasadfasdfsadf
              </p>
            )}
          </div>
        </div>

        {enableCheck ? (
          <CheckBox checked={checked} onClick={onCheck!} />
        ) : (
          <p className="text-hakgyo-r-14 text-[#959595]">16:39</p>
        )}
      </div>
    </div>
  );
};

export default RecruitChat;
