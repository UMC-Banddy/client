import clsx from "clsx";
import { type ButtonHTMLAttributes } from "react";

interface JobInfoBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
}

const JobInfoBtn = ({ isActive = false, ...props }: JobInfoBtnProps) => {
  return (
    <button
      className={clsx(
        "px-[11px] h-[35px] rounded-[24px] cursor-pointer hakgyo-r-16 text-[#fff] border-1",
        isActive
          ? "border-transparent bg-[#555]"
          : "border-[#E9E9E9] bg-transparent"
      )}
      {...props}
    ></button>
  );
};

export default JobInfoBtn;
