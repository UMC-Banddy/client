interface SettingItemProps {
  icon: string;
  title: string;
  onClick?: () => void;
}

export default function SettingItem({ icon, title, onClick }: SettingItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center cursor-pointer w-[92vw] py-[1vh]"
    >
      <div className="w-[12vw] h-[12vw] mr-[1vw] flex items-center justify-center max-w-[48px] max-h-[48px]">
        <img src={icon} alt={title} className="w-full h-full" />
      </div>
      <div className="flex-1">
        <div className="text-[#CACACA] text-hakgyo-b-17">
          {title}
        </div>
      </div>
    </div>
  );
}
