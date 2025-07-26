type Genre = {
  icon: string;
  label: string;
};

type ProfileGenreListProps = {
  genres: Genre[];
};

export default function ProfileGenreList({ genres }: ProfileGenreListProps) {
  return (
    <>
      <div className="text-hakgyo-b-17 bg-black text-white mb-[1.4vh] inline-block">관심 장르</div>
      <div className="flex gap-[1vw] mb-[3vh] flex-wrap">
        {genres.map((g: Genre, i: number) => (
          <span key={i} className="bg-[#292929] text-white rounded-full px-[3vw] py-[0.9vh] flex items-center text-hakgyo-r-14">{g.icon} {g.label}</span>
        ))}
      </div>
    </>
  );
}