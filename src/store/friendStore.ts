import { proxy } from "valtio";

interface Friend {
  id: string;
  nickname: string;
  profileImage?: string;
  bio?: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface FriendRequest {
  id: string;
  fromUser: {
    id: string;
    nickname: string;
    profileImage?: string;
  };
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

interface FriendState {
  friends: Friend[];
  friendRequests: FriendRequest[];
  isLoading: boolean;
  error: string | null;
}

export const friendStore = proxy<FriendState>({
  friends: [],
  friendRequests: [],
  isLoading: false,
  error: null,
});

// Actions
export const friendActions = {
  setFriends: (friends: Friend[]) => {
    friendStore.friends = friends;
  },

  addFriend: (friend: Friend) => {
    friendStore.friends.push(friend);
  },

  removeFriend: (friendId: string) => {
    friendStore.friends = friendStore.friends.filter(
      (friend) => friend.id !== friendId
    );
  },

  setFriendRequests: (friendRequests: FriendRequest[]) => {
    friendStore.friendRequests = friendRequests;
  },

  addFriendRequest: (request: FriendRequest) => {
    friendStore.friendRequests.push(request);
  },

  updateFriendRequest: (requestId: string, status: FriendRequest["status"]) => {
    const request = friendStore.friendRequests.find(
      (req) => req.id === requestId
    );
    if (request) {
      request.status = status;
    }
  },

  removeFriendRequest: (requestId: string) => {
    friendStore.friendRequests = friendStore.friendRequests.filter(
      (request) => request.id !== requestId
    );
  },

  setLoading: (isLoading: boolean) => {
    friendStore.isLoading = isLoading;
  },

  setError: (error: string | null) => {
    friendStore.error = error;
  },

  updateFriendStatus: (
    friendId: string,
    isOnline: boolean,
    lastSeen?: string
  ) => {
    const friend = friendStore.friends.find((f) => f.id === friendId);
    if (friend) {
      friend.isOnline = isOnline;
      friend.lastSeen = lastSeen;
    }
  },
};
