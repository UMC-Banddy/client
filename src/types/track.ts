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

// 폴더 관련 타입
export interface TrackFolder {
  folderId: number;
  name: string;
  color: string;
}

export interface TrackFoldersResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: TrackFolder[];
}

// 폴더 내 곡 목록 타입
export interface TrackInFolder {
  trackId: number;
  spotifyId: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  imageUrl: string;
  externalUrl: string;
}

export interface TracksInFolderResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: TrackInFolder[];
}
