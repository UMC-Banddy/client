import type { ChangeEvent } from "react";
import downArrow from "@/assets/icons/join/ic_down_arrow.svg";

type SelectWithArrowProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  postfix?: string;
};

const SelectWithArrow = ({
  value,
  onChange,
  options,
  postfix = "",
}: SelectWithArrowProps) => (
  <div className="relative inline-block">
    <select
      className="pl-[12px] pr-[43px] h-[48px] rounded-[5px] border-[1.5px] border-[#E9E9E9] bg-[#121212] text-hakgyo-r-16 text-[#fff] appearance-none"
      value={value}
      onChange={onChange}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
          {postfix}
        </option>
      ))}
    </select>
    <img
      src={downArrow}
      alt=""
      className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 size-[23px]"
    />
  </div>
);

export default SelectWithArrow;
