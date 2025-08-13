import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type SimilarTrack, type ArchivedTracksResponse, type TrackFoldersResponse, type TrackFolder } from "@/types/track";

export const getSimilarTracks = async (): Promise<SimilarTrack[]> => {
  const response = await API.get(API_ENDPOINTS.ALBUM_TRACKS.SIMILAR_TRACKS);
  return response.data;
};

export const getArchivedTracks = async (): Promise<ArchivedTracksResponse> => {
  const response = await API.get(API_ENDPOINTS.TRACKS.LIST);
  return response.data;
};

// 폴더 목록 조회
export const getTrackFolders = async (): Promise<TrackFoldersResponse> => {
  const response = await API.get(API_ENDPOINTS.TRACK_FOLDERS.LIST);
  return response.data;
};

// 폴더 생성
export const createTrackFolder = async (name: string, color: string): Promise<{ isSuccess: boolean; code: string; message: string; result: { folderId: number; name: string; color: string } }> => {
  const response = await API.post(API_ENDPOINTS.TRACK_FOLDERS.CREATE, {
    name,
    color,
  });
  return response.data;
};

// 폴더 내 곡 목록 조회
export const getTracksInFolder = async (folderId: number): Promise<{ isSuccess: boolean; code: string; message: string; result: Array<{ trackId: number; spotifyId: string; title: string; artist: string; album: string; duration: string; imageUrl: string; externalUrl: string }> }> => {
  const response = await API.get(API_ENDPOINTS.TRACK_FOLDERS.GET_TRACKS(folderId.toString()));
  return response.data;
};

// 폴더에 곡 추가 (단일 곡)
export const addTrackToFolder = async (folderId: number, trackId: number): Promise<{ isSuccess: boolean; code: string; message: string; result: { trackFolderId: number; tracks: Array<{ trackId: number; spotifyId: string; title: string; artist: string; album: string; duration: string }> } }> => {
  const response = await API.post(API_ENDPOINTS.TRACK_FOLDERS.ADD_TRACK(folderId.toString()), {
    trackId,
  });
  return response.data;
};

// 폴더에 여러 곡 추가 (개별 호출)
export const addTracksToFolder = async (folderId: number, trackIds: number[]): Promise<{ isSuccess: boolean; code: string; message: string; result: { trackFolderId: number; tracks: Array<{ trackId: number; spotifyId: string; title: string; artist: string; album: string; duration: string }> } }> => {
  // 각 곡을 개별적으로 추가
  const results = await Promise.all(
    trackIds.map(trackId => addTrackToFolder(folderId, trackId))
  );
  
  // 마지막 결과를 반환 (실제로는 모든 결과를 확인해야 함)
  return results[results.length - 1];
};

// 전체에서 곡 삭제
export const deleteTrack = async (trackId: number): Promise<{ isSuccess: boolean; code: string; message: string; result: object }> => {
  const response = await API.delete(API_ENDPOINTS.TRACKS.DELETE(trackId.toString()));
  return response.data;
};

// 폴더에서 곡 삭제
export const deleteTrackFromFolder = async (folderId: number, trackId: number): Promise<{ isSuccess: boolean; code: string; message: string; result: object }> => {
  const response = await API.delete(API_ENDPOINTS.TRACK_FOLDERS.REMOVE_TRACK(folderId.toString()) + `/${trackId}`);
  return response.data;
};

// 각 폴더의 곡 개수 조회
export const getFolderTrackCounts = async (): Promise<{ isSuccess: boolean; code: string; message: string; result: Record<number, number> }> => {
  const response = await API.get(API_ENDPOINTS.TRACK_FOLDERS.LIST);
  const folders = response.data.result;
  
  // 각 폴더의 곡 개수를 가져오기 위해 병렬로 API 호출
  const trackCounts: Record<number, number> = {};
  
  await Promise.all(
    folders.map(async (folder: TrackFolder) => {
      try {
        const tracksResponse = await API.get(API_ENDPOINTS.TRACK_FOLDERS.GET_TRACKS(folder.folderId.toString()));
        trackCounts[folder.folderId] = tracksResponse.data.result.length;
      } catch {
        trackCounts[folder.folderId] = 0;
      }
    })
  );
  
  return {
    isSuccess: true,
    code: "200",
    message: "Success",
    result: trackCounts
  };
}; 