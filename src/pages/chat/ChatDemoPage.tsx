import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChatHeader,
  ChatDateDivider,
  ChatMessageList,
  ChatInputBar,
  type ChatMessage,
} from "@/shared/components/ChatComponents";

export default function ChatDemoPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample messages for demonstration
  useEffect(() => {
    const sampleMessages: ChatMessage[] = [
      {
        id: "1",
        type: "other",
        name: "I'll kill you",
        avatar: "/src/assets/images/pierrot.png",
        text: "안녕하세요 제 실력 먼저 보여드리죠",
        time: "AM 12:47",
      },
      {
        id: "2",
        type: "me",
        name: "Beck",
        avatar: "/src/assets/images/profile1.png",
        text: "안녕하세요 저는 Beck이에요 덤벼 ㅋㅋ",
        time: "AM 12:47",
      },
      {
        id: "3",
        type: "other",
        name: "I'll kill you",
        avatar: "/src/assets/images/pierrot.png",
        audio: {
          duration: 30,
          isPlaying: false,
          onPlay: () => console.log("Play audio message 3"),
        },
        time: "AM 12:48",
      },
      {
        id: "4",
        type: "me",
        name: "Beck",
        avatar: "/src/assets/images/profile1.png",
        text: "와 칠 줄 아시네",
        time: "AM 12:52",
        unreadCount: 1,
      },
      {
        id: "5",
        type: "other",
        name: "I'll kill you",
        avatar: "/src/assets/images/pierrot.png",
        text: "그럼 이제 우리 밴드에 들어오실래요? 정말 실력이 좋으시네요!",
        time: "AM 12:53",
      },
      {
        id: "6",
        type: "me",
        name: "Beck",
        avatar: "/src/assets/images/profile1.png",
        text: "고민해보겠습니다. 언제까지 답변하면 되나요?",
        time: "AM 12:54",
        unreadCount: 2,
      },
    ];

    setMessages(sampleMessages);
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSettings = useCallback(() => {
    alert("설정 버튼이 클릭되었습니다!");
  }, []);

  const handleSendMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "Beck",
      avatar: "/src/assets/images/profile1.png",
      text,
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate response after 1-3 seconds
    setTimeout(() => {
      const responses = [
        "좋은 말씀이네요!",
        "그렇군요...",
        "흥미롭습니다!",
        "더 자세히 들려주세요.",
        "완전 동감해요!",
        "그럼 언제 연락드릴까요?",
        "밴드 연습은 매주 토요일 저녁에 해요.",
        "정말 기대되네요!",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "other",
        name: "I'll kill you",
        avatar: "/src/assets/images/pierrot.png",
        text: randomResponse,
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };

      setMessages((prev) => [...prev, responseMessage]);
    }, 1000 + Math.random() * 2000);
  }, []);

  const handleSendAudio = useCallback((audioBlob: Blob) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "Beck",
      avatar: "/src/assets/images/profile1.png",
      audio: {
        duration: Math.floor(Math.random() * 60) + 10, // 10-70초 랜덤
        isPlaying: false,
        onPlay: () => console.log("Play my audio message"),
      },
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate audio response
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "other",
        name: "I'll kill you",
        avatar: "/src/assets/images/pierrot.png",
        audio: {
          duration: Math.floor(Math.random() * 60) + 10,
          isPlaying: false,
          onPlay: () => console.log("Play response audio"),
        },
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };

      setMessages((prev) => [...prev, responseMessage]);
    }, 2000 + Math.random() * 1000);
  }, []);

  const handleSendImage = useCallback((imageFile: File) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "Beck",
      avatar: "/src/assets/images/profile1.png",
      text: `📷 ${imageFile.name}`,
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    alert(`이미지 파일 "${imageFile.name}"이 전송되었습니다!`);
  }, []);

  const handleSendCalendar = useCallback(() => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "Beck",
      avatar: "/src/assets/images/profile1.png",
      text: "📅 일정을 생성했습니다",
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    alert("일정 생성 기능이 호출되었습니다!");
  }, []);

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    // Simulate loading more messages
    setTimeout(() => {
      const oldMessages: ChatMessage[] = [
        {
          id: (Date.now() - 1000).toString(),
          type: "other",
          name: "I'll kill you",
          avatar: "/src/assets/images/pierrot.png",
          text: "이전 대화 내용입니다.",
          time: "AM 12:30",
        },
        {
          id: (Date.now() - 2000).toString(),
          type: "me",
          name: "Beck",
          avatar: "/src/assets/images/profile1.png",
          text: "네, 알겠습니다!",
          time: "AM 12:29",
        },
      ];

      setMessages((prev) => [...oldMessages, ...prev]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212]">
      <ChatHeader
        bandName="우리밴드 정상영업합니다"
        bandAvatar="/src/assets/images/profile1.png"
        onBack={handleBack}
        onSettings={handleSettings}
      />

      <div className="flex-1 flex flex-col bg-[#F3F3F3] rounded-t-[40px] overflow-hidden relative">
        <ChatDateDivider />
        <ChatMessageList
          messages={messages}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
        />
      </div>

      <ChatInputBar
        onSendMessage={handleSendMessage}
        onSendAudio={handleSendAudio}
        onSendImage={handleSendImage}
        onSendCalendar={handleSendCalendar}
        placeholder="메시지를 입력해보세요..."
      />
    </div>
  );
}
