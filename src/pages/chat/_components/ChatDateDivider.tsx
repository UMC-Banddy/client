import React from "react";
export default function ChatDateDivider({ date }: { date: string }) {
  return (
    <div className="flex justify-center my-2">
      <span className="bg-[#F3F3F3] text-[#A0A0A0] text-xs px-3 py-1 rounded-full shadow">
        {date}
      </span>
    </div>
  );
}
