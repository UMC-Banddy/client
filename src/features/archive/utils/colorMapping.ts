// 폴더 색상 매핑
export const getFolderColor = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    "GRAY": "#959595",
    "YELLOW": "#FEFF68",
    "GREEN": "#79D000",
    "RED": "#D13D55",
    "ORANGE": "#F05A02",
    "BLUE": "#0CB4A4",
  };
  
  return colorMap[colorName] || "#959595"; // 기본값은 GRAY
};

// CSS filter를 사용해서 색상 변경 (SVG용)
// 원본 #959595에서 각 색상으로 변환하는 정확한 filter 값
export const getFolderColorFilter = (colorName: string): string => {
  const filterMap: Record<string, string> = {
    "GRAY": "brightness(0) saturate(100%) invert(64%) sepia(4%) saturate(8%) hue-rotate(12deg) brightness(93%) contrast(84%)",
    "YELLOW": "brightness(0) saturate(100%) invert(84%) sepia(79%) saturate(348%) hue-rotate(355deg) brightness(107%) contrast(106%)",
    "GREEN": "brightness(0) saturate(100%) invert(67%) sepia(68%) saturate(1338%) hue-rotate(38deg) brightness(94%) contrast(108%)",
    "RED": "brightness(0) saturate(100%) invert(33%) sepia(55%) saturate(1731%) hue-rotate(319deg) brightness(87%) contrast(91%)",
    "ORANGE": "brightness(0) saturate(100%) invert(49%) sepia(46%) saturate(6253%) hue-rotate(0deg) brightness(95%) contrast(98%)",
    "BLUE": "brightness(0) saturate(100%) invert(66%) sepia(61%) saturate(5098%) hue-rotate(137deg) brightness(95%) contrast(91%)",
  };
  
  return filterMap[colorName] || filterMap["GRAY"];
};
