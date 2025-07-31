export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/member/login",
    SIGNUP: "/member",
    VERIFY_CODE: "/auth/verify",
    SEND_CODE: "/auth/send",
    CHECK_NICKNAME: "/member/check-nickname",
    LOGOUT: "/auth/logout",
    INACTIVE: "/auth/inactive",
    REFRESH_TOKEN: "/auth/refreshToken",
  },

  SURVEY: {
    SUBMIT: "/member/survey",
    KEYWORD: "/member/survey/keyword",
    ARTIST: "/member/survey/artist",
    ARTIST_SEARCH: "/member/survey/artists/search",
    GENRE: "/member/survey/genre",
    SESSION: "/member/survey/session",
    GENRE_SEARCH: "/member/survey/genres/search",
  },

  FRIEND: {
    REQUEST: "/api/friend/request",
    ACCEPT: (requestId: string) => `/api/friend/request/${requestId}/accept`,
    REJECT: (requestId: string) => `/api/friend/request/${requestId}/reject`,
    LIST: "/api/friend",
    REQUEST_DETAIL: (requestId: string) => `/api/friend/request/${requestId}`,
    DELETE: (friendId: string) => `/api/friend/${friendId}`,
  },

  PROFILE: {
    SELF: "/api/profile",
    EDIT: "/api/profile",
    UPDATE: "/api/profile",
    MEDIA_UPLOAD: "/api/profile/media",
    OTHER: (memberId: string) => `/member/${memberId}/profile`,
    OTHER_TRACKS: (memberId: string) =>
      `/member/${memberId}/profile/saved-tracks`,
    OTHER_TAGS: (memberId: string) => `/member/${memberId}/tags`,
    NOTIFICATIONS: "/api/notifications",
  },

  ALBUM_TRACKS: {
    SIMILAR_TRACKS: "/tracks/similar",
    SIMILAR_ARTISTS: "/artists/similar",
    PREFERENCE: "/tracks/preferences",
  },

  BANDS: {
    PROFILE: (bandId: string) => `/api/band/${bandId}/profile`,
    DETAIL: (bandId: string) => `/api/band/${bandId}/detail`,
    LIST: "/api/bands", // 모든 밴드 목록 조회 (백엔드 구현 필요)
    RECOMMENDED: "/api/bands/recommended", // 추천 밴드 목록 조회 (백엔드 구현 필요)
    BOOKMARK: (bandId: string) => `/api/bands/${bandId}/bookmark`,
    BOOKMARKS: "/api/bands/bookmarks",
    DELETE_BOOKMARK: (bandId: string) => `/api/bands/${bandId}/bookmark`,
    RECRUIT: "/api/recruitments",
    JOIN: (bandId: string) => `/api/bands/${bandId}/join`, // 해당 api가 스웨거에 없음 백엔드와 소통 필요해보임 (노션에는 있음)
  },

  RECRUITMENT: {
    JOIN: (bandId: string) => `/api/bands/${bandId}/join`, // 해당 api가 스웨거에 없음 백엔드와 소통 필요해보임 (노션에는 있음)
    CREATE: "/api/recruitments",
    EDIT: "/api/recruitments", // 스웨거 문서만 봐서는 옳게 구현되어 있는 건지 확인 필요.. (노션과 다른 주소, 엔드포인트 뒤 슬래쉬 형태가 비정상적)
    DETAIL: (recruitId: string) => `/api/recruitments/${recruitId}`, // 해당 api가 스웨거에 없음 백엔드와 소통 필요해보임 (노션에는 있음)
    PROCESS: (recruitId: string) => `/api/recruitments/${recruitId}/requests`, // 해당 api가 스웨거에 없음 백엔드와 소통 필요해보임 (노션에는 있음)
  },

  CHAT: {
    ROOMS: "/api/chat/rooms",
    CREATE_GROUP: "/api/chat/rooms",
    FRIENDS: "/api/chat/friends",
    CREATE_WITH_FRIEND: "/api/chat/friends",
    PRIVATE: "/api/chat/rooms/friends",
    MESSAGES: (
      roomId: string | number,
      cursor: string | number = 0,
      limit: number = 20
    ) => `/api/chat/rooms/${roomId}/messages?cursor=${cursor}&limit=${limit}`,
    ROOM_MEMBERS: (roomId: string | number) => `/api/chat/rooms/${roomId}`,
    INVITE: (roomId: string) => `/api/chat/rooms/${roomId}/members/invite`,
    JOIN: (roomId: string) => `/api/chat/rooms/${roomId}/members/join`,
    LEAVE: (roomId: string) => `/api/chat/rooms/${roomId}/members/exit`,
    CREATE_INTERVIEW: (bandId: string) => `/api/chat/rooms/interview/${bandId}`,
    CREATE_APPLICATION: (bandId: string) =>
      `/api/chat/rooms/application/${bandId}`,
  },

  WEBSOCKET: {
    // 소켓 관련 모든 api 스웨거에 없음 백엔드와 소통 필요해보임 (노션에는 있음)
    SUBSCRIBE: (roomId: string) => `/topic/chat/${roomId}`,
    SEND_MESSAGE: (roomId: string) => `/app/chat/sendMessage/${roomId}`,
    UNSUBSCRIBE: (roomId: string) => `/user/${roomId}/queue`,
    BASE: "ws",
  },

  MUSIC: {
    SEARCH_ALL: "/api/music/search/artists", // 실제 아티스트 검색 엔드포인트로 수정
    SEARCH_TRACKS: "/api/music/search/tracks",
    SEARCH_ARTISTS: "/api/music/search/artists",
    SEARCH_ALBUMS: "/api/music/search/albums",
    AUTOCOMPLETE_TRACKS: "/api/autocomplete/tracks",
    AUTOCOMPLETE_MUSIC: "/api/autocomplete/music",
    AUTOCOMPLETE_ARTISTS: "/api/autocomplete/artists",
    AUTOCOMPLETE_ALBUMS: "/api/autocomplete/albums",
  },

  TRACKS: {
    SAVE: "/api/tracks",
    DELETE: (trackId: string) => `/api/tracks/${trackId}`,
    TOGGLE: "/api/tracks/toggle",
    LIST: "/api/tracks",
    DETAIL: (trackId: string) => `/api/tracks/${trackId}`,
    RECENT: "/api/tracks/recent",
  },

  TRACK_FOLDERS: {
    CREATE: "/api/track-folders",
    DELETE: (folderId: string) => `/api/track-folders/${folderId}`,
    LIST: "/api/track-folders",
    ADD_TRACK: (folderId: string) => `/api/track-folders/${folderId}/tracks`,
    REMOVE_TRACK: (folderId: string) => `/api/track-folders/${folderId}/tracks`,
    GET_TRACKS: (folderId: string) => `/api/track-folders/${folderId}/tracks`,
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
    ADD_ARTIST: (folderId: string) => `/api/artist-folders/${folderId}/artists`,
    REMOVE_ARTIST: (folderId: string, artistId: string) =>
      `/api/artist-folders/${folderId}/artists/${artistId}`,
    GET_ARTISTS: (folderId: string) =>
      `/api/artist-folders/${folderId}/artists`,
  },

  ALBUMS: {
    SAVE: "/api/albums",
    DELETE: (albumId: string) => `/api/albums/${albumId}`,
    TOGGLE: "/api/albums/toggle",
    LIST: "/api/albums",
    DETAIL: (albumId: string) => `/api/albums/${albumId}`,
    VISIBILITY: (albumId: string) => `/api/albums/${albumId}/visibility`,
  },

  ALBUM_FOLDERS: {
    CREATE: "/api/album-folders",
    DELETE: (folderId: string) => `/api/album-folders/${folderId}`,
    LIST: "/api/album-folders",
    ADD_ALBUM: (folderId: string) => `/api/album-folders/${folderId}/albums`,
    REMOVE_ALBUM: (folderId: string, albumId: string) =>
      `/api/album-folders/${folderId}/albums/${albumId}`,
    GET_ALBUMS: (folderId: string) => `/api/album-folders/${folderId}/albums`,
  },
};
