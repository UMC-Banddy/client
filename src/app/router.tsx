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
import SessionsPage from "@/pages/Session/SessionsPage";
import SessionDetailPage from "@/pages/Session/SessionDetailPage";
import SessionSelectPage from "@/pages/Session/SessionSelectPage";
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
import NotificationPage from "@/pages/Notification/NotificationPage";
import NotificationDetailPage from "@/pages/Notification/NotificationDetailPage";

const routes = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup/email", element: <SignupPage /> },
      { path: "/signup/verify", element: <SignupVerifyPage /> },
      { path: "/signup/password-confirm", element: <SignupPasswordConfirmStep /> },
      { path: "/signup/password", element: <SignupPasswordPage /> },
      { path: "/signup/nickname", element: <SignupNicknamePage /> },
      { path: "/signup/profile", element: <SignupProfilePage /> },
      { path: "/signup/complete", element: <SignupCompletePage /> },
      { path: "/artists", element: <ArtistsPage /> },
      { path: "/artists/:id", element: <ArtistDetailPage /> },
      { path: "/sessions", element: <SessionsPage /> },
      { path: "/sessions/:id", element: <SessionDetailPage /> },
      { path: "/sessions/select", element: <SessionSelectPage /> },
      { path: "/bands/:id", element: <BandDetailPage /> },
      { path: "/bands/:id/chat", element: <BandChatPage /> },
      { path: "/manual", element: <ManualPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/my", element: <MyPage /> },
      { path: "/my/notifications", element: <NotificationPage /> },
      { path: "/my/notifications/:id", element: <NotificationDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
      //Home 관련 페이지
      { path: "/", element: <HomePage /> },
      { path: "/home/people", element: <PeoplePage /> },
      { path: "/home/playlist", element: <PlaylistPage /> },
      { path: "/home/prefer", element: <PreferPage /> },

      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/signup/verify", element: <SignupVerifyPage /> },
      { path: "/signup/password", element: <SignupPasswordPage /> },
      { path: "/signup/nickname", element: <SignupNicknamePage /> },
      { path: "/signup/profile", element: <SignupProfilePage /> },
      { path: "/signup/complete", element: <SignupCompletePage /> },
      { path: "/artists", element: <ArtistsPage /> },
      { path: "/artists/:id", element: <ArtistDetailPage /> },
      { path: "/sessions", element: <SessionsPage /> },
      { path: "/sessions/:id", element: <SessionDetailPage /> },
      { path: "/sessions/select", element: <SessionSelectPage /> },
      { path: "/bands/:id", element: <BandDetailPage /> },
      { path: "/bands/:id/chat", element: <BandChatPage /> },
      { path: "/manual", element: <ManualPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },

      { path: "/join", element: <Join /> },
      { path: "/join/band-recruit", element: <BandRecruit /> },
    ],
  },
];

export default routes;
