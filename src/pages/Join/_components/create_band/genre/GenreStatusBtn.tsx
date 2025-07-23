import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import cancelIcon from "@/assets/icons/join/ic_cancel.svg";

const GenreStatusBtn = ({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={clsx(
        "flex flex-shrink-0 justify-center items-center h-[38px] px-[12px] text-hakgyo-r-16 border-[1.4px] rounded-[76px] cursor-pointer border-[#E9E9E9] bg-[#D13D55] text-[#fff]"
      )}
      {...props}
    >
      {children}
      <img src={cancelIcon} alt="X" className="size-[26px]" />
    </button>
  );
};

export default GenreStatusBtn;
