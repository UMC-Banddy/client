import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type SimilarArtist, type ArchivedArtistsResponse, type ArtistFoldersResponse, type ArtistFolder, type ArtistsInFolderResponse } from "@/types/artist";

export interface ArtistQuestionResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    question: string;
    artistName: string;
    memberNickname: string;
  };
}

export const getSimilarArtists = async (): Promise<SimilarArtist[]> => {
  const response = await API.get(API_ENDPOINTS.ALBUM_TRACKS.SIMILAR_ARTISTS);
  return response.data;
};

export const getArtistQuestion = async (): Promise<ArtistQuestionResponse> => {
  const response = await API.get(API_ENDPOINTS.ARTISTS.QUESTION);
  return response.data;
};

export const getArchivedArtists = async (): Promise<ArchivedArtistsResponse> => {
  const response = await API.get(API_ENDPOINTS.ARTISTS.LIST);
  return response.data;
};

// 아티스트 폴더 관련 API 함수들
export const getArtistFolders = async (): Promise<ArtistFoldersResponse> => {
  const response = await API.get(API_ENDPOINTS.ARTIST_FOLDERS.LIST);
  return response.data;
};

export const createArtistFolder = async (name: string, color: string): Promise<{ isSuccess: boolean; code: string; message: string; result: { folderId: number; name: string; color: string } }> => {
  const response = await API.post(API_ENDPOINTS.ARTIST_FOLDERS.CREATE, {
    name,
    color,
  });
  return response.data;
};

export const getArtistsInFolder = async (folderId: number): Promise<ArtistsInFolderResponse> => {
  const response = await API.get(API_ENDPOINTS.ARTIST_FOLDERS.GET_ARTISTS(folderId.toString()));
  return response.data;
};

export const addArtistToFolder = async (folderId: number, artistId: number): Promise<{ isSuccess: boolean; code: string; message: string; result: { artistFolderId: number; artists: Array<{ artistId: number; spotifyId: string; name: string; genre: string; imageUrl: string; externalUrl: string }> } }> => {
  const response = await API.post(API_ENDPOINTS.ARTIST_FOLDERS.ADD_ARTIST(folderId.toString()), {
    artistId,
  });
  return response.data;
};

export const addArtistsToFolder = async (folderId: number, artistIds: number[]): Promise<{ isSuccess: boolean; code: string; message: string; result: { artistFolderId: number; artists: Array<{ artistId: number; spotifyId: string; name: string; genre: string; imageUrl: string; externalUrl: string }> } }> => {
  // 각 아티스트를 개별적으로 추가
  const results = await Promise.all(
    artistIds.map(artistId => addArtistToFolder(folderId, artistId))
  );
  
  // 마지막 결과를 반환
  return results[results.length - 1];
};

export const deleteArtist = async (artistId: number): Promise<{ isSuccess: boolean; code: string; message: string; result: object }> => {
  const response = await API.delete(API_ENDPOINTS.ARTISTS.DELETE(artistId.toString()));
  return response.data;
};

export const deleteArtistFromFolder = async (folderId: number, artistId: number): Promise<{ isSuccess: boolean; code: string; message: string; result: object }> => {
  const response = await API.delete(API_ENDPOINTS.ARTIST_FOLDERS.REMOVE_ARTIST(folderId.toString(), artistId.toString()));
  return response.data;
};

export const getArtistFolderCounts = async (): Promise<{ isSuccess: boolean; code: string; message: string; result: Record<number, number> }> => {
  const response = await API.get(API_ENDPOINTS.ARTIST_FOLDERS.LIST);
  const folders = response.data.result;
  
  // 각 폴더의 아티스트 개수를 가져오기 위해 병렬로 API 호출
  const artistCounts: Record<number, number> = {};
  
  await Promise.all(
    folders.map(async (folder: ArtistFolder) => {
      try {
        const artistsResponse = await API.get(API_ENDPOINTS.ARTIST_FOLDERS.GET_ARTISTS(folder.folderId.toString()));
        artistCounts[folder.folderId] = artistsResponse.data.result.length;
      } catch {
        artistCounts[folder.folderId] = 0;
      }
    })
  );
  
  return {
    isSuccess: true,
    code: "200",
    message: "Success",
    result: artistCounts
  };
}; 