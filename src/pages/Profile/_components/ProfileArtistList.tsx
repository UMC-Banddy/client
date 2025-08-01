type Artist = {
  image: string;
  name: string;
};

type ProfileArtistListProps = {
  artists: Artist[];
};

export default function ProfileArtistList({ artists }: ProfileArtistListProps) {
  return (
    <>
      <div className="text-hakgyo-b-17 bg-black text-white mb-[1.4vh] inline-block">관심 아티스트</div>
      <div className="w-full overflow-hidden">
        <div className="flex gap-[12px] mb-[3vh] overflow-x-auto scrollbar-hide">
          {artists.map((a: Artist, i: number) => (
            <div key={i} className="flex flex-col items-center flex-shrink-0">
              <img src={a.image} alt={a.name} className="w-[17vw] h-[17vw] rounded-full object-cover mb-[0.4vh] max-w-[68px] max-h-[68px]" />
              <span className="text-black text-wanted-sb-12 text-center max-w-[55px] whitespace-normal break-keep">{a.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}