import CheckBox from "./CheckBox";

interface RecruitChatProps {
  enableCheck?: boolean;
  checked?: boolean;
  onCheck?: () => void;
}

const RecruitChat = ({
  enableCheck = false,
  checked = false,
  onCheck,
}: RecruitChatProps) => {
  return (
    <div className="flex items-center w-full">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-[12px]">
          <div className="size-[50px] rounded-full bg-[#777]"></div>
          <div className="flex flex-col gap-[4px]">
            <p className="text-hakgyo-b-17 text-[#fff]">noko</p>
            <p className="w-[233px] text-hakgyo-r-14 text-[#CACACA] line-clamp-1">
              아 뭔가 이상한데 지원 안할래요 취소sdafsdfafsdasadfasdfsadf
            </p>
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
