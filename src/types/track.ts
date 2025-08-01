export interface SavedTrack {
  title: string;
  imageUrl: string;
  externalUrl?: string;
}

export interface SavedTrackResponse {
  trackId: number;
  title: string;
  artist: string;
  imageUrl: string;
  externalUrl: string;
}

export type SavedTracksResponse = SavedTrackResponse[];

export interface SimilarTrack {
  trackId: number;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
}

export interface SimilarTracksResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: SimilarTrack[];
}

export interface ArchivedTrack {
  trackId: number;
  spotifyId: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  imageUrl: string;
  externalUrl: string;
}

export interface ArchivedTracksResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ArchivedTrack[];
}
