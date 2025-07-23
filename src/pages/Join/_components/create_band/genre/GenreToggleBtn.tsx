import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface GenreToggleBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  toggled?: boolean;
}

const GenreToggleBtn = ({ toggled = false, ...props }: GenreToggleBtnProps) => {
  return (
    <button
      className={clsx(
        "flex justify-center items-center h-[46px] px-[20px] text-hakgyo-b-17 border-[1.4px] rounded-[76px] cursor-pointer",
        toggled
          ? "border-[#555] bg-[#121212] text-[#555]"
          : "border-[#CACACA] bg-[#292929] text-[#E9E9E9]"
      )}
      {...props}
    ></button>
  );
};

export default GenreToggleBtn;
