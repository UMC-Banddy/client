import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type ArchivedAlbumsResponse } from "@/types/album";

export const getArchivedAlbums = async (): Promise<ArchivedAlbumsResponse> => {
  const response = await API.get(API_ENDPOINTS.ALBUMS.LIST);
  return response.data;
}; 