import { NavLink } from "react-router-dom";

import { sidebarItems } from "@/shared/config/sidebar-navigation";

function Icon({ type }) {
  const baseProps = {
    "aria-hidden": "true",
    className: "h-[13px] w-[13px] shrink-0",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "1.8",
  };

  switch (type) {
    case "grid":
      return (
        <svg {...baseProps}>
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
        </svg>
      );
    case "users":
      return (
        <svg {...baseProps}>
          <path d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
          <circle cx="9.5" cy="7" r="3" />
          <path d="M20 21v-2a4 4 0 00-3-3.87" />
          <path d="M15.5 4.13a3 3 0 010 5.74" />
        </svg>
      );
    case "cart":
      return (
        <svg {...baseProps}>
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
          <path d="M3 4h2l2.4 10.2a1 1 0 001 .8H19a1 1 0 001-.76L22 7H7" />
        </svg>
      );
    case "folder":
      return (
        <svg {...baseProps}>
          <path d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      );
    case "cube":
      return (
        <svg {...baseProps}>
          <path d="M12 2l8 4.5v11L12 22 4 17.5v-11z" />
          <path d="M12 22V11.5" />
          <path d="M20 6.5l-8 5-8-5" />
        </svg>
      );
    case "box":
      return (
        <svg {...baseProps}>
          <path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <path d="M3.3 7l8.7 5 8.7-5" />
        </svg>
      );
    case "branch":
      return (
        <svg {...baseProps}>
          <path d="M6 3v12" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M9 6h6M9 18h6" />
        </svg>
      );
    case "spark":
      return (
        <svg {...baseProps}>
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...baseProps}>
          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <path d="M3 11h18" />
        </svg>
      );
    case "link":
      return (
        <svg {...baseProps}>
          <path d="M10 13a5 5 0 007.07 0l1.41-1.41a5 5 0 00-7.07-7.07L10 6" />
          <path d="M14 11a5 5 0 01-7.07 0L5.5 9.59a5 5 0 017.07-7.07L14 4" />
        </svg>
      );
    case "package":
      return (
        <svg {...baseProps}>
          <path d="M12 2l7 4v12l-7 4-7-4V6z" />
          <path d="M12 22V10" />
          <path d="M19 6l-7 4-7-4" />
        </svg>
      );
    case "gift":
      return (
        <svg {...baseProps}>
          <path d="M20 12v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8" />
          <path d="M2 7h20v5H2z" />
          <path d="M12 22V7" />
          <path d="M12 7H7.5A2.5 2.5 0 117.5 2C11 2 12 7 12 7z" />
          <path d="M12 7h4.5A2.5 2.5 0 1016.5 2C13 2 12 7 12 7z" />
        </svg>
      );
    case "truck":
      return (
        <svg {...baseProps}>
          <path d="M10 17H6a2 2 0 01-2-2V7a2 2 0 012-2h8v10" />
          <path d="M14 9h3l3 3v3h-6z" />
          <circle cx="7.5" cy="17.5" r="1.5" />
          <circle cx="17.5" cy="17.5" r="1.5" />
        </svg>
      );
    case "history":
      return (
        <svg {...baseProps}>
          <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v6l4 2" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...baseProps}>
          <path d="M3 7a2 2 0 012-2h14a1 1 0 011 1v12a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <path d="M16 13h4" />
          <circle cx="16" cy="13" r=".5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "chart":
      return (
        <svg {...baseProps}>
          <path d="M4 19h16" />
          <path d="M7 16V9" />
          <path d="M12 16V5" />
          <path d="M17 16v-4" />
        </svg>
      );
    case "ship":
      return (
        <svg {...baseProps}>
          <path d="M3 15l3 3h12l3-3-2-7H5z" />
          <path d="M8 15V8h8v7" />
          <path d="M2 19c1 .67 2 .67 3.5 0 1.5-.67 2.5-.67 4 0 1.5.67 2.5.67 4 0 1.5-.67 2.5-.67 4 0 1.5.67 2.5.67 4 0" />
        </svg>
      );
    case "receipt":
      return (
        <svg {...baseProps}>
          <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      );
    case "building":
      return (
        <svg {...baseProps}>
          <path d="M4 21h16" />
          <path d="M7 21V7l5-3 5 3v14" />
          <path d="M10 10h.01M14 10h.01M10 14h.01M14 14h.01" />
        </svg>
      );
    case "file":
      return (
        <svg {...baseProps}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    case "ledger":
      return (
        <svg {...baseProps}>
          <path d="M5 4h14v16H5z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
          <path d="M7 8h.01M7 12h.01M7 16h.01" />
        </svg>
      );
    case "gear":
      return (
        <svg {...baseProps}>
          <path d="M12 8.5A3.5 3.5 0 1112 15.5 3.5 3.5 0 0112 8.5z" />
          <path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1.04 1.56V21a2 2 0 11-4 0v-.09A1.7 1.7 0 009 19.35a1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.7 1.7 0 004.65 15a1.7 1.7 0 00-1.56-1.04H3a2 2 0 110-4h.09A1.7 1.7 0 004.65 9a1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06A1.7 1.7 0 009 4.65a1.7 1.7 0 001.04-1.56V3a2 2 0 114 0v.09A1.7 1.7 0 0015 4.65a1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06A1.7 1.7 0 0019.35 9c.69.28 1.15.96 1.15 1.7s-.46 1.42-1.15 1.7z" />
        </svg>
      );
    default:
      return null;
  }
}

function ChevronLeftIcon({ collapsed }) {
  return (
    <svg
      aria-hidden="true"
      className={["h-3.5 w-3.5 transition-transform", collapsed ? "rotate-180" : ""].join(" ")}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function AppSidebar({ collapsed = false, onToggleCollapsed, mobileOpen = false, onCloseMobile, onNavigate, items = sidebarItems }) {
  function SidebarNav({ mobile = false, onNavigate: handleNavigate }) {
    return (
      <div className={["flex h-full flex-col overflow-y-auto py-3", collapsed && !mobile ? "px-1.5" : "px-3"].join(" ")}>
        <nav aria-label="Sidebar navigation" className="flex flex-col gap-[2px]">
          {items.map((item) => (
            <NavLink
              className={({ isActive }) =>
                [
                  "flex min-h-[28px] items-center rounded-[2px] text-left text-[11px] leading-none transition",
                  collapsed && !mobile ? "justify-center px-0" : "gap-2 px-3",
                  isActive ? "bg-[#f5a30f] font-semibold text-[#172136]" : "text-white/88 hover:bg-white/6",
                ].join(" ")
              }
              end={item.originalPath === "/"}
              key={item.label}
              onClick={() => handleNavigate?.()}
              title={item.label}
              to={item.path}
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? "text-[#172136]" : "text-white/88"}>
                    <Icon type={item.icon} />
                  </span>
                  {collapsed && !mobile ? null : <span className="truncate">{item.label}</span>}
                  {(!collapsed || mobile) && item.badge ? (
                    <span className="ml-auto flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#f5a30f] text-[8px] font-bold text-[#172136]">
                      {item.badge}
                    </span>
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-[#0d1422]/70 md:hidden" onClick={onCloseMobile} role="presentation">
          <aside
            className="h-full w-[260px] border-r border-[#2a3346] bg-[#1f2940] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <SidebarNav mobile onNavigate={onNavigate} />
          </aside>
        </div>
      ) : null}

      <aside
        className="relative hidden min-h-[calc(100vh-74px)] border-r border-[#2a3346] bg-[#1f2940] text-white transition-[width] duration-200 md:block"
        style={{ width: collapsed ? "56px" : "220px" }}
      >
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#3a465b] bg-[#263248] text-[#c8d0db] shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition hover:text-white"
          onClick={onToggleCollapsed}
          type="button"
        >
          <ChevronLeftIcon collapsed={collapsed} />
        </button>

        <SidebarNav onNavigate={onNavigate} />
      </aside>
    </>
  );
}
