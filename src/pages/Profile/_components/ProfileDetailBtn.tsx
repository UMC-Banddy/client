import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface ProfileDetailBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "red" | "gray";
}

const ProfileDetailBtn = ({ color, className, ...props }: ProfileDetailBtnProps) => {
  return (
    <button
      className={clsx(
        "w-[26vw] h-[10vw] border-none rounded-[50px] text-wanted-sb-13 whitespace-nowrap cursor-pointer max-w-[105px] max-h-[40px] flex items-center justify-center",
        className,
        {
          "bg-[#B42127] text-[#fff]": color === "red",
          "bg-[#959595] text-[#000000]": color === "gray",
        }
      )}
      {...props}
    ></button>
  );
};

export default ProfileDetailBtn;
