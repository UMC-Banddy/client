interface ArchiveGridProps {
  items: Array<{ image: string; title: string; subtitle: string; muted?: boolean }>;
}

export default function ArchiveGrid({ items }: ArchiveGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col items-start">
          <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-700">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            {item.muted && (
              <span className="absolute bottom-1 right-1 text-white/80 text-xl">🔇</span>
            )}
          </div>
          <div className="mt-1 text-xs text-white font-bold">{item.title}</div>
          <div className="text-xs text-gray-400">{item.subtitle}</div>
        </div>
      ))}
    </div>
  );
}