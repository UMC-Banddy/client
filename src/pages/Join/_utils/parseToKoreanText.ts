// 이모지와 공백을 제거하고 한글만 추출
export const parseToKoreanText = (text: string) => {
  return text.replace(/[^\uAC00-\uD7AF\s]/g, "").trim();
};
