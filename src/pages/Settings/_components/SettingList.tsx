import SettingItem from "./SettingItem";
import { type SettingItem as SettingItemType } from "@/types/setting";

interface SettingListProps {
  items: SettingItemType[];
}

export default function SettingList({ items }: SettingListProps) {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <SettingItem
          key={index}
          icon={item.icon}
          title={item.title}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
}
