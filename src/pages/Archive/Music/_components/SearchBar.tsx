import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

const SearchBar = ({ value, onChange, placeholder, leftIcon, rightIcon, onRightIconClick }: SearchBarProps) => (
  <div className="bg-[#E9E9E9] rounded-[10px] flex items-center px-[16px] py-[4px] relative">
    {leftIcon && <span className="mr-[10px] max-w-[24px] max-h-[24px]">{leftIcon}</span>}
    <input
      className="text-[#71717A] text-left text-hakgyo-r-14 bg-transparent outline-none focus:outline-none flex-1 border-none pr-[48px]"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {rightIcon && (
      <span 
        className="cursor-pointer w-[10vw] h-[10vw] max-w-[40px] max-h-[40px]"
        onClick={onRightIconClick}
      >
        {rightIcon}
      </span>
    )}
  </div>
);

export default SearchBar;