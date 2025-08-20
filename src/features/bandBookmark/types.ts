export type BandStatus = "RECRUITING" | "ACTIVE" | "CLOSED";

export interface BandBookmarkItem {
  bandId: number;
  name: string;
  imageUrl: string | null;
  status: BandStatus;
  memberSummary: string;
  memberCount: number;
  soundUrl?: string | null;
  soundOn?: boolean;
}
