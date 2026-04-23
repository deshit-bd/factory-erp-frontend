import { useState } from "react";

import { AppTopbar } from "@/widgets/app-topbar";
import { AppSidebar } from "@/widgets/app-sidebar";
import { PageShell } from "@/shared/ui/page-shell";

export function AppLayout({ children }) {
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 56 : 220;
  const content = typeof children === "function" ? children({ selectedItem }) : children;

  return (
    <>
      <AppTopbar sidebarCollapsed={sidebarCollapsed} sidebarWidth={sidebarWidth} title={selectedItem} />
      <div
        className="w-full min-w-0 md:grid md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]"
        style={{ "--sidebar-width": `${sidebarWidth}px` }}
      >
        <AppSidebar
          collapsed={sidebarCollapsed}
          onSelectItem={setSelectedItem}
          onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
          selectedItem={selectedItem}
        />
        {content ? <PageShell>{content}</PageShell> : null}
      </div>
    </>
  );
}
