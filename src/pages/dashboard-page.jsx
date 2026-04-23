const summaryCards = [
  { icon: "pulse", value: "3", label: "Total Projects", change: "+12%", accent: "text-amber-400" },
  { icon: "dollar", value: "$2.4M", label: "Total Revenue", change: "+8%", accent: "text-amber-400" },
  { icon: "clock", value: "0", label: "Pending Orders", change: "-3%", accent: "text-orange-400" },
  { icon: "alert", value: "1", label: "Low Stock Items", change: "+2", accent: "text-red-400" },
  { icon: "trend", value: "2", label: "Total Suppliers", change: "+5%", accent: "text-amber-400" },
  { icon: "cube", value: "$24.8K", label: "Inventory Value", change: "-8%", accent: "text-slate-400" },
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
  { id: "PRJ-002", name: "Steel Pipes Manufacturing", buyer: "XYZ Ltd", status: "Completed", statusTone: "amber", progress: 100 },
  { id: "PRJ-003", name: "Custom Fittings", buyer: "DEF Inc", status: "Pending", statusTone: "orange", progress: 20 },
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

export function DashboardPage() {
  const chartPath = chartPoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <div className="w-full min-w-0 space-y-4">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {summaryCards.map((card) => (
          <article
            className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
            key={card.label}
          >
            <div className="flex items-start justify-between">
              <CardIcon className={["h-4 w-4", card.accent].join(" ")} type={card.icon} />
              <span className="text-[10px] font-medium text-[#7f8ea6]">{card.change}</span>
            </div>
            <div className="mt-4 text-[31px] font-semibold leading-none text-white">{card.value}</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#7e8ba1]">{card.label}</div>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1fr]">
        <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7f8ea6]">
            Sales Trend (6 months)
          </div>
          <svg className="h-[190px] w-full" viewBox="0 0 470 190">
            <g stroke="#334155" strokeDasharray="3 5" strokeWidth="1">
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

            <g fill="#7f8ea6" fontSize="11">
              <text x="6" y="163">0</text>
              <text x="0" y="128">20000</text>
              <text x="0" y="93">40000</text>
              <text x="0" y="58">60000</text>
              <text x="0" y="23">80000</text>
            </g>

            <g fill="#7f8ea6" fontSize="11">
              {chartPoints.map((point) => (
                <text key={point.month} x={point.x - 7} y="177">
                  {point.month}
                </text>
              ))}
            </g>

            <path d={chartPath} fill="none" stroke="#f7a614" strokeWidth="2.5" />
            {chartPoints.map((point) => (
              <circle cx={point.x} cy={point.y} fill="#f7a614" key={point.month} r="3.5" />
            ))}
          </svg>
        </article>

        <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
          <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7f8ea6]">
            Production Distribution
          </div>
          <div className="grid h-[190px] grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="space-y-16 text-right">
              <div className="text-[12px] text-[#fb923c]">In Progress: 25%</div>
              <div className="text-[12px] text-[#d97706]">Pending: 22%</div>
            </div>

            <div className="relative h-32 w-32 rounded-full bg-[conic-gradient(#f6a313_0_35%,#64748b_35%_53%,#d97706_53%_75%,#fb923c_75%_100%)]">
              <div className="absolute inset-[18px] rounded-full bg-[#222d40]" />
            </div>

            <div className="space-y-16 text-left">
              <div className="text-[12px] text-[#f6a313]">Completed: 35%</div>
              <div className="text-[12px] text-[#66758d]">On Hold: 18%</div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid w-full min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
        <article className="w-full min-w-0 rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7f8ea6]">
            Recent Projects
          </div>
          <div>
            <table className="w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.12em] text-[#7f8ea6]">
                  <th className="w-[100px] pb-3 font-medium">Project ID</th>
                  <th className="w-[36%] pb-3 font-medium">Name</th>
                  <th className="w-[110px] pb-3 font-medium">Buyer</th>
                  <th className="w-[110px] pb-3 font-medium">Status</th>
                  <th className="w-[130px] pb-3 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr className="border-b border-[#2d394d] text-[12px] text-[#d2d9e6]" key={project.id}>
                    <td className="py-3 font-semibold text-[#f7a614]">{project.id}</td>
                    <td className="py-3 pr-4">{project.name}</td>
                    <td className="py-3 pr-3 text-[#9aa6bb]">{project.buyer}</td>
                    <td className="py-3">
                      <span
                        className={[
                          "inline-flex rounded-sm px-2 py-1 text-[10px] font-medium",
                          project.statusTone === "blue" && "bg-[#1d3b63] text-[#69a7ff]",
                          project.statusTone === "amber" && "bg-[#57411f] text-[#f5b14e]",
                          project.statusTone === "orange" && "bg-[#5b3b21] text-[#f5a14e]",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-12 rounded-full bg-[#3a465b]">
                          <div className="h-1.5 rounded-full bg-[#f7a614]" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-[11px] text-[#7f8ea6]">{project.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="w-full min-w-0 rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7f8ea6]">
            System Alerts
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div className="min-h-[92px] rounded-md border border-[#6b4b28] bg-[#2b3345] px-4 py-3" key={alert.title}>
                <div className="text-[13px] leading-7 text-[#d7deea]">{alert.title}</div>
                <div className="mt-2 text-[11px] text-[#7f8ea6]">{alert.time}</div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
