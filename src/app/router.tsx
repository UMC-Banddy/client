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
import PretestArtistPage from "@/pages/pretest/artist/PretestArtistPage";
import PretestSessionPage from "@/pages/pretest/session/PretestSessionPage";
import PretestProfileCompletePage from "@/pages/pretest/profile/PretestProfileCompletePage";
import PretestProfileEditPage from "@/pages/pretest/profile/PretestProfileEditPage";
import ArchivePage from "@/pages/Archive/ArchivePage";
import AddPage from "@/pages/Archive/AddPage";
import ArtistPage from "@/pages/Archive/Artist/ArtistPage";
import AlbumPage from "@/pages/Archive/Album/AlbumPage";
import OtherProfile from "@/pages/Profile/OtherProfile";
import ProfileDetailPage from "@/pages/Profile/ProfileDetailPage";

const routes = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup/email", element: <SignupPage /> },
      { path: "/signup/verify", element: <SignupVerifyPage /> },
      {
        path: "/signup/password-confirm",
        element: <SignupPasswordConfirmStep />,
      },
      { path: "/signup/password", element: <SignupPasswordPage /> },
      { path: "/signup/nickname", element: <SignupNicknamePage /> },
      { path: "/signup/profile", element: <SignupProfilePage /> },
      { path: "/signup/complete", element: <SignupCompletePage /> },
      { path: "/artists", element: <ArtistsPage /> },
      { path: "/artists/:id", element: <ArtistDetailPage /> },
      { path: "/bands/:id", element: <BandDetailPage /> },
      { path: "/bands/:id/chat", element: <BandChatPage /> },
      { path: "/manual", element: <ManualPage /> },

      { path: "/my", element: <MyPage /> },
      { path: "/my/setting", element: <SettingsPage /> },
      { path: "/my/notifications", element: <NotificationPage /> },
      { path: "/my/notifications/:id", element: <NotificationDetailPage /> },
      { path: "/my/archive", element: <ArchivePage /> },
      { path: "/my/archive/add", element: <AddPage /> },
      { path: "/my/archive/artist", element: <ArtistPage /> },
      { path: "/my/archive/album", element: <AlbumPage /> },
      { path: "/profile-other/:id", element: <OtherProfile /> },
      { path: "/profile-detail/:id", element: <ProfileDetailPage /> },
      { path: "/home/people", element: <PeoplePage /> },
      { path: "/home/playlist", element: <PlaylistPage /> },
      { path: "/home/prefer", element: <PreferPage /> },
      { path: "/home/chat", element: <ChatPage /> },
      { path: "/home/chat-demo", element: <ChatDemoPage /> },

      { path: "/join", element: <Join /> },
      { path: "/join/band-recruit", element: <BandRecruit /> },
      { path: "/join/create-band", element: <CreateBand /> },
      { path: "/join/create-band/song", element: <CreateBandSong /> },
      { path: "/join/create-band/genre", element: <CreateBandGenre /> },
      { path: "/join/create-band/artist", element: <CreateBandArtist /> },
      { path: "/join/create-chat", element: <CreateChat /> },
      { path: "/join/create-chat/2", element: <CreateChat2 /> },
      { path: "/join/saved-band", element: <SavedBand /> },
      { path: "/join/saved-band/:id", element: <SavedBandDetail /> },

      { path: "/pre-test/artist", element: <PretestArtistPage /> },
      { path: "/pre-test/session", element: <PretestSessionPage /> },
      {
        path: "/pre-test/profile/complete",
        element: <PretestProfileCompletePage />,
      },
      { path: "/pre-test/profile/edit", element: <PretestProfileEditPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export default routes;
