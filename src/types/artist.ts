export interface SimilarArtist {
  artistId: number;
  name: string;
  imageUrl: string;
}

export interface ArchiveArtist {
  artistId: number;
  spotifyId: string;
  name: string;
  genre: string;
  imageUrl: string;
  externalUrl: string;
}

export interface ArchivedArtistsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ArchiveArtist[];
}

// 아티스트 폴더 관련 타입들
export interface ArtistFolder {
  folderId: number;
  name: string;
  color: string;
}

export interface ArtistFoldersResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ArtistFolder[];
}

export interface ArtistInFolder {
  artistId: number;
  spotifyId: string;
  name: string;
  genre: string;
  imageUrl: string;
  externalUrl: string;
}

export interface ArtistsInFolderResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ArtistInFolder[];
} 