import { useQuery } from "@tanstack/react-query";
import { getSearch } from "@/store/searchApi";
import { authStore } from "@/store/authStore";
import { type SearchItem } from "@/types/search";
import { type Song } from "@/types/song";

export const useSearch = (query: string) => {
  const { data: searched = [], isLoading, error } = useQuery<SearchItem[]>({
    queryKey: ["search", query],
    queryFn: async () => {
      const response = await getSearch(query, 4, 0);
      // tracks, artists, albums를 하나의 배열로 합치면서 type 정보 추가
      const allResults: SearchItem[] = [
        ...response.result.artists.map(artist => ({ ...artist, type: "artist" as const })),
        ...response.result.albums.map(album => ({ ...album, type: "album" as const })),
        ...response.result.tracks.map(track => ({ ...track, type: "track" as const })),
      ];
      return allResults;
    },
    enabled: !!authStore.accessToken && !!query.trim(),
  });

  // API 결과에 type 정보 추가
  const transformSearchResults = (items: SearchItem[]): Song[] => {
    return items.map((item: SearchItem) => {
      if (item.type === "track") {
        return {
          image: item.imageUrl,
          title: item.title,
          artist: item.artist,
          type: item.type,
          externalUrl: item.externalUrl,
          spotifyId: item.spotifyId
        };
      } else if (item.type === "artist") {
        return {
          image: item.imageUrl,
          title: item.name,
          artist: item.genres,
          type: item.type,
          externalUrl: item.externalUrl,
          spotifyId: item.spotifyId
        };
      } else if (item.type === "album") {
        return {
          image: item.imageUrl,
          title: item.name,
          artist: item.artists,
          type: item.type,
          externalUrl: item.externalUrl,
          spotifyId: item.spotifyId
        };
      }
      return null;
    }).filter(Boolean) as Song[];
  };

  const transformedSearched = transformSearchResults(searched);

  return { 
    searched: transformedSearched, 
    isLoading, 
    error: error?.message || null 
  };
}; 