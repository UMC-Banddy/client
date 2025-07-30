import { proxy } from "valtio";

interface CreateBandStore {
  genres: number[];
  artists: number[];
  songs: number[];
}

export const createBandStore = proxy<CreateBandStore>({
  genres: [],
  artists: [],
  songs: [],
});
export const createBandActions = {
  setGenres: (newGenres: number[]) => {
    createBandStore.genres = newGenres;
  },
};
