import React from "react";
import SessionCard from "./SessionCard";
import type { Session } from "./SessionCard";

interface SessionListProps {
  sessions: Session[];
  selectedSessions: Record<string, string>; // sessionId -> levelId
  onSessionSelect: (sessionId: string) => void;
  onLevelSelect: (sessionId: string, levelId: string) => void;
}

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  selectedSessions,
  onSessionSelect,
  onLevelSelect,
}) => {
  return (
    <div className="w-full space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 xl:space-y-8 2xl:space-y-9">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          isSelected={Object.prototype.hasOwnProperty.call(
            selectedSessions,
            session.id
          )}
          selectedLevel={selectedSessions[session.id]}
          onSelect={onSessionSelect}
          onLevelSelect={onLevelSelect}
        />
      ))}
    </div>
  );
};

export default SessionList;
