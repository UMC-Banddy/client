import { proxy } from "valtio";

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumImage?: string;
  duration: number;
  isSaved: boolean;
  spotifyId?: string;
  appleMusicId?: string;
}

interface Artist {
  id: string;
  name: string;
  image?: string;
  followers?: number;
  genres?: string[];
  isSaved: boolean;
  spotifyId?: string;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  image?: string;
  releaseDate?: string;
  trackCount?: number;
  isSaved: boolean;
  spotifyId?: string;
}

interface MusicFolder {
  id: string;
  name: string;
  type: "track" | "artist" | "album";
  itemCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MusicState {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  trackFolders: MusicFolder[];
  artistFolders: MusicFolder[];
  albumFolders: MusicFolder[];
  searchResults: {
    tracks: Track[];
    artists: Artist[];
    albums: Album[];
  };
  currentPlaying: Track | null;
  isLoading: boolean;
  error: string | null;
}

export const musicStore = proxy<MusicState>({
  tracks: [],
  artists: [],
  albums: [],
  trackFolders: [],
  artistFolders: [],
  albumFolders: [],
  searchResults: {
    tracks: [],
    artists: [],
    albums: [],
  },
  currentPlaying: null,
  isLoading: false,
  error: null,
});

// Actions
export const musicActions = {
  setTracks: (tracks: Track[]) => {
    musicStore.tracks = tracks;
  },

  setArtists: (artists: Artist[]) => {
    musicStore.artists = artists;
  },

  setAlbums: (albums: Album[]) => {
    musicStore.albums = albums;
  },

  setTrackFolders: (trackFolders: MusicFolder[]) => {
    musicStore.trackFolders = trackFolders;
  },

  setArtistFolders: (artistFolders: MusicFolder[]) => {
    musicStore.artistFolders = artistFolders;
  },

  setAlbumFolders: (albumFolders: MusicFolder[]) => {
    musicStore.albumFolders = albumFolders;
  },

  setSearchResults: (searchResults: MusicState["searchResults"]) => {
    musicStore.searchResults = searchResults;
  },

  setCurrentPlaying: (currentPlaying: Track | null) => {
    musicStore.currentPlaying = currentPlaying;
  },

  // Track actions
  addTrack: (track: Track) => {
    musicStore.tracks.push(track);
  },

  removeTrack: (trackId: string) => {
    musicStore.tracks = musicStore.tracks.filter(
      (track) => track.id !== trackId
    );
  },

  toggleTrackSave: (trackId: string) => {
    const track = musicStore.tracks.find((t) => t.id === trackId);
    if (track) {
      track.isSaved = !track.isSaved;
    }
  },

  // Artist actions
  addArtist: (artist: Artist) => {
    musicStore.artists.push(artist);
  },

  removeArtist: (artistId: string) => {
    musicStore.artists = musicStore.artists.filter(
      (artist) => artist.id !== artistId
    );
  },

  toggleArtistSave: (artistId: string) => {
    const artist = musicStore.artists.find((a) => a.id === artistId);
    if (artist) {
      artist.isSaved = !artist.isSaved;
    }
  },

  // Album actions
  addAlbum: (album: Album) => {
    musicStore.albums.push(album);
  },

  removeAlbum: (albumId: string) => {
    musicStore.albums = musicStore.albums.filter(
      (album) => album.id !== albumId
    );
  },

  toggleAlbumSave: (albumId: string) => {
    const album = musicStore.albums.find((a) => a.id === albumId);
    if (album) {
      album.isSaved = !album.isSaved;
    }
  },

  // Folder actions
  addTrackFolder: (folder: MusicFolder) => {
    musicStore.trackFolders.push(folder);
  },

  removeTrackFolder: (folderId: string) => {
    musicStore.trackFolders = musicStore.trackFolders.filter(
      (folder) => folder.id !== folderId
    );
  },

  addArtistFolder: (folder: MusicFolder) => {
    musicStore.artistFolders.push(folder);
  },

  removeArtistFolder: (folderId: string) => {
    musicStore.artistFolders = musicStore.artistFolders.filter(
      (folder) => folder.id !== folderId
    );
  },

  addAlbumFolder: (folder: MusicFolder) => {
    musicStore.albumFolders.push(folder);
  },

  removeAlbumFolder: (folderId: string) => {
    musicStore.albumFolders = musicStore.albumFolders.filter(
      (folder) => folder.id !== folderId
    );
  },

  setLoading: (isLoading: boolean) => {
    musicStore.isLoading = isLoading;
  },

  setError: (error: string | null) => {
    musicStore.error = error;
  },

  clearSearchResults: () => {
    musicStore.searchResults = {
      tracks: [],
      artists: [],
      albums: [],
    };
  },
};
