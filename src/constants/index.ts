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
    REQUEST: "/friend/request",
    ACCEPT: (requestId: string) => `/friend/request/${requestId}/accept`,
    REJECT: (requestId: string) => `/friend/request/${requestId}/reject`,
    LIST: "/friend",
    REQUEST_DETAIL: (requestId: string) => `/friend/request/${requestId}`,
    DELETE: (friendId: string) => `/friend/${friendId}`,
  },

  PROFILE: {
    SELF: "/api/profile",
    EDIT: "/api/profile",
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
    PROFILE: (bandId: string) => `/band/${bandId}/profile`,
    DETAIL: (bandId: string) => `/band/${bandId}/detail`,
    LIST: "/bands", // 모든 밴드 목록 조회 (백엔드 구현 필요)
    RECOMMENDED: "/bands/recommended", // 추천 밴드 목록 조회 (백엔드 구현 필요)
    BOOKMARK: (bandId: string) => `/bands/${bandId}/bookmark`,
    BOOKMARKS: "/bands/bookmarks",
    DELETE_BOOKMARK: (bandId: string) => `/bands/${bandId}/bookmark`,
    RECRUIT: "/recruitments",
    JOIN: (bandId: string) => `/bands/${bandId}/join`, // 해당 api가 스웨거에 없음 백엔드와 소통 필요해보임 (노션에는 있음)
  },

  RECRUITMENT: {
    JOIN: (bandId: string) => `/bands/${bandId}/join`, // 해당 api가 스웨거에 없음 백엔드와 소통 필요해보임 (노션에는 있음)
    CREATE: "/recruitments/",
    EDIT: "/recruitments/", // 스웨거 문서만 봐서는 옳게 구현되어 있는 건지 확인 필요.. (노션과 다른 주소, 엔드포인트 뒤 슬래쉬 형태가 비정상적)
    DETAIL: (recruitId: string) => `/recruitments/${recruitId}`, // 해당 api가 스웨거에 없음 백엔드와 소통 필요해보임 (노션에는 있음)
    PROCESS: (recruitId: string) => `/recruitments/${recruitId}/requests`, // 해당 api가 스웨거에 없음 백엔드와 소통 필요해보임 (노션에는 있음)
  },

  CHAT: {
    ROOMS: "/chat/rooms",
    CREATE_GROUP: "/chat/rooms",
    FRIENDS: "/chat/friends",
    CREATE_WITH_FRIEND: "/chat/friends",
    PRIVATE: "/chat/rooms/friends",
    MESSAGES: (
      roomId: string | number,
      cursor: string | number = 0,
      limit: number = 20
    ) => `/chat/rooms/${roomId}/messages?cursor=${cursor}&limit=${limit}`,
    ROOM_MEMBERS: (roomId: string | number) => `/chat/rooms/${roomId}`,
    INVITE: (roomId: string) => `/chat/rooms/${roomId}/members/invite`,
    JOIN: (roomId: string) => `/chat/rooms/${roomId}/members/join`,
    LEAVE: (roomId: string) => `/chat/rooms/${roomId}/members/exit`,
    CREATE_INTERVIEW: (bandId: string) => `/chat/rooms/interview/${bandId}`,
    CREATE_APPLICATION: (bandId: string) => `/chat/rooms/application/${bandId}`,
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
    SAVE: "/tracks",
    DELETE: (trackId: string) => `/tracks/${trackId}`,
    TOGGLE: "/tracks/toggle",
    LIST: "/tracks",
    DETAIL: (trackId: string) => `/tracks/${trackId}`,
    RECENT: "/tracks/recent",
  },

  TRACK_FOLDERS: {
    CREATE: "/track-folders",
    DELETE: (folderId: string) => `/track-folders/${folderId}`,
    LIST: "/track-folders",
    ADD_TRACK: (folderId: string) => `/track-folders/${folderId}/tracks`,
    REMOVE_TRACK: (folderId: string) => `/track-folders/${folderId}/tracks`,
    GET_TRACKS: (folderId: string) => `/track-folders/${folderId}/tracks`,
  },

  ARTISTS: {
    SAVE: "/artists",
    DELETE: (artistId: string) => `/artists/${artistId}`,
    TOGGLE: "/artists/toggle",
    LIST: "/artists",
    DETAIL: (artistId: string) => `/artists/${artistId}`,
  },

  ARTIST_FOLDERS: {
    CREATE: "/artist-folders",
    DELETE: (folderId: string) => `/artist-folders/${folderId}`,
    LIST: "/artist-folders",
    ADD_ARTIST: (folderId: string) => `/artist-folders/${folderId}/artists`,
    REMOVE_ARTIST: (folderId: string, artistId: string) =>
      `/artist-folders/${folderId}/artists/${artistId}`,
    GET_ARTISTS: (folderId: string) => `/artist-folders/${folderId}/artists`,
  },

  ALBUMS: {
    SAVE: "/albums",
    DELETE: (albumId: string) => `/albums/${albumId}`,
    TOGGLE: "/albums/toggle",
    LIST: "/albums",
    DETAIL: (albumId: string) => `/albums/${albumId}`,
    VISIBILITY: (albumId: string) => `/albums/${albumId}/visibility`,
  },

  ALBUM_FOLDERS: {
    CREATE: "/album-folders",
    DELETE: (folderId: string) => `/album-folders/${folderId}`,
    LIST: "/album-folders",
    ADD_ALBUM: (folderId: string) => `/album-folders/${folderId}/albums`,
    REMOVE_ALBUM: (folderId: string, albumId: string) =>
      `/album-folders/${folderId}/albums/${albumId}`,
    GET_ALBUMS: (folderId: string) => `/album-folders/${folderId}/albums`,
  },
};
