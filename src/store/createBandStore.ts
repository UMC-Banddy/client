import type { Artist } from "@/pages/Join/create_band/CreateBandArtist";
import { proxy } from "valtio";

interface CreateBandStore {
  genres: number[];
  artists: Artist[];
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
  setArtists: (newArtists: Artist[]) => {
    createBandStore.artists = newArtists;
  },
};
