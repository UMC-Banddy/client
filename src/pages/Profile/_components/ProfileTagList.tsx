type ProfileTagListProps = {
  tags: string[];
};

export default function ProfileTagList({ tags }: ProfileTagListProps) {
  return (
    <div className="flex flex-wrap gap-[4px] mb-[3vh]">
      {tags.map((tag: string, i: number) => (
        <span key={i} className="bg-[#292929] text-white rounded-full px-[12px] py-[8.5px] text-hakgyo-r-14">{tag}</span>
      ))}
    </div>
  );
}