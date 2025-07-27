export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/member/login",
    SIGNUP: "/api/member",
    VERIFY_CODE: "/api/auth/verify",
    SEND_CODE: "/api/auth/send",
    CHECK_NICKNAME: "/api/member/check-nickname",
    LOGOUT: "/api/auth/logout",
    INACTIVE: "/api/auth/inactive",
    REFRESH_TOKEN: "/api/auth/refreshToken",
  },

  SURVEY: {
    SUBMIT: "/api/member/survey",
    KEYWORD: "/api/member/survey/keyword",
    ARTIST: "/api/member/survey/artist",
    ARTIST_SEARCH: "/api/member/survey/artists/search",
    GENRE: "/api/member/survey/genre",
    SESSION: "/api/member/survey/session",
    GENRE_SEARCH: "/api/member/survey/genres/search",
  },

  FRIEND: {
    REQUEST: "/api/friend/request",
    ACCEPT: (requestId: string) => `/api/friend/request/${requestId}/accept`,
    REJECT: (requestId: string) => `/api/friend/request/${requestId}/reject`,
    LIST: "/api/friend",
    REQUEST_DETAIL: (requestId: string) => `/api/friend/request/${requestId}`,
    DELETE: (friendId: string) => `/api/friend/${friendId}`,
    REQUESTS: "/api/friend/requests",
  },

  PROFILE: {
    SELF: "/api/profile",
    EDIT: "/api/profile",
    MEDIA_UPLOAD: "/api/profile/media",
    OTHER: (memberId: string) => `/api/members/${memberId}/profile`,
    OTHER_TRACKS: (memberId: string) => `/api/members/${memberId}/saved-tracks`,
    OTHER_TAGS: (memberId: string) => `/api/members/${memberId}/tags`,
    NOTIFICATIONS: "/api/notifications",
  },

  ALBUM_TRACKS: {
    RECENT: "/api/album/tracks/recent",
    SIMILAR_TRACKS: "/api/tracks/similar",
    SIMILAR_ARTISTS: "/api/artists/similar",
    PREFERENCE: "/api/tracks/preferences",
  },

  BANDS: {
    PROFILE: (bandId: string) => `/api/bands/${bandId}/profile`,
    DETAIL: (bandId: string) => `/api/bands/${bandId}/detail`,
    BOOKMARK: (bandId: string) => `/api/bands/${bandId}/bookmark`,
    BOOKMARKS: "/api/bands/bookmarks",
    DELETE_BOOKMARK: (bandId: string) => `/api/bands/${bandId}/bookmark`,
  },

  ALBUM_FOLDERS: {
    TOGGLE_VISIBILITY: "/api/album-folders/visibility",
  },

  RECRUITMENT: {
    JOIN: (bandId: string) => `/api/bands/${bandId}/join`,
    CREATE: "/api/recruitments",
    EDIT: (recruitId: string) => `/api/recruitments/${recruitId}`,
    DETAIL: (recruitId: string) => `/api/recruitments/${recruitId}`,
    PROCESS: (recruitId: string) => `/api/recruitments/${recruitId}/requests`,
  },

  CHAT: {
    ROOMS: "/api/chat/rooms",
    CREATE_GROUP: "/api/chat/rooms",
    FRIENDS: "/api/chat/friends",
    CREATE_WITH_FRIEND: "/api/chat/friends",
    MESSAGES: (roomId: string, cursor: string) =>
      `/api/chat/rooms/${roomId}/messages?after=${cursor}`,
    INVITE: (roomId: string) => `/api/chat/rooms/${roomId}/members/invite`,
    JOIN: (roomId: string) => `/api/chat/rooms/${roomId}/members/join`,
    LEAVE: (roomId: string) => `/api/chat/rooms/${roomId}/members/leave`,
    CREATE_INTERVIEW: (bandId: string) => `/api/chat/rooms/interview/${bandId}`,
    CREATE_APPLICATION: (bandId: string) =>
      `/api/chat/rooms/application/${bandId}`,
  },

  WEBSOCKET: {
    SUBSCRIBE: (roomId: string) => `/topic/chat/${roomId}`,
    SEND_MESSAGE: (roomId: string) => `/app/chat/sendMessage/${roomId}`,
    UNSUBSCRIBE: (roomId: string) => `/user/${roomId}/queue`,
    BASE: "ws",
  },

  MUSIC: {
    SEARCH_ALL: "/api/music/search",
    SEARCH_TRACKS: "/api/music/search/tracks",
    SEARCH_ARTISTS: "/api/music/search/artists",
    SEARCH_ALBUMS: "/api/music/search/albums",
    AUTOCOMPLETE_TRACKS: "/api/autocomplete/tracks",
    AUTOCOMPLETE_ARTISTS: "/api/autocomplete/artists",
    AUTOCOMPLETE_ALBUMS: "/api/autocomplete/albums",

    TRACKS: {
      SAVE: "/api/tracks",
      DELETE: (trackId: string) => `/api/tracks/${trackId}`,
      TOGGLE: "/api/tracks/toggle",
      LIST: "/api/tracks",
      DETAIL: (trackId: string) => `/api/tracks/${trackId}`,
    },

    TRACK_FOLDERS: {
      CREATE: "/api/track-folders",
      DELETE: (folderId: string) => `/api/track-folders/${folderId}`,
      LIST: "/api/track-folders",
      ADD_TRACK: (folderId: string) => `/api/track-folders/${folderId}/tracks`,
      DELETE_TRACK: (folderId: string, trackId: string) =>
        `/api/track-folders/${folderId}/tracks/${trackId}`,
      LIST_TRACKS: (folderId: string) =>
        `/api/track-folders/${folderId}/tracks`,
    },

    ARTISTS: {
      SAVE: "/api/artists",
      DELETE: (artistId: string) => `/api/artists/${artistId}`,
      TOGGLE: "/api/artists/toggle",
      LIST: "/api/artists",
      DETAIL: (artistId: string) => `/api/artists/${artistId}`,
    },

    ARTIST_FOLDERS: {
      CREATE: "/api/artist-folders",
      DELETE: (folderId: string) => `/api/artist-folders/${folderId}`,
      LIST: "/api/artist-folders",
      ADD_ARTIST: (folderId: string) =>
        `/api/artist-folders/${folderId}/artists`,
      DELETE_ARTIST: (folderId: string, artistId: string) =>
        `/api/artist-folders/${folderId}/artists/${artistId}`,
      LIST_ARTISTS: (folderId: string) =>
        `/api/artist-folders/${folderId}/artists`,
    },

    ALBUMS: {
      SAVE: "/api/albums",
      DELETE: (albumId: string) => `/api/albums/${albumId}`,
      TOGGLE: "/api/albums/toggle",
      LIST: "/api/albums",
      DETAIL: (albumId: string) => `/api/albums/${albumId}`,
    },

    ALBUM_FOLDERS: {
      CREATE: "/api/album-folders",
      DELETE: (folderId: string) => `/api/album-folders/${folderId}`,
      LIST: "/api/album-folders",
      ADD_ALBUM: (folderId: string) => `/api/album-folders/${folderId}/albums`,
      DELETE_ALBUM: (folderId: string, albumId: string) =>
        `/api/album-folders/${folderId}/albums/${albumId}`,
      LIST_ALBUMS: (folderId: string) =>
        `/api/album-folders/${folderId}/albums`,
    },
  },
};
