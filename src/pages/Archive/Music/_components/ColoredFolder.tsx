import { getFolderColorFilter } from "@/features/archive/utils/colorMapping";
import folder1 from "@/assets/icons/archive/folder1.svg";
import folder2 from "@/assets/icons/archive/folder2.svg";
import folder3 from "@/assets/icons/archive/folder3.svg";
import folder4 from "@/assets/icons/archive/folder4.svg";
import folder5 from "@/assets/icons/archive/folder5.svg";

interface ColoredFolderProps {
  color: string;
  folderIndex: number; // 1-5 사이의 폴더 인덱스
  size?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function ColoredFolder({ color, folderIndex, size = "w-[10vw] h-[10vw] max-w-[40px] max-h-[40px]", className = "", style, onClick }: ColoredFolderProps) {
  // 폴더 인덱스에 따라 SVG 파일 매핑
  const getFolderSvg = (index: number): string => {
    const folderSvgs = [
      folder1,
      folder2,
      folder3,
      folder4,
      folder5
    ];
    return folderSvgs[index - 1] || folderSvgs[0]; // 1-5 범위를 0-4로 변환
  };

  const colorFilter = getFolderColorFilter(color);
  
  return (
    <div className={`cursor-pointer ${className}`} style={style} onClick={onClick}>
      <img 
        src={getFolderSvg(folderIndex)}
        alt={`folder${folderIndex}`}
        className={size}
        style={{ filter: colorFilter }}
      />
    </div>
  );
}
