import Layout from "@/widgets/Layout/Layout";
import HomePage from "@/pages/Home/HomePage";
import LoginPage from "@/pages/Login/LoginPage";
import SignupPage from "@/pages/Signup/SignupPage";
import SignupVerifyPage from "@/pages/Signup/SignupVerifyPage";
import SignupPasswordPage from "@/pages/Signup/SignupPasswordPage";
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

const routes = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
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
    ],
  },
];

export default routes;
