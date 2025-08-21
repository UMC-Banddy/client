import React, { useState, useEffect } from "react";
import {
  MicImg,
  ElectricGuitarImg,
  GuitarImg,
  BassImg,
  DrumImg,
  PianoImg,
  ViolinImg,
  TrumpetImg,
} from "@/shared/components/images";
import ImgCircle from "@/shared/components/images/ImgCircle";

interface SessionLevel {
  id: string;
  name: string;
}

interface Session {
  id: string;
  name: string;
  icon: React.ReactNode;
  levels: SessionLevel[];
}

interface SessionSectionProps {
  sessions: Record<string, string>;
  onSessionChange?: (sessionId: string, levelId: string) => void;
}

const SessionSection: React.FC<SessionSectionProps> = ({
  sessions,
  onSessionChange,
}) => {
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionList, setSessionList] = useState<Session[]>([]);

  // sessions prop이 변경될 때 sessionList 초기화
  useEffect(() => {
    if (sessions && Object.keys(sessions).length > 0) {
      const newSessionList: Session[] = [];
      
      Object.entries(sessions).forEach(([sessionId]) => {
        const availableSession = availableSessions.find(s => s.id === sessionId);
        if (availableSession) {
          const newSession: Session = {
            id: sessionId,
            name: availableSession.name,
            icon: availableSession.icon,
            levels: [
              { id: "beginner", name: "초보" },
              { id: "intermediate", name: "중수" },
              { id: "expert", name: "고수" },
            ],
          };
          newSessionList.push(newSession);
        }
      });
      
      setSessionList(newSessionList);
    } else {
      setSessionList([]);
    }
  }, [sessions]);

  const availableSessions = [
    {
      id: "vocal",
      name: "보컬",
      icon: (
        <ImgCircle size={50} color="red">
          <MicImg size={50} color="red" />
        </ImgCircle>
      ),
    },
    {
      id: "electric-guitar",
      name: "일렉기타",
      icon: (
        <ImgCircle size={50} color="red">
          <ElectricGuitarImg size={50} color="red" />
        </ImgCircle>
      ),
    },
    {
      id: "acoustic-guitar",
      name: "어쿠스틱 기타",
      icon: (
        <ImgCircle size={50} color="red">
          <GuitarImg size={50} color="red" />
        </ImgCircle>
      ),
    },
    {
      id: "bass",
      name: "베이스",
      icon: (
        <ImgCircle size={50} color="red">
          <BassImg size={50} color="red" />
        </ImgCircle>
      ),
    },
    {
      id: "drum",
      name: "드럼",
      icon: (
        <ImgCircle size={50} color="red">
          <DrumImg size={50} color="red" />
        </ImgCircle>
      ),
    },
    {
      id: "piano",
      name: "피아노",
      icon: (
        <ImgCircle size={50} color="red">
          <PianoImg size={50} color="red" />
        </ImgCircle>
      ),
    },
    {
      id: "violin",
      name: "바이올린",
      icon: (
        <ImgCircle size={50} color="red">
          <ViolinImg size={50} color="red" />
        </ImgCircle>
      ),
    },
    {
      id: "trumpet",
      name: "트럼펫",
      icon: (
        <ImgCircle size={50} color="red">
          <TrumpetImg size={50} color="red" />
        </ImgCircle>
      ),
    },
  ];

  const handleAddSession = () => {
    setShowSessionModal(true);
  };

  const handleSessionSelect = (sessionId: string) => {
    const existingSession = sessionList.find(
      (session) => session.id === sessionId
    );
    if (existingSession) {
      console.log("이미 존재하는 세션입니다:", sessionId);
      setShowSessionModal(false);
      return;
    }

    const selectedSession = availableSessions.find((s) => s.id === sessionId);
    if (!selectedSession) return;

    const newSession: Session = {
      id: sessionId,
      name: selectedSession.name,
      icon: selectedSession.icon,
      levels: [
        { id: "beginner", name: "초보" },
        { id: "intermediate", name: "중수" },
        { id: "expert", name: "고수" },
      ],
    };

    setSessionList((prev) => [...prev, newSession]);
    setShowSessionModal(false);
  };

  const handleLevelChange = (sessionId: string, levelId: string) => {
    console.log(`🔍 SessionSection - 레벨 변경: ${sessionId} = ${levelId}`);
    onSessionChange?.(sessionId, levelId);
  };

  return (
    <div className="mb-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-white mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9">
        가능한 세션 및 실력
      </h3>

      <div className="space-y-6">
        {sessionList.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            selectedLevel={sessions[session.id]}
            onLevelChange={handleLevelChange}
          />
        ))}
      </div>

      <AddSessionButton onClick={handleAddSession} />

      <SessionSelectionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onSessionSelect={handleSessionSelect}
        availableSessions={availableSessions}
      />
    </div>
  );
};

// 재사용 가능한 세션 행 컴포넌트
interface SessionRowProps {
  session: Session;
  selectedLevel?: string;
  onLevelChange: (sessionId: string, levelId: string) => void;
}

const SessionRow: React.FC<SessionRowProps> = ({
  session,
  selectedLevel,
  onLevelChange,
}) => {
  return (
    <div className="flex flex-row items-center gap-3 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
      <SessionIcon icon={session.icon} />
      {/* <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium whitespace-nowrap min-w-[60px] sm:min-w-[70px] md:min-w-[80px] lg:min-w-[90px] xl:min-w-[100px] 2xl:min-w-[110px] flex-shrink-0">
        {session.name}
      </span> */}
      <div className="flex flex-row items-center gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 2xl:gap-9 mx-auto">
        {session.levels.map((level) => (
          <LevelButton
            key={level.id}
            level={level}
            isSelected={selectedLevel === level.id}
            onClick={() => onLevelChange(session.id, level.id)}
          />
        ))}
      </div>
    </div>
  );
};

// 재사용 가능한 세션 아이콘 컴포넌트
interface SessionIconProps {
  icon: React.ReactNode;
}

const SessionIcon: React.FC<SessionIconProps> = ({ icon }) => {
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 2xl:w-22 2xl:h-22 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
  );
};

// 재사용 가능한 레벨 버튼 컴포넌트
interface LevelButtonProps {
  level: SessionLevel;
  isSelected: boolean;
  onClick: () => void;
}

const LevelButton: React.FC<LevelButtonProps> = ({
  level,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-row items-center gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 xl:gap-2.5 2xl:gap-3 transition-colors whitespace-nowrap"
    >
      <div
        className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isSelected ? "border-2 border-white bg-transparent" : "bg-gray-400"
        }`}
      >
        {isSelected && (
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-4.5 xl:h-4.5 2xl:w-5 2xl:h-5 bg-black rounded-full"></div>
        )}
      </div>
      <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        {level.name}
      </span>
    </button>
  );
};

// 재사용 가능한 세션 추가 버튼 컴포넌트
interface AddSessionButtonProps {
  onClick: () => void;
}

const AddSessionButton: React.FC<AddSessionButtonProps> = ({ onClick }) => {
  return (
    <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-9 xl:mt-10 2xl:mt-11">
      <button
        onClick={onClick}
        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 2xl:w-22 2xl:h-22 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
      >
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-13 2xl:h-13 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>
    </div>
  );
};

// 재사용 가능한 세션 선택 모달 컴포넌트
interface SessionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionSelect: (sessionId: string) => void;
  availableSessions: Array<{ id: string; name: string; icon: React.ReactNode }>;
}

const SessionSelectionModal: React.FC<SessionSelectionModalProps> = ({
  isOpen,
  onClose,
  onSessionSelect,
  availableSessions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-gray-300 rounded-t-3xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-1 bg-gray-400 rounded-full mx-auto mb-4"></div>
        <h3 className="text-gray-700 text-lg font-medium mb-4 text-center">
          세션 선택
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {availableSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSessionSelect(session.id)}
              className="w-20 h-20 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              {session.icon}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default SessionSection;
