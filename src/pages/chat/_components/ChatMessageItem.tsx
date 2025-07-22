interface ChatMessageItemProps {
  type: "me" | "other";
  name: string;
  avatar: string;
  text?: string;
  audio?: boolean;
  time: string;
}

export default function ChatMessageItem({
  type,
  name,
  avatar,
  text,
  audio,
  time,
}: ChatMessageItemProps) {
  const isMe = type === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && (
        <img
          src={avatar}
          alt={name}
          className="w-8 h-8 rounded-full object-cover mr-2 mt-auto"
        />
      )}
      <div
        className={`flex flex-col max-w-[70%] ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        <span className="text-xs text-gray-500 mb-1">{name}</span>
        {text && (
          <div
            className={`bg-white px-3 py-2 rounded-xl shadow text-sm whitespace-pre-line ${
              isMe ? "rounded-br-none" : "rounded-bl-none"
            }`}
          >
            {text}
          </div>
        )}
        {audio && (
          <div className="bg-white px-3 py-2 rounded-xl shadow flex items-center w-40 mb-1">
            <button className="mr-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" fill="#292929" />
              </svg>
            </button>
            <div className="flex-1 h-2 bg-gray-300 rounded-full" />
          </div>
        )}
        <span className="text-[10px] text-gray-400 mt-1">{time}</span>
      </div>
      {isMe && (
        <img
          src={avatar}
          alt={name}
          className="w-8 h-8 rounded-full object-cover ml-2 mt-auto"
        />
      )}
    </div>
  );
}
