import React, { useState, useEffect, useRef } from "react";
import { musicAPI } from "@/api/API";
import type { AutocompleteResult } from "@/api/API";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSelect?: (item: AutocompleteResult) => void;
  onAutocompleteResults?: (results: AutocompleteResult[]) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "아티스트 검색하기",
  onSearch,
  onSelect,
  onAutocompleteResults,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  // const [autocompleteResults, setAutocompleteResults] = useState<
  //   AutocompleteResult[]
  // >([]);
  // const [showAutocomplete, setShowAutocomplete] = useState(false);
  // const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 자동완성 데이터 가져오기
  const fetchAutocomplete = async (query: string) => {
    if (query.trim().length < 2) {
      // setAutocompleteResults([]);
      // setShowAutocomplete(false);
      return;
    }

    try {
      // setLoading(true);
      // 자동완성 API 사용
      const results = await musicAPI.getAutocomplete(query, 20);
      // setAutocompleteResults(results);
      // setShowAutocomplete(results.length > 0);
      // 부모 컴포넌트에 자동완성 결과 전달
      onAutocompleteResults?.(results);
    } catch (error) {
      console.error("자동완성 조회 실패:", error);
      // setAutocompleteResults([]);
      // setShowAutocomplete(false);
      // 빈 결과도 부모 컴포넌트에 전달
      onAutocompleteResults?.([]);
    } finally {
      // setLoading(false);
    }
  };

  // 검색 입력 처리 (즉시 API 호출)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);

    // 빈 쿼리인 경우에도 부모 컴포넌트에 알림 (SEARCH_ALL API 호출을 위해)
    if (!query.trim()) {
      // setAutocompleteResults([]);
      // setShowAutocomplete(false);
      onAutocompleteResults?.([]);
      return;
    }

    // 즉시 자동완성 요청
    fetchAutocomplete(query);
  };

  // 자동완성 아이템 선택
  // const handleSelectItem = (item: AutocompleteResult) => {
  //   setSearchQuery(item.name);
  //   setShowAutocomplete(false);
  //   onSelect?.(item);
  // };

  // 외부 클릭 시 자동완성 닫기
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       containerRef.current &&
  //       !containerRef.current.contains(event.target as Node)
  //     ) {
  //       setShowAutocomplete(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // 타이머 관련 코드 제거

  return (
    <div className={`relative ${className}`} ref={containerRef}>
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

      {/* 자동완성 드롭다운 제거 - 메인 컨텐츠에서 동그라미 그리드로 표시 */}
    </div>
  );
};

export default SearchBar;
