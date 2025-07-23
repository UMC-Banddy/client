import Search from "@/assets/icons/archive/redsearch.svg";

interface SuggestionListProps {
  suggestions: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export default function SuggestionList({ suggestions, onSuggestionClick }: SuggestionListProps) {
  if (!suggestions.length) return null;
  return (
    <div className="mt-[1.4vh]">
      {suggestions.map((s, i) => (
        <div
          key={i}
          className="flex items-center w-[87vw] h-[5.7vh] py-[1.4vh] text-hakgyo-r-16 text-white cursor-pointer"
          onClick={onSuggestionClick ? () => onSuggestionClick(s) : undefined}
        >
          <img src={Search} alt="search" className="w-[6vw] h-[6vw] mr-[4vw]" />
          {s}
        </div>
      ))}
    </div>
  );
}
