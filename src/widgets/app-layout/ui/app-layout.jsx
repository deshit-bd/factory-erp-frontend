import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { AppTopbar } from "@/widgets/app-topbar";
import { AppSidebar } from "@/widgets/app-sidebar";
import { PageShell } from "@/shared/ui/page-shell";
import { getSidebarItemByPath, sidebarItems } from "@/shared/config/sidebar-navigation";
import { prefixPathForRole, stripRolePrefix } from "@/shared/config/auth-routing";
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/auth/auth-context";

export function AppLayout({ children }) {
  const { user, signOut } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarWidth = sidebarCollapsed ? 56 : 220;
  const currentPath = stripRolePrefix(location.pathname);
  const allowedItems = sidebarItems
    .filter((item) => user?.permissions?.includes(item.permissionKey))
    .map((item) => ({ ...item, originalPath: item.path, path: prefixPathForRole(user?.role, item.path) }));
  const activeItem = allowedItems.find((item) => item.path === location.pathname) ?? allowedItems[0] ?? getSidebarItemByPath(location.pathname);
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

  useEffect(() => {
    if (!allowedItems.length) {
      return;
    }

    const isCurrentPathAllowed = allowedItems.some((item) => item.path === location.pathname);

    if (!isCurrentPathAllowed) {
      const fallbackItem = allowedItems.find((item) => item.path === prefixPathForRole(user?.role, currentPath)) || allowedItems[0];
      navigate(fallbackItem.path, { replace: true });
    }
  }, [allowedItems, currentPath, location.pathname, navigate, user?.role]);

  if (!allowedItems.length) {
    return (
      <>
        <AppTopbar
          onLogout={handleLogout}
          onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          sidebarWidth={sidebarWidth}
          theme={theme}
          title="Access Required"
          user={user}
        />
        <PageShell>
          <section className="mx-auto max-w-[720px] rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
            <h2 className="text-[24px] font-semibold text-[var(--app-text)]">No page access has been assigned to this account yet.</h2>
            <p className="mt-3 text-[14px] leading-7 text-[var(--app-text-muted)]">
              You are signed in as <strong>{user?.email || "this user"}</strong>, but there are no available modules for the current permission setup.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,var(--app-primary),#ffb327)] px-5 text-[14px] font-semibold text-[#172136] transition hover:brightness-105"
                onClick={() => navigate(prefixPathForRole(user?.role, "/settings"), { replace: true })}
                type="button"
              >
                Open Settings
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-5 text-[14px] font-medium text-[var(--app-text)] transition hover:border-[var(--app-primary)]"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </div>
          </section>
        </PageShell>
      </>
    );
  }

  function handleLogout() {
    signOut();
    navigate("/login", { replace: true });
  }

  return (
    <>
      <AppTopbar
        onLogout={handleLogout}
        onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        sidebarCollapsed={sidebarCollapsed}
        sidebarWidth={sidebarWidth}
        theme={theme}
        title={activeItem.label}
        user={user}
      />
      <div
        className="w-full min-w-0 md:grid md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]"
        style={{ "--sidebar-width": `${sidebarWidth}px` }}
      >
        <AppSidebar
          collapsed={sidebarCollapsed}
          items={allowedItems}
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
