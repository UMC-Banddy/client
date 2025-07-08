import React from "react";
import whiteStar from "@/assets/logos/white-star.svg";

interface JoinButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const JoinButton = ({
  className = "",
  children = "JOIN",
  ...props
}: JoinButtonProps) => (
  <button
    {...props}
    className={`flex items-center gap-2 px-5 py-2 rounded-full bg-[#DF0001] text-white font-bold text-base shadow-md hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500 ${className}`}
  >
    <img src={whiteStar} alt="join" width={20} height={20} className="-ml-1" />
    {children}
  </button>
);

export default JoinButton;
