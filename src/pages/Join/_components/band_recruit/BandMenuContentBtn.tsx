import clsx from "clsx";
import { type ButtonHTMLAttributes } from "react";

interface BandMenuContentBtnProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  radius?: "top" | "bottom" | "none";
}

const BandMenuContentBtn = ({
  radius = "none",
  ...props
}: BandMenuContentBtnProps) => {
  return (
    <button
      className={clsx(
        "py-[20px] pl-[12px] w-[150px] h-[55px] border-none bg-[#E9E9E9] text-hakgyo-r-14 text-start cursor-pointer",
        radius === "top" && "rounded-t-[8px]",
        radius === "bottom" && "rounded-b-[8px]"
      )}
      {...props}
    ></button>
  );
};

export default BandMenuContentBtn;
