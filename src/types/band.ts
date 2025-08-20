
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

// 홈/상세 공통으로 사용할 신규 상세 스펙 (모집 공고 기준)
export interface BandRecruitDetail {
  status?: "RECRUITING" | "ACTIVE" | string;
  profileImageUrl?: string | null;
  representativeSong?: {
    spotifyId?: string;
    artist?: string;
    trackTitle?: string;
  } | null;
  representativeSongFile?: {
    originalFilename?: string;
    fileUrl?: string;
  } | null;
  name?: string;
  endDate?: string;
  autoClose?: boolean;
  description?: string;
  sessions?: string[];
  genres?: string[];
  artists?: Array<{
    createdAt?: string;
    updatedAt?: string;
    id?: number;
    spotifyId?: string;
    name?: string;
    genre?: string;
    imageUrl?: string;
    externalUrl?: string;
  }>;
  tracks?: Array<{
    spotifyId?: string;
    title?: string;
    imageUrl?: string;
  }>;
  ageStart?: number;
  ageEnd?: number;
  gender?: string;
  region?: string;
  averageAge?: string;
  jobs?: string[];
  maleCount?: number;
  femaleCount?: number;
  currentSessions?: string[];
  snsLink?: Record<string, string>;
}
