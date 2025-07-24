import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtistSelectSection from "./ArtistSelectSection";

const ARTISTS = [
  { id: "oasis", name: "Oasis" },
  { id: "pierrot", name: "쏜애플" },
  { id: "blur", name: "Blur" },
  { id: "beck", name: "BECK" },
  { id: "steve", name: "Steve Lacy" },
  { id: "tyler", name: "Tyler, the creator" },
];

const PretestArtistPage = () => {
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const navigate = useNavigate();

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
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 28,
            cursor: "pointer",
          }}
          disabled
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
        <button
          onClick={() => navigate("/pre-test/session")}
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
      </div>
      {/* 구분선 */}
      <div style={{ height: 2, background: "#B71C1C", margin: "12px 0 0 0" }} />
      {/* 본문 */}
      <ArtistSelectSection
        artists={ARTISTS}
        selected={selectedArtists}
        setSelected={setSelectedArtists}
      />
    </div>
  );
};

export default PretestArtistPage;
