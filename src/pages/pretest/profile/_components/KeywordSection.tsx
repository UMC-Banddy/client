import React, { useState } from "react";

interface Keyword {
  id: string;
  text: string;
  category: string;
}

interface KeywordSectionProps {
  keywords: Keyword[];
  onRemoveKeyword?: (keywordId: string) => void;
  isEditing?: boolean;
  onEdit?: () => void;
}

const KeywordSection: React.FC<KeywordSectionProps> = ({
  keywords,
  onRemoveKeyword,
  isEditing = false,
  onEdit,
}) => {
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [inputKeyword, setInputKeyword] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<Keyword[]>(keywords);

  const keywordCategories = {
    manner: [
      "미리 조율해요",
      "약속 잘 지켜요",
      "연락이 빨라요",
      "연습 꼭 해와요",
      "일찍 가서 세팅해요",
    ],
    skill: ["편곡 가능해요", "코드 잘 따요"],
    tendency: ["자유로운 분위기 선호", "프로같은 분위기 선호"],
    frequency: ["한 달에 한 번 이하", "격주", "매주", "주 2회", "주 3회 이상"],
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      setShowKeywordModal(true);
    }
  };

  const handleKeywordToggle = (keywordText: string, category: string) => {
    const existingKeyword = selectedKeywords.find(
      (k) => k.text === keywordText
    );

    if (existingKeyword) {
      setSelectedKeywords((prev) =>
        prev.filter((k) => k.id !== existingKeyword.id)
      );
    } else {
      if (selectedKeywords.length < 8) {
        const newKeyword: Keyword = {
          id: Date.now().toString(),
          text: keywordText,
          category,
        };
        setSelectedKeywords((prev) => [...prev, newKeyword]);
      }
    }
  };

  const handleAddCustomKeyword = () => {
    if (inputKeyword.trim() && selectedKeywords.length < 8) {
      const newKeyword: Keyword = {
        id: Date.now().toString(),
        text: inputKeyword.trim(),
        category: "custom",
      };
      setSelectedKeywords((prev) => [...prev, newKeyword]);
      setInputKeyword("");
    }
  };

  const handleSave = () => {
    // 키워드 저장 로직
    console.log("선택된 키워드:", selectedKeywords);
    setShowKeywordModal(false);
  };

  const isKeywordSelected = (keywordText: string) => {
    return selectedKeywords.some((k) => k.text === keywordText);
  };

  return (
    <div className="mb-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-white">
          나를 표현하는 키워드
        </h3>
        <button
          onClick={handleEdit}
          className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium transition-colors ${
            isEditing
              ? "text-green-500 hover:text-green-400"
              : "text-[#B71C1C] hover:text-red-400"
          }`}
        >
          {isEditing ? "완료" : "수정"}
        </button>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 flex-1 pb-4">
          {keywords.map((keyword) => (
            <div
              key={keyword.id}
              className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-6 lg:py-4 xl:px-7 xl:py-5 2xl:px-8 2xl:py-6 bg-black text-white rounded-full text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl border border-white"
            >
              <span>{keyword.text}</span>
              {isEditing && (
                <button
                  onClick={() => onRemoveKeyword?.(keyword.id)}
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
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleEdit}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 2xl:w-22 2xl:h-22 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors flex-shrink-0"
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>

      {/* 키워드 선택 모달 */}
      {showKeywordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-gray-300 rounded-t-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <div className="w-12 h-1 bg-gray-400 rounded-full mx-auto mb-4"></div>

            {/* 상단 섹션 */}
            <div className="mb-6">
              <p className="text-gray-700 text-sm mb-2">
                최대 8개의 키워드 등록이 가능합니다.
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={inputKeyword}
                  onChange={(e) => setInputKeyword(e.target.value)}
                  placeholder="이곳에 키워드를 직접 입력해보세요."
                  className="flex-1 px-3 py-2 bg-white rounded-lg text-gray-700 text-sm"
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddCustomKeyword()
                  }
                />
                <span className="text-gray-700 text-sm flex items-center px-2">
                  {selectedKeywords.length}/8
                </span>
              </div>
              <button
                onClick={handleAddCustomKeyword}
                className="w-full py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
              >
                추가
              </button>
            </div>

            {/* 매너 섹션 */}
            <div className="mb-6">
              <h4 className="font-bold text-black text-base mb-3">매너</h4>
              <div className="flex flex-wrap gap-2">
                {keywordCategories.manner.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => handleKeywordToggle(keyword, "manner")}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      isKeywordSelected(keyword)
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* 스킬 섹션 */}
            <div className="mb-6">
              <h4 className="font-bold text-black text-base mb-3">스킬</h4>
              <div className="flex flex-wrap gap-2">
                {keywordCategories.skill.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => handleKeywordToggle(keyword, "skill")}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      isKeywordSelected(keyword)
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* 성향 섹션 */}
            <div className="mb-6">
              <h4 className="font-bold text-black text-base mb-3">성향</h4>
              <div className="flex flex-wrap gap-2">
                {keywordCategories.tendency.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => handleKeywordToggle(keyword, "tendency")}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      isKeywordSelected(keyword)
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* 가능한 합주 주기 섹션 */}
            <div className="mb-6">
              <h4 className="font-bold text-black text-base mb-3">
                가능한 합주 주기
              </h4>
              <div className="flex flex-wrap gap-2">
                {keywordCategories.frequency.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => handleKeywordToggle(keyword, "frequency")}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      isKeywordSelected(keyword)
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* 저장 버튼 */}
            <button
              onClick={handleSave}
              className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordSection;
