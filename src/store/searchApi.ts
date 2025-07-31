import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type SearchResponse } from "@/types/search";

export const getSearch = async (query: string, limit: number = 5, offset: number = 0): Promise<SearchResponse> => {
  const response = await API.get(API_ENDPOINTS.MUSIC.SEARCH, {
    params: {
      q: query,
      limit,
      offset,
    },
  });
  return response.data;
}; 