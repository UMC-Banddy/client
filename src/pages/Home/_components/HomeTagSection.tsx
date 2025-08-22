import TagList from "./TagList";

interface HomeTagSectionProps {
  tags: string[];
  userSessions?: string[]; // 사용자 세션 정보 추가
}

const HomeTagSection = ({ tags, userSessions = [] }: HomeTagSectionProps) => {
  return (
    <div className="flex flex-nowrap overflow-x-auto gap-x-3 w-full max-w-full px-1 py-2 mb-0 scrollbar-hide pl-6 pr-6">
      <TagList tags={tags} variant="home" userSessions={userSessions} />
    </div>
  );
};

export default HomeTagSection;
