import React, { useState } from "react";
import { genres as availableGenres } from "@/pages/Join/_constants/genres";

interface Genre {
  id: string;
  name: string;
  icon: string;
}

interface GenreSectionProps {
  genres: Genre[];
  onEdit?: () => void;
  onRemoveGenre?: (genreId: string) => void;
  onAddGenre?: (genre: Genre) => void;
  isEditing?: boolean;
}

const GenreSection: React.FC<GenreSectionProps> = ({
  genres,
  onEdit,
  onRemoveGenre,
  onAddGenre,
  isEditing = false,
}) => {
  const [showGenreModal, setShowGenreModal] = useState(false);

  const handleAddGenre = () => {
    if (isEditing) {
      setShowGenreModal(true);
    }
  };

  const handleGenreSelect = (genre: { id: number; content: string; text: string }) => {
    const newGenre: Genre = {
      id: genre.id.toString(),
      name: genre.text,
      icon: genre.content.split(" ")[0], // 이모지 부분만 추출
    };
    
    // 이미 존재하는지 확인
    const exists = genres.some(g => g.name === newGenre.name);
    if (!exists) {
      onAddGenre?.(newGenre);
    }
    
    setShowGenreModal(false);
  };

  return (
    <div className="mb-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-white">
          관심 장르
        </h3>
        <button
          onClick={onEdit}
          className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium transition-colors ${
            isEditing
              ? "text-green-500 hover:text-green-400"
              : "text-[#B71C1C] hover:text-red-400"
          }`}
        >
          {isEditing ? "완료" : "수정"}
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 pb-4">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-6 lg:py-4 xl:px-7 xl:py-5 2xl:px-8 2xl:py-6 bg-black text-white rounded-full text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl border border-white"
          >
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
              {genre.icon}
            </span>
            <span>{genre.name}</span>
            {isEditing && (
              <button
                onClick={() => onRemoveGenre?.(genre.id)}
                className="ml-2 sm:ml-3 md:ml-4 lg:ml-5 xl:ml-6 2xl:ml-7 hover:text-gray-300 transition-colors"
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
        
        {/* 장르 추가 버튼 */}
        {isEditing && (
          <button
            onClick={handleAddGenre}
            className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-6 lg:py-4 xl:px-7 xl:py-5 2xl:px-8 2xl:py-6 bg-gray-600 text-white rounded-full text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl border border-gray-500 hover:bg-gray-700 transition-colors"
          >
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">➕</span>
            <span>장르 추가</span>
          </button>
        )}
      </div>

      {/* 장르 선택 모달 */}
      <GenreSelectionModal
        isOpen={showGenreModal}
        onClose={() => setShowGenreModal(false)}
        onGenreSelect={handleGenreSelect}
        availableGenres={availableGenres}
        selectedGenres={genres}
      />
    </div>
  );
};

// 장르 선택 모달 컴포넌트
interface GenreSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenreSelect: (genre: { id: number; content: string; text: string }) => void;
  availableGenres: Array<{ id: number; content: string; text: string }>;
  selectedGenres: Genre[];
}

const GenreSelectionModal: React.FC<GenreSelectionModalProps> = ({
  isOpen,
  onClose,
  onGenreSelect,
  availableGenres,
  selectedGenres,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-gray-300 rounded-t-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-1 bg-gray-400 rounded-full mx-auto mb-4"></div>
        <h3 className="text-gray-700 text-lg font-medium mb-4 text-center">
          장르 선택
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {availableGenres.map((genre) => {
            const isSelected = selectedGenres.some(g => g.name === genre.text);
            return (
              <button
                key={genre.id}
                onClick={() => onGenreSelect(genre)}
                disabled={isSelected}
                className={`w-full p-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
                  isSelected 
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-2xl mb-1">{genre.content.split(" ")[0]}</span>
                <span className="text-xs text-center">{genre.text}</span>
              </button>
            );
          })}
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

export default GenreSection;
