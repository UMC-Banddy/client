import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import type { SessionEmoji, BandJoinResponse } from "./types";

export async function postBandJoin(bandId: number, session: SessionEmoji) {
  const url = API_ENDPOINTS.BANDS.JOIN(String(bandId));
  const { data } = await API.post(url, { session });
  return data as BandJoinResponse;
}
