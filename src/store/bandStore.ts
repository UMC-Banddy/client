import { proxy } from "valtio";

interface BandMember {
  id: string;
  nickname: string;
  profileImage?: string;
  role: string;
  isKing: boolean;
  joinedAt: string;
}

interface Band {
  id: string;
  name: string;
  description?: string;
  profileImage?: string;
  coverImage?: string;
  members: BandMember[];
  memberCount: number;
  maxMembers: number;
  isBookmarked: boolean;
  isRecruiting: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BandState {
  bands: Band[];
  myBands: Band[];
  bookmarkedBands: Band[];
  currentBand: Band | null;
  isLoading: boolean;
  error: string | null;
}

export const bandStore = proxy<BandState>({
  bands: [],
  myBands: [],
  bookmarkedBands: [],
  currentBand: null,
  isLoading: false,
  error: null,
});

// Actions
export const bandActions = {
  setBands: (bands: Band[]) => {
    bandStore.bands = bands;
  },

  setMyBands: (myBands: Band[]) => {
    bandStore.myBands = myBands;
  },

  setBookmarkedBands: (bookmarkedBands: Band[]) => {
    bandStore.bookmarkedBands = bookmarkedBands;
  },

  setCurrentBand: (currentBand: Band | null) => {
    bandStore.currentBand = currentBand;
  },

  addBand: (band: Band) => {
    bandStore.bands.push(band);
  },

  updateBand: (bandId: string, updates: Partial<Band>) => {
    // Update in bands array
    const bandIndex = bandStore.bands.findIndex((band) => band.id === bandId);
    if (bandIndex !== -1) {
      bandStore.bands[bandIndex] = {
        ...bandStore.bands[bandIndex],
        ...updates,
      };
    }

    // Update in myBands array
    const myBandIndex = bandStore.myBands.findIndex(
      (band) => band.id === bandId
    );
    if (myBandIndex !== -1) {
      bandStore.myBands[myBandIndex] = {
        ...bandStore.myBands[myBandIndex],
        ...updates,
      };
    }

    // Update in bookmarkedBands array
    const bookmarkedBandIndex = bandStore.bookmarkedBands.findIndex(
      (band) => band.id === bandId
    );
    if (bookmarkedBandIndex !== -1) {
      bandStore.bookmarkedBands[bookmarkedBandIndex] = {
        ...bandStore.bookmarkedBands[bookmarkedBandIndex],
        ...updates,
      };
    }

    // Update currentBand if it's the same band
    if (bandStore.currentBand?.id === bandId) {
      bandStore.currentBand = { ...bandStore.currentBand, ...updates };
    }
  },

  removeBand: (bandId: string) => {
    bandStore.bands = bandStore.bands.filter((band) => band.id !== bandId);
    bandStore.myBands = bandStore.myBands.filter((band) => band.id !== bandId);
    bandStore.bookmarkedBands = bandStore.bookmarkedBands.filter(
      (band) => band.id !== bandId
    );

    if (bandStore.currentBand?.id === bandId) {
      bandStore.currentBand = null;
    }
  },

  toggleBookmark: (bandId: string) => {
    const band = bandStore.bands.find((b) => b.id === bandId);
    if (band) {
      band.isBookmarked = !band.isBookmarked;

      // Update bookmarkedBands array
      if (band.isBookmarked) {
        bandStore.bookmarkedBands.push(band);
      } else {
        bandStore.bookmarkedBands = bandStore.bookmarkedBands.filter(
          (b) => b.id !== bandId
        );
      }
    }
  },

  addMember: (bandId: string, member: BandMember) => {
    const band = bandStore.bands.find((b) => b.id === bandId);
    if (band) {
      band.members.push(member);
      band.memberCount += 1;
    }

    if (bandStore.currentBand?.id === bandId) {
      bandStore.currentBand.members.push(member);
      bandStore.currentBand.memberCount += 1;
    }
  },

  removeMember: (bandId: string, memberId: string) => {
    const band = bandStore.bands.find((b) => b.id === bandId);
    if (band) {
      band.members = band.members.filter((m) => m.id !== memberId);
      band.memberCount -= 1;
    }

    if (bandStore.currentBand?.id === bandId) {
      bandStore.currentBand.members = bandStore.currentBand.members.filter(
        (m) => m.id !== memberId
      );
      bandStore.currentBand.memberCount -= 1;
    }
  },

  setLoading: (isLoading: boolean) => {
    bandStore.isLoading = isLoading;
  },

  setError: (error: string | null) => {
    bandStore.error = error;
  },
};
