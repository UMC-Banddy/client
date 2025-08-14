import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";

interface SearchTracksParams {
  q: string;
  limit?: number;
  offset?: number;
}

interface SearchTracksResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Array<{
    spotifyId: string;
    title: string;
    artist: string;
    album: string;
    duration: string;
    imageUrl: string;
    externalUrl: string;
  }>;
}

const searchTracks = async (params: SearchTracksParams): Promise<SearchTracksResponse> => {
  const { q, limit = 10, offset = 0 } = params;
  const response = await API.get(API_ENDPOINTS.MUSIC.SEARCH_TRACKS, {
    params: { q, limit, offset }
  });
  return response.data;
};

export const useSearchTracks = (params: SearchTracksParams) => {
  return useQuery({
    queryKey: ["searchTracks", params],
    queryFn: () => searchTracks(params),
    enabled: !!params.q,
  });
};
