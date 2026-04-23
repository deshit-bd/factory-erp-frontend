import { Outlet, useLocation } from "react-router-dom";

import { AppTopbar } from "@/widgets/app-topbar";
import { AppSidebar } from "@/widgets/app-sidebar";
import { PageShell } from "@/shared/ui/page-shell";
import { getSidebarItemByPath } from "@/shared/config/sidebar-navigation";
import { useEffect, useState } from "react";

export function AppLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const location = useLocation();
  const sidebarWidth = sidebarCollapsed ? 56 : 220;
  const activeItem = getSidebarItemByPath(location.pathname);
  const content = children ?? <Outlet />;

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("app-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("app-theme", theme);
  }, [theme]);

  return (
    <>
      <AppTopbar
        onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        sidebarCollapsed={sidebarCollapsed}
        sidebarWidth={sidebarWidth}
        theme={theme}
        title={activeItem.label}
      />
      <div
        className="w-full min-w-0 md:grid md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]"
        style={{ "--sidebar-width": `${sidebarWidth}px` }}
      >
        <AppSidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onNavigate={() => setMobileSidebarOpen(false)}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
        />
        {content ? <PageShell>{content}</PageShell> : null}
      </div>
    </>
  );
}
