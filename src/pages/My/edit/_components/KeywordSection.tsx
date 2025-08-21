import React, { useState } from "react";

interface Keyword {
  id: string;
  text: string;
  category: string;
}

interface KeywordSectionProps {
  keywords: Keyword[];
  onKeywordsChange?: (keywords: Keyword[]) => void;
}

const KeywordSection: React.FC<KeywordSectionProps> = ({
  keywords = [],
  onKeywordsChange,
}) => {
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [customKeyword, setCustomKeyword] = useState("");

  // 카테고리별 키워드 데이터
  const keywordCategories = {
    manner: [
      "미리 조율해요",
      "약속 잘 지켜요", 
      "연락이 빨라요",
      "연습 꼭 해와요",
      "일찍 가서 세팅해요"
    ],
    skill: [
      "편곡 가능해요",
      "코드 잘 따요"
    ],
    tendency: [
      "자유로운 분위기 선호",
      "프로같은 분위기 선호"
    ],
    frequency: [
      "한 달에 한 번 이하",
      "격주",
      "매주", 
      "주 2회",
      "주 3회 이상"
    ]
  };

  const handleAddKeyword = () => {
    setShowKeywordModal(true);
  };

  const handleKeywordToggle = (keywordText: string, category: string) => {
    const existingKeyword = keywords.find(k => k.text === keywordText);
    
    if (existingKeyword) {
      // 키워드 제거
      const newKeywords = keywords.filter(k => k.text !== keywordText);
      onKeywordsChange?.(newKeywords);
    } else {
      // 키워드 추가 (최대 8개)
      if (keywords.length < 8) {
        const newKeyword: Keyword = {
          id: Date.now().toString(),
          text: keywordText,
          category
        };
        const newKeywords = [...keywords, newKeyword];
        onKeywordsChange?.(newKeywords);
      }
    }
  };

  const handleAddCustomKeyword = () => {
    if (customKeyword.trim() && keywords.length < 8) {
      const newKeyword: Keyword = {
        id: Date.now().toString(),
        text: customKeyword.trim(),
        category: "custom"
      };
      const newKeywords = [...keywords, newKeyword];
      onKeywordsChange?.(newKeywords);
      setCustomKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordId: string) => {
    const newKeywords = keywords.filter(k => k.id !== keywordId);
    onKeywordsChange?.(newKeywords);
  };

  return (
    <div className="mb-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-white mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9">
        키워드
      </h3>

      {/* 선택된 키워드 표시 */}
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 pb-4">
        {keywords.map((keyword) => (
          <div
            key={keyword.id}
            className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-6 lg:py-4 xl:px-7 xl:py-5 2xl:px-8 2xl:py-6 bg-black text-white rounded-full text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl border border-white"
          >
            <span>{keyword.text}</span>
            <button
              onClick={() => handleRemoveKeyword(keyword.id)}
              className="hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
        
        {/* 키워드 추가 버튼 */}
        <button
          onClick={handleAddKeyword}
          className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-6 lg:py-4 xl:px-7 xl:py-5 2xl:px-8 2xl:py-6 bg-gray-600 text-white rounded-full text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl border border-gray-500 hover:bg-gray-700 transition-colors"
        >
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">➕</span>
          <span>키워드 추가</span>
        </button>
      </div>

      {/* 키워드 선택 모달 */}
      <KeywordSelectionModal
        isOpen={showKeywordModal}
        onClose={() => setShowKeywordModal(false)}
        onKeywordToggle={handleKeywordToggle}
        onAddCustomKeyword={handleAddCustomKeyword}
        customKeyword={customKeyword}
        setCustomKeyword={setCustomKeyword}
        keywordCategories={keywordCategories}
        selectedKeywords={keywords}
      />
    </div>
  );
};

// 키워드 선택 모달 컴포넌트
interface KeywordSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeywordToggle: (keywordText: string, category: string) => void;
  onAddCustomKeyword: () => void;
  customKeyword: string;
  setCustomKeyword: (keyword: string) => void;
  keywordCategories: Record<string, string[]>;
  selectedKeywords: Keyword[];
}

const KeywordSelectionModal: React.FC<KeywordSelectionModalProps> = ({
  isOpen,
  onClose,
  onKeywordToggle,
  onAddCustomKeyword,
  customKeyword,
  setCustomKeyword,
  keywordCategories,
  selectedKeywords,
}) => {
  if (!isOpen) return null;

  const isKeywordSelected = (keywordText: string) => {
    return selectedKeywords.some(k => k.text === keywordText);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-gray-300 rounded-t-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-1 bg-gray-400 rounded-full mx-auto mb-4"></div>
        <h3 className="text-gray-700 text-lg font-medium mb-4 text-center">
          키워드 추가
        </h3>

        {/* 상단 정보 */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700 text-sm">
            최대 8개의 키워드 등록이 가능합니다.
          </span>
          <span className="text-gray-700 text-sm">
            {selectedKeywords.length}/8
          </span>
        </div>

        {/* 직접 입력 키워드 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              value={customKeyword}
              onChange={(e) => setCustomKeyword(e.target.value)}
              placeholder="이곳에 키워드를 직접 입력해보세요."
              className="flex-1 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500"
              maxLength={10}
            />
            <span className="text-gray-700 text-sm">
              {customKeyword.length}/10
            </span>
            <button
              onClick={onAddCustomKeyword}
              disabled={!customKeyword.trim() || selectedKeywords.length >= 8}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              추가
            </button>
          </div>
        </div>

        {/* 카테고리별 키워드 */}
        <div className="space-y-6">
          {/* 매너 */}
          <div>
            <h4 className="text-gray-700 text-base font-medium mb-3">
              매너
            </h4>
            <div className="flex flex-wrap gap-2">
              {keywordCategories.manner.map((keyword) => {
                const selected = isKeywordSelected(keyword);
                return (
                  <button
                    key={keyword}
                    onClick={() => onKeywordToggle(keyword, "manner")}
                    className={`px-3 py-2 rounded-full text-sm transition-colors ${
                      selected
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {keyword}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 스킬 */}
          <div>
            <h4 className="text-gray-700 text-base font-medium mb-3">
              스킬
            </h4>
            <div className="flex flex-wrap gap-2">
              {keywordCategories.skill.map((keyword) => {
                const selected = isKeywordSelected(keyword);
                return (
                  <button
                    key={keyword}
                    onClick={() => onKeywordToggle(keyword, "skill")}
                    className={`px-3 py-2 rounded-full text-sm transition-colors ${
                      selected
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {keyword}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 성향 */}
          <div>
            <h4 className="text-gray-700 text-base font-medium mb-3">
              성향
            </h4>
            <div className="flex flex-wrap gap-2">
              {keywordCategories.tendency.map((keyword) => {
                const selected = isKeywordSelected(keyword);
                return (
                  <button
                    key={keyword}
                    onClick={() => onKeywordToggle(keyword, "tendency")}
                    className={`px-3 py-2 rounded-full text-sm transition-colors ${
                      selected
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {keyword}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 가능한 합주 주기 */}
          <div>
            <h4 className="text-gray-700 text-base font-medium mb-3">
              가능한 합주 주기
            </h4>
            <div className="flex flex-wrap gap-2">
              {keywordCategories.frequency.map((keyword) => {
                const selected = isKeywordSelected(keyword);
                return (
                  <button
                    key={keyword}
                    onClick={() => onKeywordToggle(keyword, "frequency")}
                    className={`px-3 py-2 rounded-full text-sm transition-colors ${
                      selected
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {keyword}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default KeywordSection;
