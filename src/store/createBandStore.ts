import type { Artist } from "@/pages/Join/create_band/CreateBandArtist";
import type { Track } from "@/pages/Join/create_band/CreateBandSong";
import { proxy } from "valtio";

interface CreateBandStore {
  genres: string[];
  artists: Artist[];
  songs: Track[];
}

export const createBandStore = proxy<CreateBandStore>({
  genres: [],
  artists: [],
  songs: [],
});

export const createBandActions = {
  setGenres: (newGenres: string[]) => {
    createBandStore.genres = newGenres;
  },
  setArtists: (newArtists: Artist[]) => {
    createBandStore.artists = newArtists;
  },
  setSongs: (newSongs: Track[]) => {
    createBandStore.songs = newSongs;
  },
};
