interface MusicGridProps {
  items: Array<{ image: string; title: string; subtitle: string }>;
}

export default function MusicGrid({ items }: MusicGridProps) {
  return (
    // <div className="flex gap-[14px] overflow-x-auto pb-[1vh] scrollbar-hide mb-[4vh] w-screen -mx-[24px] pl-[24px]">
    <div className="flex gap-[14px] overflow-x-auto pb-[1vh] scrollbar-hide mb-[4vh]">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col items-start">
          <div className="relative w-[29vw] h-[29vw] overflow-hidden bg-[#71717A] max-w-[116px] max-h-[116px]">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="mt-[1vh] text-hakgyo-r-14 text-[#FFFFFF]">{item.title}</div>
          <div className="text-hakgyo-r-14 text-left text-[#959595]">{item.subtitle}</div>
        </div>
      ))}
    </div>
  );
} 