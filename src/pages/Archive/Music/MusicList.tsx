interface MusicListProps {
  items: Array<{ image: string; title: string; subtitle: string }>;
}

export default function MusicList({ items }: MusicListProps) {
  return (
    <div className="flex flex-col gap-x-[16px] gap-y-[12px] mb-[4vh]">
      {items.map((item, i) => (
        <div key={i} className="flex items-center">
          <img src={item.image} alt={item.title} className="w-[14vw] h-[14vw] object-cover mr-[16px] max-w-[55px] max-h-[55px]" />
          <div className="flex-1">
            <div className="text-hakgyo-r-16 text-[#FFFFFF]">{item.title}</div>
            <div className="text-hakgyo-r-14 text-[#CACACA]">{item.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 