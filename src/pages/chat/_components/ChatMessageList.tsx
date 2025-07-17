import ChatMessageItem from "@/pages/chat/_components/ChatMessageItem";

const mockMessages = [
  {
    type: "other",
    name: "I'll kill you",
    avatar: "/images/user1.jpg",
    text: "안녕하세요\n제 실력 먼저 보여드리죠",
    time: "AM 12:47",
  },
  {
    type: "me",
    name: "나",
    avatar: "/images/user2.jpg",
    text: "안녕하세요 저는 Beck이에요\n덤벼 ㅋㅋ",
    time: "AM 12:47",
  },
  {
    type: "other",
    name: "I'll kill you",
    avatar: "/images/user1.jpg",
    audio: true,
    time: "AM 12:48",
  },
  {
    type: "me",
    name: "나",
    avatar: "/images/user2.jpg",
    text: "와 칠 줄 아시네",
    time: "AM 12:52",
  },
] as const;

export default function ChatMessageList() {
  return (
    <div className="flex flex-col gap-2 px-3 pb-3 overflow-y-auto flex-1">
      {mockMessages.map((msg, i) => (
        <ChatMessageItem key={i} {...msg} />
      ))}
    </div>
  );
}
