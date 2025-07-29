import React, { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "아티스트 검색하기",
  onSearch,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 sm:px-5 sm:py-3.5 sm:pl-14 md:px-6 md:py-4 md:pl-16 lg:px-8 lg:py-4.5 lg:pl-20 xl:px-10 xl:py-5 xl:pl-24 2xl:px-12 2xl:py-5.5 2xl:pl-28 bg-white text-gray-800 placeholder-[#888] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl border border-[#ddd] focus:outline-none focus:border-[#7ED957] transition-colors text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl"
        />
        <div className="absolute left-4 sm:left-5 md:left-6 lg:left-8 xl:left-10 2xl:left-12 top-1/2 transform -translate-y-1/2">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-[#888]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
