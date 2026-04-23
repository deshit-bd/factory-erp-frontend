function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M15 17h5l-1.4-1.4a2 2 0 01-.6-1.41V11a6 6 0 10-12 0v3.19a2 2 0 01-.6 1.41L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function AppTopbar({ title = "Dashboard", sidebarWidth = 220, sidebarCollapsed = false, onOpenMobileSidebar }) {
  return (
    <header className="border-b border-[#2d384c] bg-[#1e2737] text-white">
      <div
        className="grid min-h-[74px] grid-cols-1 md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]"
        style={{ "--sidebar-width": `${sidebarWidth}px` }}
      >
        <div
          className={[
            "flex border-b border-[#2d384c] py-3 md:border-b-0 md:border-r",
            sidebarCollapsed ? "items-center justify-center px-0" : "items-center px-4",
          ].join(" ")}
        >
          <div className="leading-none">
            {sidebarCollapsed ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f6a623]/15 text-[16px] font-black uppercase text-[#f6a623]">
                F
              </div>
            ) : (
              <>
                <div className="text-[22px] font-black uppercase tracking-[0.08em] text-[#f6a623]">Factory</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.28em] text-white/65">ERP System</div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5">
          <div className="flex min-w-0 items-start gap-3">
            <button
              aria-label="Open navigation"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#344056] bg-[#202b3d] text-[#c5cfdd] md:hidden"
              onClick={onOpenMobileSidebar}
              type="button"
            >
              <MenuIcon />
            </button>
            <h1 className="truncate text-[18px] font-semibold text-white">{title}</h1>
            <p className="mt-0.5 hidden text-[12px] text-[#93a0b4] sm:block">Sunday, April 19, 2026</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="order-3 flex h-10 min-w-0 basis-full items-center gap-2 rounded-sm border border-[#344056] bg-[#202b3d] px-3 text-[#7e8aa2] sm:order-1 sm:flex-1 md:order-none md:w-[340px] md:flex-none">
              <SearchIcon />
              <input
                className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-[#7e8aa2]"
                placeholder="Search..."
                type="text"
              />
            </label>

            <button
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center text-[#c5cfdd] transition hover:text-white"
              type="button"
            >
              <BellIcon />
              <span className="absolute right-[7px] top-[6px] h-1.5 w-1.5 rounded-full bg-[#f6a623]" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6a623]/20 text-[13px] font-semibold text-[#f6a623]">
                8
              </div>
              <span className="text-[14px] text-white">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
