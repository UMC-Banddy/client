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