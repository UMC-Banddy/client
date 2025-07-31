import { ChevronRight } from "lucide-react";

interface ArchiveSectionProps {
  title: string;
  onClick?: () => void;
}

export default function ArchiveSection({ title, onClick }: ArchiveSectionProps) {
  return (
    <div
      className="flex text-[#FFFFFF] text-hakgyo-b-17 items-center justify-between w-full px-[24px] mb-[2vh] mt-[4.5vh] cursor-pointer select-none"
      onClick={onClick} 
    >
      <span className="pl-0">{title}</span>
      <ChevronRight size={20} className="text-white pr-[0px]" />
    </div>
  );
}
