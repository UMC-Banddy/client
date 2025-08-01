export interface SavedItem {
  id: number;
  spotifyId: string;
  type: "track" | "artist" | "album";
}

export interface SaveTrackRequest {
  spotifyId: string;
}

export interface SaveArtistRequest {
  spotifyId: string;
}

export interface SaveAlbumRequest {
  spotifyId: string;
}

export interface SaveTrackResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    trackId: number;
    spotifyId: string;
    title: string;
    artist: string;
    album: string;
    duration: string;
    imageUrl: string;
    externalUrl: string;
  };
}

export interface SaveArtistResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    artistId: number;
    spotifyId: string;
    name: string;
    genre: string;
    imageUrl: string;
    externalUrl: string;
  };
}

export interface SaveAlbumResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    albumId: number;
    spotifyId: string;
    name: string;
    artist: string;
    imageUrl: string;
    externalUrl: string;
  };
}

export interface DeleteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Record<string, never>;
} 