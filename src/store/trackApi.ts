import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type SimilarTrack, type ArchivedTracksResponse } from "@/types/track";

export const getSimilarTracks = async (): Promise<SimilarTrack[]> => {
  const response = await API.get(API_ENDPOINTS.ALBUM_TRACKS.SIMILAR_TRACKS);
  return response.data;
};

export const getArchivedTracks = async (): Promise<ArchivedTracksResponse> => {
  const response = await API.get(API_ENDPOINTS.TRACKS.LIST);
  return response.data;
}; 