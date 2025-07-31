import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { 
  type SaveTrackRequest, 
  type SaveArtistRequest, 
  type SaveAlbumRequest,
  type SaveTrackResponse,
  type SaveArtistResponse,
  type SaveAlbumResponse,
  type DeleteResponse
} from "@/types/savedItem";

// 저장 API 함수들
export const saveTrack = async (spotifyId: string): Promise<SaveTrackResponse> => {
  const response = await API.post(API_ENDPOINTS.TRACKS.SAVE, 
    { spotifyId } as SaveTrackRequest
  );
  return response.data;
};

export const saveArtist = async (spotifyId: string): Promise<SaveArtistResponse> => {
  const response = await API.post(API_ENDPOINTS.ARTISTS.SAVE, 
    { spotifyId } as SaveArtistRequest
  );
  return response.data;
};

export const saveAlbum = async (spotifyId: string): Promise<SaveAlbumResponse> => {
  const response = await API.post(API_ENDPOINTS.ALBUMS.SAVE, 
    { spotifyId } as SaveAlbumRequest
  );
  return response.data;
};

// 삭제 API 함수들
export const deleteTrack = async (trackId: number): Promise<DeleteResponse> => {
  const response = await API.delete(API_ENDPOINTS.TRACKS.DELETE(trackId.toString()));
  return response.data;
};

export const deleteArtist = async (artistId: number): Promise<DeleteResponse> => {
  const response = await API.delete(API_ENDPOINTS.ARTISTS.DELETE(artistId.toString()));
  return response.data;
};

export const deleteAlbum = async (albumId: number): Promise<DeleteResponse> => {
  const response = await API.delete(API_ENDPOINTS.ALBUMS.DELETE(albumId.toString()));
  return response.data;
}; 