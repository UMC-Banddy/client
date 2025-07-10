import React from "react";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const CustomButton = ({
  children,
  className = "",
  ...props
}: CustomButtonProps) => {
  return (
    <button
      {...props}
      className={`w-full max-w-xs md:max-w-sm px-6 py-2 rounded-full bg-[#DF0001] text-white font-bold text-base md:text-lg shadow-md hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500 ${className}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;
