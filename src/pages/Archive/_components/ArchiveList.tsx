interface ArchiveListProps {
  items: Array<{ image: string; title: string; subtitle: string; muted?: boolean }>;
}

export default function ArchiveList({ items }: ArchiveListProps) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center py-2 border-b border-white/10">
          <img src={item.image} alt={item.title} className="w-12 h-12 rounded-md object-cover mr-3" />
          <div className="flex-1">
            <div className="text-white text-sm font-bold">{item.title}</div>
            <div className="text-gray-400 text-xs">{item.subtitle}</div>
          </div>
          {item.muted && (
            <span className="text-white/80 text-xl ml-2">🔇</span>
          )}
        </div>
      ))}
    </div>
  );
}