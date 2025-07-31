interface ArchiveTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ["음악", "아티스트", "앨범"];

export default function ArchiveTabs({ activeTab, onTabChange }: ArchiveTabsProps) {
  return (
    <div className="flex gap-[20px] mt-[2vh] text-[#FFFFFF] text-hakgyo-b-24">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`pb-[12px] cursor-pointer border-b-[0.3vh] transition ${
            activeTab === tab
              ? "text-[#FFFFFF] border-[#FFFFFF]"
              : "text-[#71717A] border-transparent"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}