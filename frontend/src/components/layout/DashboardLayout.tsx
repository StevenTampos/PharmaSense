import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import Sidebar from "@/components/layout/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Provides the shared header, sidebar, and content area for authenticated pages.
 *
 * @param props - Page content to render in the main area.
 * @returns The shared dashboard layout.
 */
function DashboardLayout({ children }: DashboardLayoutProps): ReactElement {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleMenuClick(): void {
    setIsSidebarOpen((currentValue) => !currentValue);
  }

  function handleSidebarClose(): void {
    setIsSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-900">
      <AppHeader isSidebarOpen={isSidebarOpen} onMenuClick={handleMenuClick} />
      <div className="flex min-h-[calc(100vh-5rem)]">
        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
