const summaryCards = [
  { icon: "pulse", value: "3", label: "Total Projects", change: "+12%", tone: "amber" },
  { icon: "dollar", value: "৳2.4M", label: "Total Revenue", change: "+8%", tone: "amber" },
  { icon: "clock", value: "0", label: "Pending Orders", change: "-3%", tone: "amber" },
  { icon: "alert", value: "1", label: "Low Stock Items", change: "+2", tone: "red" },
  { icon: "trend", value: "2", label: "Total Suppliers", change: "+5%", tone: "amber" },
  { icon: "cube", value: "৳24.8K", label: "Inventory Value", change: "-8%", tone: "slate" },
];

const chartPoints = [
  { month: "Jan", x: 40, y: 140 },
  { month: "Feb", x: 120, y: 114 },
  { month: "Mar", x: 200, y: 128 },
  { month: "Apr", x: 280, y: 82 },
  { month: "May", x: 360, y: 102 },
  { month: "Jun", x: 440, y: 56 },
];

const projects = [
  { id: "PRJ-001", name: "Industrial Valves Order", buyer: "ABC Corp", status: "In Progress", statusTone: "blue", progress: 65 },
  { id: "PRJ-002", name: "Steel Pipes Manufacturing", buyer: "XYZ Ltd", status: "Completed", statusTone: "green", progress: 100 },
  { id: "PRJ-003", name: "Custom Fittings", buyer: "DEF Inc", status: "Pending", statusTone: "amber", progress: 20 },
];

const alerts = [
  {
    title: "Steel Rods inventory below minimum threshold (450/500 kg)",
    time: "1 hours ago",
  },
  {
    title: "Total Low Stock Items",
    time: "1 hours ago",
  },
];

function CardIcon({ type, className }) {
  const base = {
    "aria-hidden": "true",
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "1.8",
  };

  switch (type) {
    case "pulse":
      return (
        <svg {...base}>
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      );
    case "dollar":
      return (
        <svg {...base}>
          <path d="M12 3v18M16 7.5a4 4 0 00-4-2.5 4 4 0 100 8 4 4 0 110 8 4 4 0 01-4-2.5" />
        </svg>
      );
    case "clock":
      return (
        <svg {...base}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5l3 2" />
        </svg>
      );
    case "alert":
      return (
        <svg {...base}>
          <path d="M12 4l8 14H4z" />
          <path d="M12 10v4M12 18h.01" />
        </svg>
      );
    case "trend":
      return (
        <svg {...base}>
          <path d="M4 16l5-5 4 4 7-7" />
          <path d="M16 8h4v4" />
        </svg>
      );
    case "cube":
      return (
        <svg {...base}>
          <path d="M12 3l7 4v10l-7 4-7-4V7z" />
          <path d="M12 21V11" />
          <path d="M19 7l-7 4-7-4" />
        </svg>
      );
    default:
      return null;
  }
}

function cardToneClasses(tone) {
  if (tone === "red") {
    return {
      icon: "text-[#ef4444]",
      badge: "text-[#94a3b8]",
    };
  }

  if (tone === "slate") {
    return {
      icon: "text-[#94a3b8]",
      badge: "text-[#94a3b8]",
    };
  }

  return {
    icon: "text-[#f59e0b]",
    badge: "text-[#94a3b8]",
  };
}

function statusClasses(tone) {
  if (tone === "green") {
    return "bg-[rgba(16,185,129,0.12)] text-[#22c55e]";
  }

  if (tone === "amber") {
    return "bg-[rgba(245,158,11,0.14)] text-[#f59e0b]";
  }

  return "bg-[rgba(37,99,235,0.12)] text-[#3b82f6]";
}

export function DashboardPage() {
  const chartPath = chartPoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <div className="w-full min-w-0 space-y-4">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {summaryCards.map((card) => {
          const tone = cardToneClasses(card.tone);

          return (
            <article
              className="min-h-[116px] rounded-[14px] border border-[#d9e3f0] bg-[var(--app-surface)] px-4 py-3.5 shadow-[0_8px_24px_rgba(37,99,235,0.05)]"
              key={card.label}
            >
              <div className="flex items-start justify-between">
                <CardIcon className={["h-[13px] w-[13px]", tone.icon].join(" ")} type={card.icon} />
                <span className={["text-[10px] font-medium tracking-tight", tone.badge].join(" ")}>{card.change}</span>
              </div>
              <div className="mt-5 text-[31px] font-semibold leading-none tracking-[-0.03em] text-[#0f172a]">{card.value}</div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#7a8ca8]">{card.label}</div>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1fr]">
        <article className="rounded-[14px] border border-[#d9e3f0] bg-[var(--app-surface)] px-4 py-4 shadow-[0_8px_24px_rgba(37,99,235,0.05)]">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6f84a3]">
            Sales Trend (6 months)
          </div>
          <svg className="h-[190px] w-full" viewBox="0 0 470 190">
            <g stroke="#9fb2cc" strokeDasharray="3 5" strokeWidth="1">
              <path d="M40 20H440" />
              <path d="M40 55H440" />
              <path d="M40 90H440" />
              <path d="M40 125H440" />
              <path d="M40 160H440" />
              <path d="M40 20V160" />
              <path d="M120 20V160" />
              <path d="M200 20V160" />
              <path d="M280 20V160" />
              <path d="M360 20V160" />
              <path d="M440 20V160" />
            </g>

            <g fill="#8ea3c1" fontSize="11">
              <text x="6" y="163">0</text>
              <text x="0" y="128">20000</text>
              <text x="0" y="93">40000</text>
              <text x="0" y="58">60000</text>
              <text x="0" y="23">80000</text>
            </g>

            <g fill="#8ea3c1" fontSize="11">
              {chartPoints.map((point) => (
                <text key={point.month} x={point.x - 7} y="177">
                  {point.month}
                </text>
              ))}
            </g>

            <path d={chartPath} fill="none" stroke="#f59e0b" strokeWidth="2.35" />
            {chartPoints.map((point) => (
              <circle cx={point.x} cy={point.y} fill="#f59e0b" key={point.month} r="3.25" />
            ))}
          </svg>
        </article>

        <article className="rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--app-text-soft)]">
            Production Distribution
          </div>
          <div className="grid h-[190px] grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-5 text-left sm:space-y-16 sm:text-right">
              <div className="text-[12px] text-[#fb923c]">In Progress: 25%</div>
              <div className="text-[12px] text-[#d97706]">Pending: 22%</div>
            </div>

            <div className="relative mx-auto h-32 w-32 rounded-full bg-[conic-gradient(#f59e0b_0_35%,#64748b_35%_53%,#d97706_53%_75%,#fb923c_75%_100%)]">
              <div
                className="absolute inset-[18px] rounded-full border border-[var(--app-border)] bg-[var(--app-surface)]"
              />
            </div>

            <div className="space-y-5 text-left sm:space-y-16">
              <div className="text-[12px] text-[#f59e0b]">Completed: 35%</div>
              <div className="text-[12px] text-[#64748b]">On Hold: 18%</div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid w-full min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <article className="w-full min-w-0 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--app-text-soft)]">
            Recent Projects
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] table-fixed border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--app-border)] text-[10px] uppercase tracking-[0.12em] text-[var(--app-text-soft)]">
                  <th className="w-[100px] pb-3 font-medium">Project ID</th>
                  <th className="w-[36%] pb-3 font-medium">Name</th>
                  <th className="w-[110px] pb-3 font-medium">Buyer</th>
                  <th className="w-[110px] pb-3 font-medium">Status</th>
                  <th className="w-[130px] pb-3 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr className="border-b border-[var(--app-border)] text-[12px] text-[var(--app-text)]" key={project.id}>
                    <td className="py-3 font-semibold text-[var(--app-primary)]">{project.id}</td>
                    <td className="py-3 pr-4">{project.name}</td>
                    <td className="py-3 pr-3 text-[var(--app-text-muted)]">{project.buyer}</td>
                    <td className="py-3">
                      <span className={["inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium", statusClasses(project.statusTone)].join(" ")}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-14 rounded-full bg-[#dbeafe]">
                          <div className="h-1.5 rounded-full bg-[#2563eb]" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-[11px] text-[#64748b]">{project.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="w-full min-w-0 rounded-[14px] border border-[#d9e3f0] bg-[var(--app-surface)] px-4 py-4 shadow-[0_8px_24px_rgba(37,99,235,0.05)]">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6f84a3]">
            System Alerts
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                className="min-h-[92px] rounded-[14px] border border-[#3e4961] bg-[#3b465f] px-4 py-4 text-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                key={alert.title}
              >
                <div className="text-[13px] leading-7 text-white/92">{alert.title}</div>
                <div className="mt-4 text-[11px] text-[#a2b0c6]">{alert.time}</div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
