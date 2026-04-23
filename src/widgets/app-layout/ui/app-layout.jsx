import { Outlet, useLocation } from "react-router-dom";

import { AppTopbar } from "@/widgets/app-topbar";
import { AppSidebar } from "@/widgets/app-sidebar";
import { PageShell } from "@/shared/ui/page-shell";
import { getSidebarItemByPath } from "@/shared/config/sidebar-navigation";
import { useState } from "react";

export function AppLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const sidebarWidth = sidebarCollapsed ? 56 : 220;
  const activeItem = getSidebarItemByPath(location.pathname);
  const content = children ?? <Outlet />;

  return (
    <>
      <AppTopbar sidebarCollapsed={sidebarCollapsed} sidebarWidth={sidebarWidth} title={activeItem.label} />
      <div
        className="w-full min-w-0 md:grid md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]"
        style={{ "--sidebar-width": `${sidebarWidth}px` }}
      >
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
        />
        {content ? <PageShell>{content}</PageShell> : null}
      </div>
    </>
  );
}
