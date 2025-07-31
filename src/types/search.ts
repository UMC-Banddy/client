export interface SearchTrack {
  spotifyId: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  imageUrl: string;
  externalUrl: string;
  type: "track";
}

export interface SearchArtist {
  spotifyId: string;
  name: string;
  genres: string;
  imageUrl: string;
  externalUrl: string;
  type: "artist";
}

export interface SearchAlbum {
  spotifyId: string;
  name: string;
  artists: string;
  releaseDate: string;
  imageUrl: string;
  externalUrl: string;
  type: "album";
}

export type SearchItem = SearchTrack | SearchArtist | SearchAlbum;

export interface SearchResult {
  tracks: SearchTrack[];
  artists: SearchArtist[];
  albums: SearchAlbum[];
}

export interface SearchResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: SearchResult;
} 