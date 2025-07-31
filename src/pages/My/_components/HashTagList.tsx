interface HashtagListProps {
  tags: string[];
  className?: string;
}

const HashtagList: React.FC<HashtagListProps> = ({ tags, className }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <div className={`flex flex-wrap px-[24px] gap-[8px] mb-[5vh] w-full ${className || ""}`}>
      {tags.map((tag, i) => (
        <span
          key={i}
          className="flex items-center justify-center rounded-full bg-[#555555] text-[#E9E9E9] text-hakgyo-r-14 px-[12px] py-[6px]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default HashtagList; 