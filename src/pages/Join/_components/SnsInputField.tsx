import JoinInputField from "./JoinInputField";
import type { InputHTMLAttributes } from "react";
import deleteIcon from "@/assets/icons/join/ic_delete_btn.svg";

interface SnsInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: string;
  value: string;
  onDelete: () => void;
}

const SnsInputField = ({
  icon,
  value,
  onDelete,
  ...props
}: SnsInputFieldProps) => {
  return (
    <div className="flex flex-col">
      <img src={icon} alt="youtube" className="size-[35px]" />
      <div className="flex">
        <JoinInputField
          type="text"
          placeholder="이곳에 링크를 붙여넣기 하세요."
          className="w-full h-full bg-transparent border-none text-hakgyo-r-16 text-[#959595] focus:outline-none"
          value={value}
          {...props}
        />
        <button className={value ? "" : "opacity-0"} onClick={onDelete}>
          <img src={deleteIcon} alt="delete" className="size-[36px]" />
        </button>
      </div>
    </div>
  );
};

export default SnsInputField;
