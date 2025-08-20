import { useEffect, useState } from "react";
import { useIsBookmarked, useToggleBandBookmark } from "../hooks";

interface Props {
  bandId: number;
  initialBookmarked?: boolean; // 서버에서 별도 전달 가능할 때
  onChange?: (bookmarked: boolean) => void;
}

export default function BandBookmarkButton({
  bandId,
  initialBookmarked,
  onChange,
}: Props) {
  const isBookmarkedFromList = useIsBookmarked(bandId);
  const [bookmarked, setBookmarked] = useState(
    initialBookmarked ?? isBookmarkedFromList
  );
  const toggle = useToggleBandBookmark();

  useEffect(() => {
    // 북마크 목록이 로드되면 상태를 동기화
    setBookmarked(isBookmarkedFromList);
  }, [isBookmarkedFromList]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 네비게이션과 분리
    const next = !bookmarked;
    setBookmarked(next); // 낙관적 업데이트
    try {
      await toggle(bandId, next);
      onChange?.(next);
    } catch {
      setBookmarked(!next); // 롤백
    }
  };

  return (
    <button
      aria-label={bookmarked ? "북마크 해제" : "북마크 추가"}
      onClick={handleClick}
      className="absolute top-[8px] right-[8px] z-20 bg-transparent border-none cursor-pointer"
    >
      <span className="text-[20px]">{bookmarked ? "♥" : "♡"}</span>
    </button>
  );
}
