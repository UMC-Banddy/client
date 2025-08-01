export interface Song {
  image: string;
  title: string;
  artist: string;
  type?: "track" | "artist" | "album";
  externalUrl?: string;
  spotifyId?: string;
} 