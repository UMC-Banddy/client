import React from 'react';

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  bgColor?: string; // 배경색 커스텀
  textColor?: string; // 글자색 커스텀
  fontSize?: string; // 폰트 크기 커스텀
  fontWeight?: string; // 폰트 굵기 커스텀
  rounded?: string; // 라운드 커스텀
  padding?: string; // 패딩 커스텀
}

const CustomButton = ({
  children,
  className = '',
  bgColor = 'bg-[#DF0001]',
  textColor = 'text-white',
  fontSize = 'text-base md:text-lg',
  fontWeight = 'font-bold',
  rounded = 'rounded-full',
  padding = 'px-6 py-2',
  ...props
}: CustomButtonProps) => {
  return (
    <button
      {...props}
      className={`w-auto min-w-0 max-w-none ${padding} ${rounded} ${bgColor} ${textColor} ${fontWeight} ${fontSize} shadow-md hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis ${className}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;
