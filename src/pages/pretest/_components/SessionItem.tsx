import React from "react";

interface SessionItemProps {
  session: { id: string; name: string; emoji: string };
  selected: boolean;
  onClick: () => void;
}

const SessionItem = ({ session, selected, onClick }: SessionItemProps) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      padding: "16px 0",
      margin: "8px 0",
      borderRadius: 24,
      border: selected ? "2px solid #E53E3E" : "1.5px solid #444",
      background: selected ? "#222" : "transparent",
      color: selected ? "#E53E3E" : "#fff",
      fontSize: 18,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      cursor: "pointer",
    }}
  >
    <span style={{ fontSize: 22 }}>{session.emoji}</span>
    {session.name}
    <span style={{ fontSize: 22 }}>{session.emoji}</span>
  </button>
);

export default SessionItem;
