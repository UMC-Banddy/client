export interface TrackDto {
  title: string;
  artist: string;
  imageUrl: string;
}

export interface ArtistDto {
  name: string;
  imageUrl: string;
}

export interface CompositionDto {
  averageAge: string;
  maleCount: number;
  femaleCount: number;
}

export interface SnsDto {
  platform: string;
  url: string;
}

// GET /api/band/{bandId}/profile
export interface BandProfile {
  goalTracks?: TrackDto[];
  preferredArtists?: ArtistDto[];
  composition?: CompositionDto;
  sns?: SnsDto[];
  sessions?: string[];
  jobs?: string[];
}

// GET /api/band/{bandId}/detail
export interface BandDetail {
  bandId: number;
  bandName: string;
  profileImageUrl?: string;
  ageRange?: string;
  genderCondition?: string;
  region?: string;
  district?: string;
  description?: string;
  endDate?: string;
  snsList?: SnsDto[];
}
