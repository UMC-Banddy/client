type ProfileTagListProps = {
  tags: string[];
};

export default function ProfileTagList({ tags }: ProfileTagListProps) {
  return (
    <div className="flex flex-wrap gap-[1vw] mb-[3vh]">
      {tags.map((tag: string, i: number) => (
        <span key={i} className="bg-[#292929] text-white rounded-full px-[3vw] py-[0.9vh] text-hakgyo-r-14">{tag}</span>
      ))}
    </div>
  );
}