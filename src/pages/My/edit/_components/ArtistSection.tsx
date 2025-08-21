import React from "react";

interface Artist {
  id: string;
  name: string;
  imageUrl: string;
}

interface ArtistSectionProps {
  artists: Artist[];
  onEdit?: () => void;
  onRemoveArtist?: (artistId: string) => void;
}

const ArtistSection: React.FC<ArtistSectionProps> = ({
  artists,
  onEdit,
  onRemoveArtist,
}) => {
  return (
    <div className="mb-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-white">
          관심 아티스트
        </h3>
        <button
          onClick={onEdit}
          className="text-[#B71C1C] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium hover:text-red-400 transition-colors"
        >
          수정
        </button>
      </div>
      <div className="flex gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10 2xl:gap-11">
        {artists.map((artist) => (
          <div key={artist.id} className="text-center">
            <div className="relative inline-block">
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 rounded-full object-cover mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8"
              />
              <button
                onClick={() => onRemoveArtist?.(artist.id)}
                className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 bg-[#B71C1C] rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-white"
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
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-white font-medium">
              {artist.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistSection;
