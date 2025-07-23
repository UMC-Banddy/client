import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  className?: string;
}

const SearchBar = ({ value, onChange, placeholder, leftIcon, rightIcon, onRightIconClick, className = "" }: SearchBarProps) => (
  <div className={`bg-[#E9E9E9] rounded-[10px] flex items-center px-[4vw] py-[1vh] relative ${className}`}>
    {leftIcon && <span className="mr-[2.5vw]">{leftIcon}</span>}
    <input
      className="text-[#71717A] text-left text-hakgyo-r-14 bg-transparent outline-none focus:outline-none flex-1 border-none pr-[12vw]"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {rightIcon && (
      <span 
        className="absolute right-[2vw] top-1/2 -translate-y-1/2 cursor-pointer"
        onClick={onRightIconClick}
      >
        {rightIcon}
      </span>
    )}
  </div>
);

export default SearchBar;