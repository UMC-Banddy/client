import React from "react";

interface Genre {
  id: string;
  name: string;
  icon: string;
}

interface GenreSectionProps {
  genres: Genre[];
  onEdit?: () => void;
  onRemoveGenre?: (genreId: string) => void;
}

const GenreSection: React.FC<GenreSectionProps> = ({
  genres,
  onEdit,
  onRemoveGenre,
}) => {
  return (
    <div className="mb-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-white">
          관심 장르
        </h3>
        <button
          onClick={onEdit}
          className="text-[#B71C1C] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium hover:text-red-400 transition-colors"
        >
          수정
        </button>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-6 lg:py-4 xl:px-7 xl:py-5 2xl:px-8 2xl:py-6 bg-black text-white rounded-full text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl border border-white"
          >
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
              {genre.icon}
            </span>
            <span>{genre.name}</span>
            <button
              onClick={() => onRemoveGenre?.(genre.id)}
              className="ml-1 sm:ml-2 md:ml-3 lg:ml-4 xl:ml-5 2xl:ml-6 hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8"
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
      </div>
    </div>
  );
};

export default GenreSection;
