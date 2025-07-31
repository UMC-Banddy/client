export interface ArchivedAlbum {
  albumId: number;
  spotifyId: string;
  name: string;
  artist: string;
  imageUrl: string;
  externalUrl: string;
}

export interface ArchivedAlbumsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ArchivedAlbum[];
}

export interface ArchivedAlbum {
  albumId: number;
  spotifyId: string;
  name: string;
  artist: string;
  imageUrl: string;
  externalUrl: string;
}

export interface ArchivedAlbumsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ArchivedAlbum[];
}

export interface SavedAlbumResponse {
  albumId: number;
  spotifyId: string;
  name: string;
  artist: string;
  imageUrl: string;
  externalUrl: string;
}

export type SavedAlbumsResponse = SavedAlbumResponse[];
