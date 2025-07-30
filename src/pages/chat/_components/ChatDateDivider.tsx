import { useState } from "react";

interface ChatDateDividerProps {
  date?: string;
  className?: string;
}

export default function ChatDateDivider({
  date,
  className = "",
}: ChatDateDividerProps) {
  // 현재 날짜를 기본값으로 사용
  const currentDate =
    date ||
    new Date()
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\./g, ".");

  return (
    <div className={`flex items-center justify-center py-4 ${className}`}>
      <span className="text-sm text-gray-500 font-medium">{currentDate}</span>
    </div>
  );
}
