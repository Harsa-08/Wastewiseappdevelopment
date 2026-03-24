import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ReportForm from "./pages/ReportForm";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EventForm from "./pages/EventForm";
import Marketplace from "./pages/Marketplace";
import MarketplaceForm from "./pages/MarketplaceForm";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Map from "./pages/Map";
import Leaderboard from "./pages/Leaderboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "reports", element: <Reports /> },
      { path: "reports/new", element: <ReportForm /> },
      { path: "events", element: <Events /> },
      { path: "events/:id", element: <EventDetails /> },
      { path: "events/new", element: <EventForm /> },
      { path: "marketplace", element: <Marketplace /> },
      { path: "marketplace/new", element: <MarketplaceForm /> },
      { path: "rewards", element: <Rewards /> },
      { path: "profile", element: <Profile /> },
      { path: "admin", element: <Admin /> },
      { path: "map", element: <Map /> },
      { path: "leaderboard", element: <Leaderboard /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
