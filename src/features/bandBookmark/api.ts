import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import type { BandBookmarkItem } from "./types";

export async function getBandBookmarks(): Promise<BandBookmarkItem[]> {
  const { data } = await API.get(API_ENDPOINTS.BANDS.BOOKMARKS);
  return data as BandBookmarkItem[];
}

export async function addBandBookmark(bandId: number): Promise<void> {
  await API.post(API_ENDPOINTS.BANDS.BOOKMARK(String(bandId)));
}

export async function removeBandBookmark(bandId: number): Promise<void> {
  await API.delete(API_ENDPOINTS.BANDS.BOOKMARK(String(bandId)));
}
