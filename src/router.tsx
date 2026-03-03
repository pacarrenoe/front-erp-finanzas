import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout/AppLayout";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { PeriodsPage } from "./pages/Periods/PeriodsPage";
import { TransactionsPage } from "./pages/Transactions/TransactionsPage";
import { SettingsPage } from "./pages/Settings/SettingsPage";
import { NotFoundPage } from "./pages/NotFound/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "periods", element: <PeriodsPage /> },
      { path: "transactions", element: <TransactionsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);