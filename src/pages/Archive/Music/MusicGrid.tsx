interface MusicGridProps {
  items: Array<{ image: string; title: string; subtitle: string }>;
}

export default function MusicGrid({ items }: MusicGridProps) {
  return (
    <div className="flex gap-[3vw] overflow-x-auto pb-[1vh] scrollbar-hide">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col items-start flex-shrink-0 w-[29vw]">
          <div className="relative w-[29vw] h-[29vw] overflow-hidden bg-[#71717A]">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="mt-[1vh] text-hakgyo-r-14 text-[#FFFFFF]">{item.title}</div>
          <div className="text-hakgyo-r-14 text-left text-[#959595]">{item.subtitle}</div>
        </div>
      ))}
    </div>
  );
} 