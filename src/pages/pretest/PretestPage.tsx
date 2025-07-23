import React, { useState } from "react";
import ArtistSelectSection from "./_components/ArtistSelectSection";
import SessionSelectSection from "./_components/SessionSelectSection";

const ARTISTS = [
  { id: "oasis", name: "Oasis" },
  { id: "pierrot", name: "쏜애플" },
  { id: "blur", name: "Blur" },
  { id: "beck", name: "BECK" },
  { id: "steve", name: "Steve Lacy" },
  { id: "tyler", name: "Tyler, the creator" },
];

const SESSIONS = [
  { id: "vocal", name: "보컬", emoji: "🎤" },
  { id: "eguitar", name: "일렉 기타", emoji: "🎸" },
  { id: "aguitar", name: "어쿠스틱 기타", emoji: "🎸" },
  { id: "bass", name: "베이스", emoji: "🎸" },
  { id: "drum", name: "드럼", emoji: "🥁" },
  { id: "keyboard", name: "키보드", emoji: "🎹" },
  { id: "violin", name: "바이올린", emoji: "🎻" },
  { id: "trumpet", name: "트럼펫", emoji: "🎺" },
];

const PretestPage = () => {
  const [step, setStep] = useState<"artist" | "session">("artist");
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#181818",
        color: "#fff",
        fontFamily: "inherit",
      }}
    >
      {/* 상단바 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "18px 16px 0 16px",
          height: 60,
        }}
      >
        <button
          onClick={() => (step === "artist" ? null : setStep("artist"))}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 28,
            cursor: "pointer",
          }}
        >
          {"<"}
        </button>
        <div style={{ flex: 1 }} />
        <button
          style={{
            background: "none",
            border: "none",
            color: "#aaa",
            fontSize: 16,
            fontWeight: 500,
            marginRight: 12,
            cursor: "pointer",
          }}
        >
          건너뛰기
        </button>
        {step === "artist" ? (
          <button
            onClick={() => setStep("session")}
            style={{
              background: "none",
              border: "none",
              color: selectedArtists.length > 0 ? "#7ED957" : "#444",
              fontSize: 16,
              fontWeight: 700,
              cursor: selectedArtists.length > 0 ? "pointer" : "not-allowed",
            }}
            disabled={selectedArtists.length === 0}
          >
            다음
          </button>
        ) : null}
      </div>
      {/* 구분선 */}
      <div style={{ height: 2, background: "#B71C1C", margin: "12px 0 0 0" }} />
      {/* 본문 */}
      {step === "artist" ? (
        <ArtistSelectSection
          artists={ARTISTS}
          selected={selectedArtists}
          setSelected={setSelectedArtists}
        />
      ) : (
        <SessionSelectSection
          sessions={SESSIONS}
          selected={selectedSessions}
          setSelected={setSelectedSessions}
        />
      )}
    </div>
  );
};

export default PretestPage;
