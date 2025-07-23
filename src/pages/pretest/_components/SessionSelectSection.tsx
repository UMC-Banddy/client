import React from "react";
import SessionItem from "./SessionItem";

interface Session {
  id: string;
  name: string;
  emoji: string;
}

interface SessionSelectSectionProps {
  sessions: Session[];
  selected: string[];
  setSelected: (ids: string[]) => void;
}

const SessionSelectSection = ({
  sessions,
  selected,
  setSelected,
}: SessionSelectSectionProps) => {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          color: "#fff",
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        가능한 세션과 실력
      </div>
      <div style={{ color: "#aaa", fontSize: 14, marginBottom: 16 }}>
        실력의 기준이 애매하다면{" "}
        <span
          style={{
            color: "#E53E3E",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          여기를 눌러주세요.
        </span>
      </div>
      <div>
        {sessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            selected={selected.includes(session.id)}
            onClick={() =>
              setSelected(
                selected.includes(session.id)
                  ? selected.filter((id) => id !== session.id)
                  : [...selected, session.id]
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default SessionSelectSection;
