import { useEffect, useState } from "react";

import { getAccountsDashboard } from "@/shared/lib/accounts-api";

const defaultSummaryCards = [
  { icon: "pulse", value: "0", label: "Total Projects", tone: "primary" },
  { icon: "dollar", value: "৳0", label: "Total Revenue", tone: "success" },
  { icon: "clock", value: "0", label: "Pending Orders", tone: "warning" },
  { icon: "alert", value: "0", label: "Low Stock Items", tone: "danger" },
  { icon: "trend", value: "0", label: "Raw Material Suppliers", tone: "primary" },
  { icon: "trend", value: "0", label: "Project Goods Suppliers", tone: "info" },
  { icon: "cube", value: "৳0", label: "Inventory Value", tone: "info" },
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
  if (tone === "danger") {
    return {
      icon: "text-[var(--app-danger)]",
      badge: "text-[var(--app-text-soft)]",
    };
  }

  if (tone === "success") {
    return {
      icon: "text-[var(--app-success)]",
      badge: "text-[var(--app-text-soft)]",
    };
  }

  if (tone === "warning") {
    return {
      icon: "text-[var(--app-warning)]",
      badge: "text-[var(--app-text-soft)]",
    };
  }

  if (tone === "info") {
    return {
      icon: "text-[var(--app-info)]",
      badge: "text-[var(--app-text-soft)]",
    };
  }

  return {
    icon: "text-[var(--app-primary)]",
    badge: "text-[var(--app-text-soft)]",
  };
}

function statusClasses(tone) {
  if (tone === "green") {
    return "bg-[rgba(34,197,94,0.14)] text-[var(--app-success)]";
  }

  if (tone === "amber") {
    return "bg-[rgba(245,158,11,0.14)] text-[var(--app-warning)]";
  }

  return "bg-[rgba(37,99,235,0.12)] text-[var(--app-primary)]";
}

export function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const summaryCards = dashboard?.overview?.summaryCards || defaultSummaryCards;
  const projects = dashboard?.overview?.recentProjects || [];
  const productionDistribution = dashboard?.overview?.productionDistribution || [
    { key: "completed", label: "Completed", percentage: 0, color: "var(--app-primary)" },
    { key: "confirmed", label: "Confirmed", percentage: 0, color: "#64748b" },
    { key: "pending", label: "Pending", percentage: 0, color: "#d97706" },
    { key: "inProgress", label: "In Progress", percentage: 0, color: "#fb923c" },
  ];
  const salesTrend = dashboard?.overview?.salesTrend || [];
  const fallbackSalesTrend = [
    { month: "Jan", amount: 0 },
    { month: "Feb", amount: 0 },
    { month: "Mar", amount: 0 },
    { month: "Apr", amount: 0 },
    { month: "May", amount: 0 },
    { month: "Jun", amount: 0 },
  ];
  const trendRows = salesTrend.length > 0 ? salesTrend : fallbackSalesTrend;
  const maxTrendAmount = Math.max(...trendRows.map((point) => Number(point.amount || 0)), 0);
  const chartMax = maxTrendAmount > 0 ? Math.ceil(maxTrendAmount / 20000) * 20000 : 20000;
  const yAxisLabels = Array.from({ length: 5 }, (_, index) => Math.round((chartMax / 4) * (4 - index)));
  const computedChartPoints = trendRows.map((point, index) => {
    const x = 40 + index * 80;
    const amount = Number(point.amount || 0);
    const ratio = chartMax > 0 ? amount / chartMax : 0;
    const y = 160 - ratio * 140;

    return {
      month: point.month,
      amount,
      x,
      y,
    };
  });
  const chartPath = computedChartPoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const distributionGradient = productionDistribution
    .map((item) => `${item.color} ${item.start ?? 0}% ${(item.end ?? 0)}%`)
    .join(",");
  const hasDistributionData = productionDistribution.some((item) => Number(item.percentage || 0) > 0);
  const completedDistribution = productionDistribution.find((item) => item.key === "completed");
  const confirmedDistribution = productionDistribution.find((item) => item.key === "confirmed");
  const pendingDistribution = productionDistribution.find((item) => item.key === "pending");
  const inProgressDistribution = productionDistribution.find((item) => item.key === "inProgress");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const data = await getAccountsDashboard();

        if (isMounted) {
          setDashboard(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to load dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full min-w-0 space-y-4">
      {errorMessage ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[13px] text-[#f7c8cf]">{errorMessage}</div> : null}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const tone = cardToneClasses(card.tone);

          return (
            <article
              className="min-h-[116px] rounded-[14px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3.5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
              key={card.label}
            >
              <div className="flex items-start justify-between">
                <CardIcon className={["h-[13px] w-[13px]", tone.icon].join(" ")} type={card.icon} />
                <span className={["text-[10px] font-medium tracking-tight", tone.badge].join(" ")}>{isLoading ? "..." : "Live"}</span>
              </div>
              <div className="mt-5 text-[31px] font-semibold leading-none tracking-[-0.03em] text-[var(--app-text)]">{card.value}</div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--app-text-soft)]">{card.label}</div>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1fr]">
        <article className="rounded-[14px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--app-text-soft)]">Sales Trend (6 months)</div>
          <svg className="h-[190px] w-full" viewBox="0 0 470 190">
            <g stroke="var(--app-border-soft)" strokeDasharray="3 5" strokeWidth="1">
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

            <g fill="var(--app-text-soft)" fontSize="11">
              <text x="14" y="163">0</text>
              {yAxisLabels.slice(0, 4).map((label, index) => (
                <text key={label} x="0" y={128 - index * 35}>
                  {label}
                </text>
              ))}
            </g>

            <g fill="var(--app-text-soft)" fontSize="11">
              {computedChartPoints.map((point) => (
                <text key={point.month} x={point.x - 7} y="177">
                  {point.month}
                </text>
              ))}
            </g>

            <path d={chartPath} fill="none" stroke="var(--app-primary)" strokeWidth="2.35" />
            {computedChartPoints.map((point) => (
              <circle cx={point.x} cy={point.y} fill="var(--app-primary)" key={point.month} r="3.25" />
            ))}
          </svg>
        </article>

        <article className="rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--app-text-soft)]">Production Distribution</div>
          <div className="grid h-[190px] grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-5 text-left sm:space-y-16 sm:text-right">
              <div className="text-[12px] text-[#fb923c]">In Progress: {inProgressDistribution?.percentage || 0}%</div>
              <div className="text-[12px] text-[#d97706]">Pending: {pendingDistribution?.percentage || 0}%</div>
            </div>

            <div
              className="relative mx-auto h-32 w-32 rounded-full"
              style={{ background: hasDistributionData ? `conic-gradient(${distributionGradient})` : "var(--app-border-soft)" }}
            >
              <div className="absolute inset-[18px] rounded-full border border-[var(--app-border)] bg-[var(--app-surface)]" />
            </div>

            <div className="space-y-5 text-left sm:space-y-16">
              <div className="text-[12px] text-[var(--app-primary)]">Completed: {completedDistribution?.percentage || 0}%</div>
              <div className="text-[12px] text-[#64748b]">Confirmed: {confirmedDistribution?.percentage || 0}%</div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid w-full min-w-0 grid-cols-1 gap-4">
        <article className="w-full min-w-0 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--app-text-soft)]">Recent Projects</div>
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
                {isLoading ? (
                  <tr>
                    <td className="py-8 text-center text-[14px] text-[var(--app-text-muted)]" colSpan={5}>
                      Loading dashboard...
                    </td>
                  </tr>
                ) : projects.length > 0 ? (
                  projects.map((project) => (
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
                          <div className="h-1.5 w-14 rounded-full bg-[var(--app-border-soft)]">
                            <div className="h-1.5 rounded-full bg-[var(--app-primary)]" style={{ width: `${project.progress}%` }} />
                          </div>
                          <span className="text-[11px] text-[var(--app-text-muted)]">{project.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-8 text-center text-[14px] text-[var(--app-text-muted)]" colSpan={5}>
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
