import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type SimilarArtist, type ArchivedArtistsResponse } from "@/types/artist";

export const getSimilarArtists = async (): Promise<SimilarArtist[]> => {
  const response = await API.get(API_ENDPOINTS.ALBUM_TRACKS.SIMILAR_ARTISTS);
  return response.data;
};

export const getArchivedArtists = async (): Promise<ArchivedArtistsResponse> => {
  const response = await API.get(API_ENDPOINTS.ARTISTS.LIST);
  return response.data;
}; 