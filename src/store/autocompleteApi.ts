import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type AutocompleteResponse } from "@/types/autocomplete";

export const getAutocomplete = async (query: string, limit: number = 3): Promise<AutocompleteResponse> => {
  const response = await API.get(API_ENDPOINTS.MUSIC.AUTOCOMPLETE_MUSIC, {
    params: {
      query,
      limit,
    },
  });
  return response.data;
}; 