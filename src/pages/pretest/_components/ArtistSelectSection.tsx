import React, { useState } from "react";
import ArtistItem from "./ArtistItem";

interface Artist {
  id: string;
  name: string;
}

interface ArtistSelectSectionProps {
  artists: Artist[];
  selected: string[];
  setSelected: (ids: string[]) => void;
}

const ArtistSelectSection = ({
  artists,
  selected,
  setSelected,
}: ArtistSelectSectionProps) => {
  const [search, setSearch] = useState("");
  const filtered = artists.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.includes(search.toLowerCase())
  );
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
        좋아하는 아티스트를 선택하세요.
      </div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="아티스트 검색하기"
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 12,
          border: "none",
          marginBottom: 24,
          fontSize: 16,
        }}
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {filtered.map((artist) => (
          <ArtistItem
            key={artist.id}
            artist={artist}
            selected={selected.includes(artist.id)}
            onClick={() =>
              setSelected(
                selected.includes(artist.id)
                  ? selected.filter((id) => id !== artist.id)
                  : [...selected, artist.id]
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ArtistSelectSection;
