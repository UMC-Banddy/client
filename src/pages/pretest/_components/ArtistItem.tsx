import React from "react";
import { OasisImg, PierrotImg } from "@/shared/components/images";

interface ArtistItemProps {
  artist: { id: string; name: string };
  selected: boolean;
  onClick: () => void;
}

const ArtistItem = ({ artist, selected, onClick }: ArtistItemProps) => {
  const renderArtistImg = () => {
    if (
      artist.id === "oasis" ||
      artist.id === "blur" ||
      artist.id === "steve"
    ) {
      return <OasisImg size={90} color={selected ? "red" : "gray"} />;
    }
    return <PierrotImg size={90} color={selected ? "red" : "gray"} />;
  };

  return (
    <div
      onClick={onClick}
      style={{ position: "relative", cursor: "pointer", width: 90, margin: 8 }}
    >
      {renderArtistImg()}
      {selected && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            background: "#E53E3E",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
            border: "2px solid #fff",
          }}
        >
          ✓
        </div>
      )}
      <div
        style={{
          color: "#fff",
          textAlign: "center",
          marginTop: 8,
          fontSize: 14,
        }}
      >
        {artist.name}
      </div>
    </div>
  );
};

export default ArtistItem;
