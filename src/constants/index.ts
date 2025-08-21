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
    OTHER: (memberId: string) => `/api/member/${memberId}/profile`,
    OTHER_TRACKS: (memberId: string) =>
      `/api/member/${memberId}/profile/saved-tracks`,
    OTHER_ALBUMS: (memberId: string) =>
      `/api/member/${memberId}/profile/saved-albums`,
    OTHER_TAGS: (memberId: string) => `/api/member/${memberId}/tags`,
    NOTIFICATIONS: "/api/notifications",
    MARK_NOTIFICATION_READ: "/api/notifications/read",
  },

  ALBUM_TRACKS: {
    SIMILAR_TRACKS: "/api/tracks/similar",
    SIMILAR_ARTISTS: "/api/artists/similar",
    PREFERENCE: "/api/tracks/preferences",
  },

  BANDS: {
    PROFILE: (bandId: string) => `/api/band/${bandId}/profile`,
    DETAIL: (bandId: string) => `/api/band/${bandId}/detail`,
    MEMBERS: (bandId: string) => `/api/band/${bandId}/members`,
    TRACKS: (bandId: string) => `/api/band/${bandId}/tracks`,
    ARTISTS: (bandId: string) => `/api/band/${bandId}/artists`,
    LIST: "/api/bands", // 모든 밴드 목록 조회 (status 파라미터로 필터링 가능)
    RECOMMENDED: "/api/bands/recommended", // 추천 밴드 목록 조회 (백엔드 구현 필요)
    BOOKMARK: (bandId: string) => `/api/bands/${bandId}/bookmark`,
    BOOKMARKS: "/api/bands/bookmarks",
    DELETE_BOOKMARK: (bandId: string) => `/api/bands/${bandId}/bookmark`,
    RECRUIT: "/api/recruitments", // POST/PUT만 지원 (생성/수정용)
    JOIN: (bandId: string) => `/api/bands/${bandId}/join`,
  },

  RECRUITMENT: {
    JOIN: (bandId: string) => `/api/bands/${bandId}/join`,
    CREATE: "/api/recruitments", // POST: 밴드 모집 공고 생성
    EDIT: "/api/recruitments", // PUT: 밴드 모집 공고 수정
    DETAIL: (bandId: string) => `/api/recruitments/${bandId}`, // GET: 특정 모집 공고 상세 조회
    PROCESS: (bandId: string) => `/api/recruitments/${bandId}`, // PUT: 모집 공고 처리 (지원/거절 등)
    RECRUITING: "/api/recruitments/recruiting", // GET: 모집중인 밴드만 조회
  },

  CHAT: {
    ROOMS: "/api/chat/rooms",
    CREATE_GROUP: "/api/chat/rooms",
    UPDATE_GROUP: "/api/chat/rooms",
    FRIENDS: "/api/chat/friends",
    CREATE_WITH_FRIEND: "/api/chat/friends",
    PRIVATE: "/api/chat/rooms/friends",
    REQUESTS: "/api/chat/requests",
    DELETE_REQUEST: (requestId: string) => `/api/chat/requests/${requestId}`,
    MESSAGES: (
      roomId: string | number,
      cursor: string | number = 0,
      limit: number = 20
    ) => `/api/chat/rooms/${roomId}/messages?cursor=${cursor}&limit=${limit}`,
    ROOM_MEMBERS: (roomId: string | number) => `/api/chat/rooms/${roomId}`,
    JOIN: (roomId: string) => `/api/chat/rooms/${roomId}/members/join`,
    LEAVE: (roomId: string) => `/api/chat/rooms/${roomId}/members/exit`,
    BAND_JOIN: (bandId: string) => `/api/chat/bands/${bandId}/join`,
    PIN: "/api/chat/rooms/pin",
    UNPIN: "/api/chat/rooms/unpin",
  },

  WEBSOCKET: {
    // 웹소켓 관련 엔드포인트 (서버 스펙 준수)
    SUBSCRIBE_GROUP: (roomId: string | number) => `/topic/room/${roomId}`,
    SUBSCRIBE_PRIVATE: (roomId: string | number) =>
      `/user/queue/room/${roomId}`,
    SUBSCRIBE_UNREAD: "/user/queue/unread",
    // 전송 경로 분리 (그룹/개인/밴드)
    SEND_MESSAGE_GROUP: (roomId: string | number) =>
      `/app/chat/group.sendMessage/${roomId}`,
    SEND_MESSAGE_PRIVATE: (roomId: string | number) =>
      `/app/chat/private.sendMessage/${roomId}`,
    SEND_MESSAGE_BAND: (roomId: string | number) =>
      `/app/chat/private.sendMessage/${roomId}`,
    BASE: "ws",
  },

  MUSIC: {
    SEARCH: "/api/music/search",
    SEARCH_ALL: "/api/music/search/artists",
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
    SIMILAR: "/api/tracks/similar",
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
    SIMILAR: "/api/artists/similar",
    QUESTION: "/api/artists/question",
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
