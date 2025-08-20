import Layout from "@/widgets/Layout/Layout";
import HomePage from "@/pages/Home/HomePage";
import LoginPage from "@/pages/Login/LoginPage";
import SignupPage from "@/pages/Signup/SignupPage";
import SignupVerifyPage from "@/pages/Signup/SignupVerifyPage";
import SignupPasswordPage from "@/pages/Signup/SignupPasswordPage";
import SignupPasswordConfirmStep from "@/pages/Signup/SignupPasswordConfirmStep";
import SignupNicknamePage from "@/pages/Signup/SignupNicknamePage";
import SignupProfilePage from "@/pages/Signup/SignupProfilePage";
import SignupCompletePage from "@/pages/Signup/SignupCompletePage";
import ArtistsPage from "@/pages/Artist/ArtistsPage";
import ArtistDetailPage from "@/pages/Artist/ArtistDetailPage";
import BandDetailPage from "@/pages/Band/BandDetailPage";
import BandChatPage from "@/pages/Band/BandChatPage";
import ManualPage from "@/pages/Manual/ManualPage";
import SettingsPage from "@/pages/Settings/SettingsPage";
import NotFoundPage from "@/pages/NotFound/NotFoundPage";
import Join from "@/pages/Join/Join";
import BandRecruit from "@/pages/Join/BandRecruit";
import MyPage from "@/pages/My/MyPage";
import PeoplePage from "@/pages/Home/BandDetailPage/PeoplePage";
import PlaylistPage from "@/pages/Home/BandDetailPage/PlaylistPage";
import PreferPage from "@/pages/Home/BandDetailPage/PreferPage";
import CreateBand from "@/pages/Join/create_band/CreateBand";
import CreateChat from "@/pages/Join/CreateChat";
import CreateChat2 from "@/pages/Join/CreateChat2";
import CreateBandSong from "@/pages/Join/create_band/CreateBandSong";
import CreateBandGenre from "@/pages/Join/create_band/CreateBandGenre";
import CreateBandArtist from "@/pages/Join/create_band/CreateBandArtist";
import SavedBand from "@/pages/Join/saved_band/SavedBand";
import SavedBandDetail from "@/pages/Join/saved_band/SavedBandDetail";
import NotificationPage from "@/pages/Notification/NotificationPage";
import NotificationDetailPage from "@/pages/Notification/NotificationDetailPage";
import ChatPage from "@/pages/chat/ChatPage";
import ChatDemoPage from "@/pages/chat/ChatDemoPage";
import PrivateChatPage from "@/pages/chat/PrivateChatPage";
import PretestArtistPage from "@/pages/pretest/artist/PretestArtistPage";
import PretestSessionPage from "@/pages/pretest/session/PretestSessionPage";
import PretestProfileCompletePage from "@/pages/pretest/profile/PretestProfileCompletePage";
import PretestProfileEditPage from "@/pages/pretest/profile/PretestProfileEditPage";
import ArchivePage from "@/pages/Archive/ArchivePage";
import AddPage from "@/pages/Archive/AddPage";
import ArtistPage from "@/pages/Archive/Artist/ArtistPage";
import AlbumPage from "@/pages/Archive/Album/AlbumPage";
import AlbumDetailPage from "@/pages/Archive/Album/AlbumDetailPage";
import OtherProfile from "@/pages/Profile/OtherProfile";
import ProfileDetailPage from "@/pages/Profile/ProfileDetailPage";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { Outlet } from "react-router-dom";
import JoinChangeChatInfo from "@/pages/Join/JoinChangeChatInfo";

const routes = [
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute requireAuth={true}>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup/email",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SignupPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup/verify",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SignupVerifyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup/password-confirm",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SignupPasswordConfirmStep />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup/password",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SignupPasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup/nickname",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SignupNicknamePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup/profile",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SignupProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup/complete",
        element: (
          <ProtectedRoute requireAuth={false} allowAuthedOnPublic={true}>
            <SignupCompletePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/artists",
        element: (
          <ProtectedRoute requireAuth={true}>
            <ArtistsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/artists/:id",
        element: (
          <ProtectedRoute requireAuth={true}>
            <ArtistDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/bands/:id",
        element: (
          <ProtectedRoute requireAuth={true}>
            <BandDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/bands/:id/chat",
        element: (
          <ProtectedRoute requireAuth={true}>
            <BandChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/manual",
        element: (
          <ProtectedRoute requireAuth={true}>
            <ManualPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/my",
        element: (
          <ProtectedRoute requireAuth={true}>
            <MyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my/setting",
        element: (
          <ProtectedRoute requireAuth={true}>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my/notifications",
        element: (
          <ProtectedRoute requireAuth={true}>
            <NotificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my/notifications/:id",
        element: (
          <ProtectedRoute requireAuth={true}>
            <NotificationDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my/archive",
        element: (
          <ProtectedRoute requireAuth={true}>
            <ArchivePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my/archive/add",
        element: (
          <ProtectedRoute requireAuth={true}>
            <AddPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my/archive/artist",
        element: (
          <ProtectedRoute requireAuth={true}>
            <ArtistPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my/archive/album",
        element: (
          <ProtectedRoute requireAuth={true}>
            <AlbumPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my/archive/album/:albumId",
        element: (
          <ProtectedRoute requireAuth={true}>
            <AlbumDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile-other/:id",
        element: (
          <ProtectedRoute requireAuth={true}>
            <OtherProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile-detail/:id",
        element: (
          <ProtectedRoute requireAuth={true}>
            <ProfileDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home/people",
        element: (
          <ProtectedRoute requireAuth={true}>
            <PeoplePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home/people/:bandId",
        element: (
          <ProtectedRoute requireAuth={true}>
            <PeoplePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home/playlist",
        element: (
          <ProtectedRoute requireAuth={true}>
            <PlaylistPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home/playlist/:bandId",
        element: (
          <ProtectedRoute requireAuth={true}>
            <PlaylistPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home/prefer",
        element: (
          <ProtectedRoute requireAuth={true}>
            <PreferPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home/prefer/:bandId",
        element: (
          <ProtectedRoute requireAuth={true}>
            <PreferPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home/chat",
        element: (
          <ProtectedRoute requireAuth={true}>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home/private-chat",
        element: (
          <ProtectedRoute requireAuth={true}>
            <PrivateChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home/chat-demo",
        element: (
          <ProtectedRoute requireAuth={true}>
            <ChatDemoPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/join",
        element: (
          <ProtectedRoute requireAuth>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Join /> },
          { path: "change-chat-info", element: <JoinChangeChatInfo /> },
          { path: "band-recruit/:id", element: <BandRecruit /> },
          {
            path: "create-band",
            element: <CreateBand />,
            children: [
              { path: "song", element: <CreateBandSong /> },
              { path: "genre", element: <CreateBandGenre /> },
              { path: "artist", element: <CreateBandArtist /> },
            ],
          },
          {
            path: "create-chat",
            element: <Outlet />,
            children: [
              { index: true, element: <CreateChat /> },
              { path: "2", element: <CreateChat2 /> },
            ],
          },
          {
            path: "saved-band",
            element: <Outlet />,
            children: [
              { index: true, element: <SavedBand /> },
              { path: ":id", element: <SavedBandDetail /> },
            ],
          },
        ],
      },

      {
        path: "/pre-test/artist",
        element: (
          <ProtectedRoute requireAuth={false} allowAuthedOnPublic={true}>
            <PretestArtistPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pre-test/session",
        element: (
          <ProtectedRoute requireAuth={false} allowAuthedOnPublic={true}>
            <PretestSessionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pre-test/profile/complete",
        element: (
          <ProtectedRoute requireAuth={false} allowAuthedOnPublic={true}>
            <PretestProfileCompletePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pre-test/profile/edit",
        element: (
          <ProtectedRoute requireAuth={false} allowAuthedOnPublic={true}>
            <PretestProfileEditPage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export default routes;
