import { useQuery } from "@tanstack/react-query";
import { getAutocomplete } from "@/store/autocompleteApi";
import { authStore } from "@/store/authStore";

export const useAutocomplete = (query: string) => {
  const { data: suggestions = [], isLoading, error } = useQuery<string[]>({
    queryKey: ["autocomplete", query],
    queryFn: async () => {
      const response = await getAutocomplete(query, 3);
      return response.result.results;
    },
    enabled: !!authStore.accessToken && !!query.trim(),
  });

  return { 
    suggestions, 
    isLoading, 
    error: error?.message || null 
  };
}; 