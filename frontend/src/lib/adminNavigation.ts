import { ROUTES } from "@/lib/routes";

type AdminNavigationItem =
  | {
      label: string;
      path: string;
      isAvailable: true;
    }
  | {
      label: string;
      isAvailable: false;
      path?: never;
    };

/**
 * Defines administrator navigation and marks entries that are not implemented yet.
 *
 * @returns The administrator navigation items.
 */
export const ADMIN_NAVIGATION: readonly AdminNavigationItem[] = [
  { label: "Dashboard", path: ROUTES.adminDashboard, isAvailable: true },
  { label: "Demand Ranking", isAvailable: false },
  { label: "Point of Sale", isAvailable: false },
  { label: "Inventory", isAvailable: false },
  { label: "Demand Forecasting", isAvailable: false },
  { label: "Expenses and Cheque Tracker", isAvailable: false },
  { label: "AI Chatbot", isAvailable: false },
  { label: "Attendance", isAvailable: false },
  { label: "Account Management", isAvailable: false },
  { label: "Audit Logs", isAvailable: false },
];
