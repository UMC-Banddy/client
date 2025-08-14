import { getFolderColorFilter } from "@/features/archive/utils/colorMapping";

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
      "/src/assets/icons/archive/folder1.svg",
      "/src/assets/icons/archive/folder2.svg", 
      "/src/assets/icons/archive/folder3.svg",
      "/src/assets/icons/archive/folder4.svg",
      "/src/assets/icons/archive/folder5.svg"
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
