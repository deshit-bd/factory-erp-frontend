import { useEffect, useState } from "react";
import { createFactoryCost, getFactoryCosts, getUploadUrl } from "../shared/lib/factory-cost-api";
import { createOfficeBill, getOfficeBills } from "../shared/lib/office-bill-api";
import { getProjects } from "../shared/lib/project-api";
import { createShipmentCosts, getShipmentCosts } from "../shared/lib/shipment-cost-api";
import { getAccountsDashboard } from "../shared/lib/accounts-api";

const accountTabs = ["Dashboard", "Project Wise", "Factory Costs", "Shipment Costs", "Office Costs"];

function getTodayDateValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M12 3v10" />
      <path d="M8.5 9.5L12 13l3.5-3.5" />
      <path d="M5 19h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function SummaryIcon({ type, tone }) {
  const iconClass = [
    "flex h-11 w-11 items-center justify-center rounded-[6px]",
    tone === "red" ? "bg-[#3f3144] text-[#ff5555]" : "bg-[#3b3f44] text-[#f5a30f]",
  ].join(" ");

  const baseProps = {
    "aria-hidden": "true",
    className: "h-[20px] w-[20px]",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "1.8",
  };

  return (
    <span className={iconClass}>
      {type === "receivables" ? (
        <svg {...baseProps}>
          <path d="M4 16l5-5 4 4 7-7" />
          <path d="M15 8h5v5" />
        </svg>
      ) : null}
      {type === "payables" ? (
        <svg {...baseProps}>
          <path d="M4 8l5 5 4-4 7 7" />
          <path d="M15 16h5v-5" />
        </svg>
      ) : null}
      {type === "cash" ? (
        <svg {...baseProps}>
          <path d="M12 3v18" />
          <path d="M16 7.5a4 4 0 00-4-2.5 4 4 0 100 8 4 4 0 110 8 4 4 0 01-4-2.5" />
        </svg>
      ) : null}
      {type === "profit" ? (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      ) : null}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 text-[#8b96ab]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function formatCurrency(value) {
  const amount = Number(value || 0);

  return `৳${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function DashboardPanel() {
  const [activeLedger, setActiveLedger] = useState("Debit");
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const showingDebit = activeLedger === "Debit";
  const rows = showingDebit ? dashboard?.debitRows || [] : dashboard?.creditRows || [];
  const searchPlaceholder = showingDebit ? "Search Debit transactions..." : "Search Credit transactions...";
  const summaryCards = [
    { key: "receivables", label: "Total Receivables", value: dashboard?.summary.receivablesFormatted || "৳0", tone: "amber", icon: "receivables" },
    { key: "payables", label: "Total Payables", value: dashboard?.summary.payablesFormatted || "৳0", tone: "red", icon: "payables" },
    { key: "cash", label: "Cash/Bank Balance", value: dashboard?.summary.cashBankBalanceFormatted || "৳0", tone: "amber", icon: "cash" },
    { key: "profit", label: "Net Profit/Loss", value: dashboard?.summary.netProfitLossFormatted || "৳0", tone: "amber", icon: "profit" },
  ];

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
          setErrorMessage(error.message || "Failed to load accounts dashboard.");
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

  const filteredRows = rows.filter((row) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      row.date.toLowerCase().includes(query) ||
      row.reference.toLowerCase().includes(query) ||
      row.description.toLowerCase().includes(query) ||
      row.amount.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            className="rounded-[4px] border border-[#344059] bg-[#202b3f] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
            key={card.key}
          >
            <div className="flex items-center gap-3">
              <SummaryIcon tone={card.tone} type={card.icon} />
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#8d9ab0]">{card.label}</div>
                <div className={["text-[15px] font-semibold", card.tone === "red" ? "text-[#ff5555]" : "text-[#f5a30f]"].join(" ")}>
                  {card.value}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {errorMessage ? <div className="rounded-[5px] border border-[#7f1d1d] bg-[#3a1d1d] px-4 py-3 text-[12px] text-[#fecaca]">{errorMessage}</div> : null}

      <section className="flex flex-wrap gap-2">
        {["Debit", "Credit"].map((item) => (
          <button
            className={[
              "rounded-[4px] border px-3 py-[6px] text-[12px] font-medium leading-none transition",
              activeLedger === item
                ? "border-[#f5a30f] bg-[#f5a30f] text-[#172136]"
                : "border-[#f5a30f] bg-transparent text-[#f5a30f] hover:bg-[#f5a30f]/10",
            ].join(" ")}
            key={item}
            onClick={() => setActiveLedger(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </section>

      <section className="rounded-[5px] border border-[#344059] bg-[#202b3f] px-4 py-4">
        <div className="flex items-center gap-3 rounded-[4px] border border-[#344059] bg-[#202b3f] px-3 py-3 text-[#8b96ab]">
          <SearchIcon />
          <input
            className="w-full bg-transparent text-[12px] text-[#d7deea] outline-none placeholder:text-[#8b96ab]"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            type="text"
            value={search}
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#344059] text-[10px] uppercase tracking-[0.14em] text-[#98a3b8]">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={4}>
                    Loading ledger transactions...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={4}>
                    No ledger transactions found.
                  </td>
                </tr>
              ) : filteredRows.map((row) => (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={`${row.date}-${row.reference}-${row.ledger}-${row.description}`}>
                  <td className="py-4 text-[#9aa5ba]">{row.date}</td>
                  <td className="py-4 font-semibold text-[#f5a30f]">{row.reference}</td>
                  <td className="py-4">{row.description}</td>
                  <td
                    className={[
                      "py-4 text-right font-semibold",
                      showingDebit ? "text-[#ff5555]" : "text-[#f5a30f]",
                    ].join(" ")}
                  >
                    {row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ProjectWisePanel() {
  const [activeProjectTab, setActiveProjectTab] = useState("Project Wise cost");
  const [costSearch, setCostSearch] = useState("");
  const [projectWiseData, setProjectWiseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const projectWiseRows = projectWiseData?.rows || [];
  const projectWiseSummary = projectWiseData?.summary;
  const projectWiseCostCards = [
    { key: "material", label: "Material Cost", value: projectWiseSummary?.materialCostFormatted || "৳0" },
    { key: "suppliers", label: "Suppliers Cost", value: projectWiseSummary?.supplierCostFormatted || "৳0" },
    { key: "shipment", label: "Shipment Cost", value: projectWiseSummary?.shipmentCostFormatted || "৳0" },
    { key: "total", label: "Total Cost", value: projectWiseSummary?.totalCostFormatted || "৳0" },
  ];
  const projectWiseProfitCards = [
    { key: "budget", label: "Total Budget", value: projectWiseSummary?.totalBudgetFormatted || "৳0" },
    { key: "cost", label: "Total Cost", value: projectWiseSummary?.totalCostFormatted || "৳0" },
    { key: "profit", label: "Total Profit", value: projectWiseSummary?.totalProfitFormatted || "৳0" },
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadProjectWiseData() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const data = await getAccountsDashboard();

        if (isMounted) {
          setProjectWiseData(data.projectWise || { rows: [], summary: null });
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to load project wise accounts.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProjectWiseData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjectWiseRows = projectWiseRows.filter((row) => {
    const query = costSearch.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      row.projectId.toLowerCase().includes(query) ||
      row.name.toLowerCase().includes(query) ||
      row.buyerName.toLowerCase().includes(query) ||
      row.materialCost.toLowerCase().includes(query) ||
      row.supplierCost.toLowerCase().includes(query) ||
      row.shipmentCost.toLowerCase().includes(query) ||
      row.totalCost.toLowerCase().includes(query) ||
      row.totalBudget.toLowerCase().includes(query) ||
      row.profits.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap gap-3">
        {["Project Wise cost", "Project Wise Profit"].map((tab) => (
          <button
            className={[
              "rounded-[4px] px-4 py-[8px] text-[12px] font-medium leading-none transition",
              activeProjectTab === tab ? "bg-[#f5a30f] text-[#172136]" : "bg-[#334155] text-[#e5e7eb] hover:bg-[#3b4b60]",
            ].join(" ")}
            key={tab}
            onClick={() => setActiveProjectTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </section>

      {projectWiseData?.allocationMethod ? <p className="text-[12px] text-[#8f9cb0]">{projectWiseData.allocationMethod}</p> : null}
      {errorMessage ? <div className="rounded-[5px] border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[13px] text-[#f7c8cf]">{errorMessage}</div> : null}

      {activeProjectTab === "Project Wise cost" ? (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {projectWiseCostCards.map((card) => (
              <article
                className="rounded-[4px] border border-[#344059] bg-[#202b3f] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                key={card.key}
              >
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#8d9ab0]">{card.label}</div>
                  <div className="text-[15px] font-semibold text-[#f5a30f]">{card.value}</div>
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-[5px] border border-[#344059] bg-[#202b3f] px-4 py-4">
            <div className="text-[13px] font-semibold text-[#d7deea]">Project Wise Cost</div>

            <label className="mt-4 flex items-center gap-3 rounded-[4px] border border-[#344059] bg-[#202b3f] px-3 py-3 text-[#8b96ab]">
              <SearchIcon />
              <input
                className="w-full bg-transparent text-[12px] text-[#d7deea] outline-none placeholder:text-[#8b96ab]"
                onChange={(event) => setCostSearch(event.target.value)}
                placeholder="Search..."
                type="text"
                value={costSearch}
              />
            </label>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#344059] text-[10px] uppercase tracking-[0.14em] text-[#98a3b8]">
                    <th className="pb-3 font-medium">Project ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Buyer Name</th>
                    <th className="pb-3 font-medium">Material Cost</th>
                    <th className="pb-3 font-medium">Supplier Cost</th>
                    <th className="pb-3 font-medium">Shipment Cost</th>
                    <th className="pb-3 text-right font-medium">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={7}>
                        Loading project wise costs...
                      </td>
                    </tr>
                  ) : filteredProjectWiseRows.length > 0 ? (
                    filteredProjectWiseRows.map((row) => (
                    <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={row.projectId}>
                      <td className="py-4 font-semibold text-[#f5a30f]">{row.projectId}</td>
                      <td className="py-4">{row.name}</td>
                      <td className="py-4">{row.buyerName}</td>
                      <td className="py-4 font-semibold text-[#f1f5f9]">{row.materialCost}</td>
                      <td className="py-4 font-mono text-[#e5e7eb]">{row.supplierCost}</td>
                      <td className="py-4 font-mono text-[#e5e7eb]">{row.shipmentCost}</td>
                      <td className="py-4 text-right font-semibold text-[#f5a30f]">{row.totalCost}</td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={7}>
                        No project wise cost data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      {activeProjectTab === "Project Wise Profit" ? (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projectWiseProfitCards.map((card) => (
              <article
                className="rounded-[4px] border border-[#344059] bg-[#202b3f] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                key={card.key}
              >
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#8d9ab0]">{card.label}</div>
                  <div className="text-[15px] font-semibold text-[#f5a30f]">{card.value}</div>
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-[5px] border border-[#344059] bg-[#202b3f] px-4 py-4">
            <div className="text-[13px] font-semibold text-[#d7deea]">Project Wise Profit</div>

            <label className="mt-4 flex items-center gap-3 rounded-[4px] border border-[#344059] bg-[#202b3f] px-3 py-3 text-[#8b96ab]">
              <SearchIcon />
              <input
                className="w-full bg-transparent text-[12px] text-[#d7deea] outline-none placeholder:text-[#8b96ab]"
                onChange={(event) => setCostSearch(event.target.value)}
                placeholder="Search..."
                type="text"
                value={costSearch}
              />
            </label>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#344059] text-[10px] uppercase tracking-[0.14em] text-[#98a3b8]">
                    <th className="pb-3 font-medium">Project ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Buyer Name</th>
                    <th className="pb-3 font-medium">Total Budget</th>
                    <th className="pb-3 font-medium">Total Cost</th>
                    <th className="pb-3 font-medium">Profits</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={6}>
                        Loading project wise profit...
                      </td>
                    </tr>
                  ) : filteredProjectWiseRows.length > 0 ? (
                    filteredProjectWiseRows.map((row) => (
                    <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={row.projectId}>
                      <td className="py-4 font-semibold text-[#f5a30f]">{row.projectId}</td>
                      <td className="py-4">{row.name}</td>
                      <td className="py-4">{row.buyerName}</td>
                      <td className="py-4 font-semibold text-[#f1f5f9]">{row.totalBudget}</td>
                      <td className="py-4 font-mono text-[#e5e7eb]">{row.totalCost}</td>
                      <td className={["py-4 font-semibold", Number(row.profitsValue || 0) < 0 ? "text-[#ff5555]" : "text-[#22c55e]"].join(" ")}>
                        {Number(row.profitsValue || 0) < 0 ? `-${formatCurrency(Math.abs(Number(row.profitsValue || 0)))}` : row.profits}
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={6}>
                        No project wise profit data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function FactoryCostsPanel() {
  const [activeCostTab, setActiveCostTab] = useState("Daily Costs");
  const [factoryCosts, setFactoryCosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [receiptZoom, setReceiptZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState({
    category: "",
    description: "",
    amount: "",
    date: getTodayDateValue(),
    receiptName: "",
    receiptFile: null,
  });
  const rows = factoryCosts.filter((row) => row.costType === activeCostTab);
  const totalAmount = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const totalLabel = activeCostTab === "Daily Costs" ? "Total Daily Costs" : "Total Monthly Costs";
  const totalValue = `৳${totalAmount.toLocaleString("en-US")}`;
  const receiptPreviewUrl = receiptPreview?.receiptLocation ? getUploadUrl(receiptPreview.receiptLocation) : "";
  const isReceiptPreviewPdf = /\.pdf($|\?)/i.test(receiptPreviewUrl);
  const receiptZoomStyle = {
    transform: `scale(${receiptZoom})`,
    transformOrigin: "top center",
  };

  useEffect(() => {
    let isMounted = true;

    async function loadFactoryCosts() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const data = await getFactoryCosts();

        if (isMounted) {
          setFactoryCosts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to load factory costs.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFactoryCosts();

    return () => {
      isMounted = false;
    };
  }, []);

  function openModal() {
    setFormValues({
      category: "",
      description: "",
      amount: "",
      date: getTodayDateValue(),
      receiptName: "",
      receiptFile: null,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setFormValues({
      category: "",
      description: "",
      amount: "",
      date: getTodayDateValue(),
      receiptName: "",
      receiptFile: null,
    });
  }

  function handleFormChange(event) {
    const { name, value, files, type } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: type === "file" ? files?.[0]?.name ?? "" : value,
      ...(type === "file" ? { receiptFile: files?.[0] ?? null } : {}),
    }));
  }

  function handleExport() {
    const header = ["ID", "Category", "Description", "Amount", "Date", "Receipt"];
    const csvRows = rows.map((row) => [row.id, row.category, row.description, row.amountFormatted, row.date, row.receiptName]);
    const csv = [header, ...csvRows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeCostTab === "Daily Costs" ? "daily-factory-costs.csv" : "monthly-factory-costs.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formValues.category || !formValues.description || !formValues.amount || !formValues.date) {
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      const payload = new FormData();
      payload.append("category", activeCostTab === "Daily Costs" ? "daily" : "monthly");
      payload.append("costCategory", formValues.category);
      payload.append("description", formValues.description);
      payload.append("amount", String(Number(formValues.amount)));
      payload.append("date", formValues.date);

      if (formValues.receiptFile) {
        payload.append("receipt", formValues.receiptFile);
      }

      const createdCost = await createFactoryCost(payload);

      setFactoryCosts((current) => [createdCost, ...current]);
      closeModal();
    } catch (error) {
      setErrorMessage(error.message || "Failed to save factory cost.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleViewReceipt(row) {
    if (!row.receiptLocation || row.receiptLocation === "-") {
      return;
    }

    setReceiptZoom(1);
    setReceiptPreview(row);
  }

  function closeReceiptPreview() {
    setReceiptPreview(null);
    setReceiptZoom(1);
  }

  function zoomReceiptIn() {
    setReceiptZoom((current) => Math.min(current + 0.25, 2));
  }

  function zoomReceiptOut() {
    setReceiptZoom((current) => Math.max(current - 0.25, 0.5));
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h2 className="text-[18px] font-semibold leading-none text-[#f5f7fb]">Factory Costs</h2>
          <p className="text-[11px] text-[#8e9aad]">Track daily and monthly factory expenses</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-[6px] border border-[#f5a30f] bg-transparent px-5 py-3 text-[12px] font-medium text-[#f5f7fb] transition hover:bg-[#f5a30f]/10"
            onClick={handleExport}
            type="button"
          >
            <DownloadIcon />
            Export
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#f5a30f] px-5 py-3 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327]"
            onClick={openModal}
            type="button"
          >
            <PlusIcon />
            Add Cost
          </button>
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        {["Daily Costs", "Monthly Costs"].map((tab) => (
          <button
            className={[
              "rounded-[4px] px-4 py-[9px] text-[12px] font-medium leading-none transition",
              activeCostTab === tab ? "bg-[#f5a30f] text-[#172136]" : "bg-[#4a5875] text-[#edf2f7] hover:bg-[#5a6886]",
            ].join(" ")}
            key={tab}
            onClick={() => setActiveCostTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </section>

      <section className="rounded-[5px] border border-[#80561a] bg-[#2f2a28] px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#98a3b8]">{totalLabel}</div>
          <div className="text-[30px] font-semibold text-[#ffb01a]">{totalValue}</div>
        </div>
      </section>

      {errorMessage ? <div className="rounded-[5px] border border-[#7f1d1d] bg-[#3a1d1d] px-4 py-3 text-[12px] text-[#fecaca]">{errorMessage}</div> : null}

      <section className="rounded-[5px] border border-[#344059] bg-[#202b3f] px-4 py-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#344059] text-[10px] uppercase tracking-[0.14em] text-[#98a3b8]">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]">
                  <td className="py-6 text-center text-[#9aa5ba]" colSpan={6}>
                    Loading factory costs...
                  </td>
                </tr>
              ) : null}
              {!isLoading && rows.length === 0 ? (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]">
                  <td className="py-6 text-center text-[#9aa5ba]" colSpan={6}>
                    No {activeCostTab === "Daily Costs" ? "daily" : "monthly"} factory costs yet.
                  </td>
                </tr>
              ) : null}
              {rows.map((row) => (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={row.id}>
                  <td className="py-4 font-semibold text-[#f5a30f]">{row.id}</td>
                  <td className="py-4">{row.category}</td>
                  <td className="py-4">{row.description}</td>
                  <td className="py-4 font-semibold text-[#f5a30f]">{row.amountFormatted}</td>
                  <td className="py-4 text-[#b6c0d2]">{row.date}</td>
                  <td className="py-4 text-[#b6c0d2]">
                    {row.receiptLocation && row.receiptLocation.startsWith("/uploads/factory_cost_receipt/") ? (
                      <button
                        className="text-[13px] font-medium text-[#f5a30f] transition hover:text-[#ffbf47]"
                        onClick={() => handleViewReceipt(row)}
                        type="button"
                      >
                        View
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1422]/70 px-4 py-8">
          <div className="w-full max-w-[450px] overflow-hidden rounded-[6px] border border-[#344059] bg-[#202b3f] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#344059] px-4 py-4">
              <h3 className="text-[20px] font-semibold text-[#e6ebf4]">Add {activeCostTab === "Daily Costs" ? "Daily" : "Monthly"} Factory Cost</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <Field label="Category *" name="category" onChange={handleFormChange} placeholder="" value={formValues.category} />
              <Field label="Description *" name="description" onChange={handleFormChange} placeholder="" value={formValues.description} />
              <Field label="Amount (৳) *" name="amount" onChange={handleFormChange} placeholder="0.00" type="number" value={formValues.amount} />
              <Field label="Date" name="date" onChange={handleFormChange} placeholder="" readOnly type="date" value={formValues.date} />
              <ReceiptUpload
                fileName={formValues.receiptName}
                onChange={handleFormChange}
              />

              <div className="flex items-center justify-end gap-3 border-t border-[#344059] pt-4">
                <button className="px-4 py-2 text-[12px] text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                  Cancel
                </button>
                <button
                  className="rounded-[4px] bg-[#f5a30f] px-4 py-2 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? "Saving..." : "Save Cost"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {receiptPreview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1422]/75 px-4 py-4">
          <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-[820px] flex-col overflow-hidden rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <div>
                <h3 className="text-[20px] font-semibold text-[#e6ebf4]">Factory Cost Receipt</h3>
                <p className="mt-1 text-[13px] text-[#8f9cb0]">
                  {receiptPreview.id} · {receiptPreview.category}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center overflow-hidden rounded-md border border-[#3c4b64] bg-[#182235]">
                  <button
                    aria-label="Zoom out receipt"
                    className="flex h-9 w-9 items-center justify-center text-[#d7deea] transition hover:bg-[#26354b] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                    disabled={receiptZoom <= 0.5}
                    onClick={zoomReceiptOut}
                    title="Zoom out"
                    type="button"
                  >
                    <MinusIcon />
                  </button>
                  <span className="min-w-14 border-x border-[#3c4b64] px-2 text-center text-[12px] font-medium text-[#d7deea]">
                    {Math.round(receiptZoom * 100)}%
                  </span>
                  <button
                    aria-label="Zoom in receipt"
                    className="flex h-9 w-9 items-center justify-center text-[#d7deea] transition hover:bg-[#26354b] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                    disabled={receiptZoom >= 2}
                    onClick={zoomReceiptIn}
                    title="Zoom in"
                    type="button"
                  >
                    <PlusIcon />
                  </button>
                </div>
                <button className="text-[#d7deea] transition hover:text-white" onClick={closeReceiptPreview} type="button">
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-[#182235] p-4">
              {isReceiptPreviewPdf ? (
                <div
                  className="mx-auto w-full"
                  style={{
                    height: `${70 * receiptZoom}vh`,
                    maxWidth: `${100 * receiptZoom}%`,
                    width: `${100 * receiptZoom}%`,
                  }}
                >
                  <iframe
                    className="h-[70vh] w-full rounded-md border border-[#314058] bg-white"
                    src={receiptPreviewUrl}
                    style={receiptZoomStyle}
                    title="Factory cost receipt"
                  />
                </div>
              ) : (
                <div className="flex justify-center">
                  <img
                    alt="Factory cost receipt"
                    className="max-h-[70vh] max-w-full rounded-md border border-[#314058] object-contain"
                    src={receiptPreviewUrl}
                    style={receiptZoomStyle}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, name, placeholder, value, onChange, type = "text", readOnly = false }) {
  return (
    <label className="block space-y-2">
      <span className="text-[12px] font-medium text-[#d7deea]">{label}</span>
      <input
        className="h-11 w-full rounded-[4px] border border-[#344059] bg-[#202b3f] px-3 text-[13px] text-white outline-none placeholder:text-[#6f7d95] focus:border-[#4e6180]"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        type={type}
        value={value}
      />
    </label>
  );
}

function ReceiptUpload({ fileName, onSelect, onChange }) {
  return (
    <label className="block space-y-2">
      <span className="text-[12px] font-medium text-[#d7deea]">Receipt (Optional)</span>
      <div className="flex min-h-[92px] cursor-pointer items-center justify-center rounded-[4px] border border-dashed border-[#344059] bg-[#202b3f] px-4 text-center text-[12px] text-[#8e9aad]">
        <input
          accept="image/*,.pdf"
          className="sr-only"
          onChange={(event) => {
            onChange?.(event);
            onSelect?.(event.target.files?.[0]?.name ?? "");
          }}
          name="receiptName"
          type="file"
        />
        <span>{fileName || "Upload Image or PDF (Max 5MB)"}</span>
      </div>
    </label>
  );
}

function ExportCostsPanel() {
  const [exportCosts, setExportCosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState({
    project: "",
    destination: "",
    date: getTodayDateValue(),
    category: "",
    amount: "",
    description: "",
  });
  const [draftItems, setDraftItems] = useState([]);

  const totalExportCosts = exportCosts.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);

  useEffect(() => {
    let isMounted = true;

    async function loadShipmentCosts() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const [shipmentCosts, projectRows] = await Promise.all([getShipmentCosts(), getProjects()]);

        if (isMounted) {
          setExportCosts(Array.isArray(shipmentCosts) ? shipmentCosts : []);
          setProjects(Array.isArray(projectRows) ? projectRows : []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to load shipment costs.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadShipmentCosts();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleExport() {
    const header = ["ID", "Project", "Destination", "Date", "Total Cost"];
    const rows = exportCosts.map((item) => [item.id, item.project, item.destination, item.date, item.totalCost]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "export-costs.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openModal() {
    setFormValues({
      project: "",
      destination: "",
      date: getTodayDateValue(),
      category: "",
      amount: "",
      description: "",
    });
    setDraftItems([]);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setFormValues({
      project: "",
      destination: "",
      date: getTodayDateValue(),
      category: "",
      amount: "",
      description: "",
    });
    setDraftItems([]);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleAddItem() {
    if (!formValues.category || !formValues.amount) {
      return;
    }

    setDraftItems((current) => [
      ...current,
      {
        category: formValues.category,
        amount: Number(formValues.amount),
        description: formValues.description,
      },
    ]);

    setFormValues((current) => ({
      ...current,
      category: "",
      amount: "",
      description: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const itemsToSave =
      draftItems.length > 0
        ? draftItems
        : formValues.category && formValues.amount
          ? [
              {
                category: formValues.category,
                amount: Number(formValues.amount),
                description: formValues.description,
              },
            ]
          : [];

    if (!formValues.project || !formValues.destination || !formValues.date || itemsToSave.length === 0) {
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      const shipmentCosts = await createShipmentCosts({
        projectId: Number(formValues.project),
        destination: formValues.destination,
        shipmentDate: formValues.date,
        items: itemsToSave,
      });

      setExportCosts(Array.isArray(shipmentCosts) ? shipmentCosts : []);
      closeModal();
    } catch (error) {
      setErrorMessage(error.message || "Failed to save shipment cost.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-[18px] font-semibold leading-none text-[#f5f7fb]">Shipment Cost</h2>
          <p className="text-[11px] text-[#8e9aad]">Track shipment expenses with itemized breakdown</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-[6px] border border-[#f5a30f] bg-transparent px-5 py-3 text-[12px] font-medium text-[#f5f7fb] transition hover:bg-[#f5a30f]/10"
            onClick={handleExport}
            type="button"
          >
            <DownloadIcon />
            Export
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#f5a30f] px-5 py-3 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327]"
            onClick={openModal}
            type="button"
          >
            <PlusIcon />
            Add Cost Breakdown
          </button>
        </div>
      </section>

      <section className="rounded-[5px] border border-[#80561a] bg-[#2f2a28] px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#98a3b8]">Total Shipment Cost</div>
          <div className="text-[30px] font-semibold text-[#ffb01a]">৳{totalExportCosts.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </section>

      {errorMessage ? <div className="rounded-[5px] border border-[#7f1d1d] bg-[#3a1d1d] px-4 py-3 text-[12px] text-[#fecaca]">{errorMessage}</div> : null}

      <section className="rounded-[5px] border border-[#344059] bg-[#202b3f] px-4 py-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#344059] text-[10px] uppercase tracking-[0.14em] text-[#98a3b8]">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Destination</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Total Cost</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]">
                  <td className="py-6 text-center text-[#9aa5ba]" colSpan={6}>
                    Loading shipment costs...
                  </td>
                </tr>
              ) : null}
              {!isLoading && exportCosts.length === 0 ? (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]">
                  <td className="py-6 text-center text-[#9aa5ba]" colSpan={6}>
                    No shipment costs yet.
                  </td>
                </tr>
              ) : null}
              {exportCosts.map((item) => (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={`${item.projectId}-${item.destination}-${item.date}`}>
                  <td className="py-4 font-semibold text-[#f5a30f]">{item.id}</td>
                  <td className="py-4">{item.project}</td>
                  <td className="py-4">{item.destination}</td>
                  <td className="py-4 text-[#b6c0d2]">{item.date}</td>
                  <td className="py-4 font-semibold text-[#f5a30f]">{item.totalCost}</td>
                  <td className="py-4">
                    <button
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-[#f5a30f] transition hover:text-[#ffc550]"
                      onClick={() => setSelectedBreakdown(item)}
                      type="button"
                    >
                      <EyeIcon />
                      <span>View Breakdown</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1422]/70 px-4 py-8">
          <div className="w-full max-w-[960px] overflow-hidden rounded-[6px] border border-[#344059] bg-[#202b3f] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#344059] px-4 py-4">
              <h3 className="text-[20px] font-semibold text-[#e6ebf4]">Add Shipment Cost Breakdown</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <label className="block space-y-2">
                  <span className="text-[12px] font-medium text-[#d7deea]">Project *</span>
                  <select
                    className="h-11 w-full rounded-[4px] border border-[#344059] bg-[#202b3f] px-3 text-[13px] text-white outline-none focus:border-[#4e6180]"
                    name="project"
                    onChange={handleFormChange}
                    value={formValues.project}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.recordId} value={project.recordId}>
                        {project.id} - {project.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Destination *"
                  name="destination"
                  onChange={handleFormChange}
                  placeholder="e.g., USA, UK, Germany"
                  value={formValues.destination}
                />
                <Field label="Date *" name="date" onChange={handleFormChange} placeholder="" type="date" value={formValues.date} />
                <Field label="Category *" name="category" onChange={handleFormChange} placeholder="" value={formValues.category} />
                <Field label="Amount (৳) *" name="amount" onChange={handleFormChange} placeholder="0.00" type="number" value={formValues.amount} />
                <Field
                  label="Description"
                  name="description"
                  onChange={handleFormChange}
                  placeholder="Optional details"
                  value={formValues.description}
                />
              </div>

              <button
                className="flex h-10 w-full items-center justify-center gap-2 rounded-[4px] bg-[#f5a30f] text-[13px] font-medium text-[#172136] transition hover:bg-[#ffb327]"
                onClick={handleAddItem}
                type="button"
              >
                <PlusIcon />
                Add Item
              </button>

              {draftItems.length > 0 ? (
                <div className="space-y-2 rounded-[4px] border border-[#344059] bg-[#1b2435] p-3">
                  {draftItems.map((item, index) => (
                    <div className="flex items-center justify-between text-[12px] text-[#d7deea]" key={`${item.category}-${index}`}>
                      <span>{item.category}</span>
                      <span>৳{item.amount.toLocaleString("en-US")}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 border-t border-[#344059] pt-4">
                <button className="px-4 py-2 text-[12px] text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                  Cancel
                </button>
                <button
                  className="rounded-[4px] bg-[#f5a30f] px-4 py-2 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {selectedBreakdown ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1422]/70 px-4 py-8">
          <div className="w-full max-w-[460px] overflow-hidden rounded-[6px] border border-[#344059] bg-[#202b3f] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#344059] px-4 py-4">
              <div>
                <h3 className="text-[18px] font-semibold text-[#e6ebf4]">{selectedBreakdown.id} Breakdown</h3>
                <p className="mt-1 text-[12px] text-[#8e9aad]">
                  {selectedBreakdown.project} • {selectedBreakdown.destination}
                </p>
              </div>
              <button className="text-[#d7deea] transition hover:text-white" onClick={() => setSelectedBreakdown(null)} type="button">
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-3 px-4 py-4">
              {selectedBreakdown.items.map((item, index) => (
                <div className="rounded-[4px] border border-[#344059] bg-[#1b2435] p-3" key={`${item.category}-${index}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[13px] font-medium text-[#e6ebf4]">{item.category}</div>
                    <div className="text-[13px] font-semibold text-[#f5a30f]">৳{item.amount.toLocaleString("en-US")}</div>
                  </div>
                  <div className="mt-1 text-[12px] text-[#8e9aad]">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MonthlyBillsPanel() {
  const [monthlyBills, setMonthlyBills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState({
    category: "",
    description: "",
    amount: "",
    date: getTodayDateValue(),
    receipt: "",
    receiptFile: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadMonthlyBills() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const data = await getMonthlyBills();

        if (isMounted) {
          setMonthlyBills(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to load monthly bills.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMonthlyBills();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleExport() {
    const header = ["Bill ID", "Category", "Description", "Amount", "Date", "Receipt", "Status"];
    const rows = monthlyBills.map((item) => [
      item.id,
      item.category,
      item.description,
      item.amountFormatted || item.amount,
      item.billDate,
      item.receiptName || "-",
      item.status,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "monthly-bills.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openModal() {
    setFormValues({
      category: "",
      description: "",
      amount: "",
      date: getTodayDateValue(),
      receipt: "",
      receiptFile: null,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleFormChange(event) {
    const { name, value, files, type } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: type === "file" ? files?.[0]?.name ?? "" : value,
      ...(type === "file" ? { receiptFile: files?.[0] ?? null } : {}),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setErrorMessage("");

      const payload = new FormData();
      payload.append("category", formValues.category);
      payload.append("description", formValues.description);
      payload.append("amount", formValues.amount);
      payload.append("billDate", formValues.date);

      if (formValues.receiptFile) {
        payload.append("receipt", formValues.receiptFile);
      }

      const newBill = await createMonthlyBill(payload);
      setMonthlyBills((current) => [newBill, ...current]);
      closeModal();
    } catch (error) {
      setErrorMessage(error.message || "Failed to save monthly bill.");
    } finally {
      setIsSaving(false);
    }
  }

  function toggleBillStatus(id) {
    setMonthlyBills((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: item.status === "Paid" ? "Pending" : "Paid" } : item,
      ),
    );
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-[18px] font-semibold leading-none text-[#f5f7fb]">Monthly Bills</h2>
          <p className="text-[11px] text-[#8e9aad]">Track and manage recurring bills for Factory and Office</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-[6px] border border-[#f5a30f] bg-transparent px-5 py-3 text-[12px] font-medium text-[#f5f7fb] transition hover:bg-[#f5a30f]/10"
            onClick={handleExport}
            type="button"
          >
            <DownloadIcon />
            Export
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#f5a30f] px-5 py-3 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327]"
            onClick={openModal}
            type="button"
          >
            <PlusIcon />
            Add Bill
          </button>
        </div>
      </section>

      {errorMessage ? <div className="rounded-[5px] border border-[#7f1d1d] bg-[#3a1d1d] px-4 py-3 text-[12px] text-[#fecaca]">{errorMessage}</div> : null}

      <section className="rounded-[5px] border border-[#344059] bg-[#202b3f] px-4 py-3">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#344059] text-[10px] uppercase tracking-[0.16em] text-[#93a0b8]">
                <th className="w-[110px] pb-4 pt-3 font-medium">Bill ID</th>
                <th className="w-[110px] pb-4 pt-3 font-medium">Category</th>
                <th className="w-[110px] pb-4 pt-3 font-medium">Description</th>
                <th className="w-[110px] pb-4 pt-3 font-medium">Amount</th>
                <th className="w-[110px] pb-4 pt-3 font-medium">Date</th>
                <th className="w-[110px] pb-4 pt-3 font-medium">Receipt</th>
                <th className="w-[110px] pb-4 pt-3 font-medium">Status</th>
                <th className="w-[140px] pb-4 pt-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]">
                  <td className="py-6 text-center text-[#9aa5ba]" colSpan={8}>
                    Loading monthly bills...
                  </td>
                </tr>
              ) : null}
              {!isLoading && monthlyBills.length === 0 ? (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]">
                  <td className="py-6 text-center text-[#9aa5ba]" colSpan={8}>
                    No monthly bills yet.
                  </td>
                </tr>
              ) : null}
              {monthlyBills.map((item) => (
                <tr className="border-b border-[#344059] text-[14px] text-[#d7deea]" key={item.id}>
                  <td className="py-5 font-semibold text-[#f5a30f]">{item.id}</td>
                  <td className="py-5 lowercase">{item.category}</td>
                  <td className="py-5">{item.description}</td>
                  <td className="py-5 font-semibold text-[#f5a30f]">{item.amountFormatted}</td>
                  <td className="py-5 text-[#c0c8d8]">{item.billDate}</td>
                  <td className="py-5 text-[#c0c8d8]">{item.receiptName}</td>
                  <td className="py-5">
                    <span
                      className={[
                        "inline-flex rounded-[4px] px-[8px] py-[4px] text-[10px] font-medium leading-none",
                        item.status === "Paid" ? "bg-[#466c2f] text-[#d7f0ae]" : "bg-[#7b5a26] text-[#ffd27a]",
                      ].join(" ")}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-5 text-right">
                    <button
                      className="rounded-[4px] bg-[#ffb01a] px-4 py-[10px] text-[12px] font-medium text-[#172136] transition hover:bg-[#ffc13d]"
                      onClick={() => toggleBillStatus(item.id)}
                      type="button"
                    >
                      {item.status === "Paid" ? "Unpay" : "Mark Paid"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1422]/70 px-4 py-8">
          <div className="w-full max-w-[760px] overflow-hidden rounded-[6px] border border-[#344059] bg-[#202b3f] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#344059] px-4 py-4">
              <h3 className="text-[20px] font-semibold text-[#e6ebf4]">Add Monthly Bill</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="Category *"
                  name="category"
                  onChange={handleFormChange}
                  placeholder=""
                  value={formValues.category}
                />
                <Field label="Description *" name="description" onChange={handleFormChange} placeholder="" value={formValues.description} />
                <Field label="Amount (৳) *" name="amount" onChange={handleFormChange} placeholder="" type="number" value={formValues.amount} />
                <Field label="Date *" name="date" onChange={handleFormChange} placeholder="" type="date" value={formValues.date} />
                <div className="md:col-span-2">
                  <ReceiptUpload fileName={formValues.receipt} onChange={handleFormChange} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#344059] pt-4">
                <button className="px-4 py-2 text-[12px] text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                  Cancel
                </button>
                <button
                  className="rounded-[4px] bg-[#f5a30f] px-4 py-2 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? "Saving..." : "Add Bill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function OfficeCostsPanel() {
  const [activeCostTab, setActiveCostTab] = useState("Daily Costs");
  const [officeCosts, setOfficeCosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState({
    category: "",
    description: "",
    amount: "",
    date: getTodayDateValue(),
    receiptName: "",
    receiptFile: null,
  });
  const rows = officeCosts.filter((item) => item.costType === activeCostTab);
  const totalOfficeCosts = rows.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalLabel = activeCostTab === "Daily Costs" ? "Total Daily Costs" : "Total Monthly Costs";

  useEffect(() => {
    let isMounted = true;

    async function loadOfficeBills() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const data = await getOfficeBills();

        if (isMounted) {
          setOfficeCosts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to load office costs.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOfficeBills();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleExport() {
    const header = ["ID", "Category", "Description", "Amount", "Date", "Receipt"];
    const csvRows = rows.map((item) => [item.id, item.category, item.description, item.amountFormatted, item.date, item.receiptName]);
    const csv = [header, ...csvRows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeCostTab === "Daily Costs" ? "daily-office-costs.csv" : "monthly-office-costs.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openModal() {
    setFormValues({
      category: "",
      description: "",
      amount: "",
      date: getTodayDateValue(),
      receiptName: "",
      receiptFile: null,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setFormValues({
      category: "",
      description: "",
      amount: "",
      date: getTodayDateValue(),
      receiptName: "",
      receiptFile: null,
    });
  }

  function handleFormChange(event) {
    const { name, value, files, type } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: type === "file" ? files?.[0]?.name ?? "" : value,
      ...(type === "file" ? { receiptFile: files?.[0] ?? null } : {}),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formValues.category || !formValues.description || !formValues.amount || !formValues.date) {
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      const payload = new FormData();
      payload.append("category", activeCostTab === "Daily Costs" ? "daily" : "monthly");
      payload.append("costCategory", formValues.category);
      payload.append("description", formValues.description);
      payload.append("amount", String(Number(formValues.amount)));
      payload.append("date", formValues.date);

      if (formValues.receiptFile) {
        payload.append("receipt", formValues.receiptFile);
      }

      const createdCost = await createOfficeBill(payload);
      setOfficeCosts((current) => [createdCost, ...current]);
      closeModal();
    } catch (error) {
      setErrorMessage(error.message || "Failed to save office cost.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleViewReceipt(row) {
    if (!row.receiptLocation || row.receiptLocation === "-") {
      return;
    }

    setReceiptPreview(row);
  }

  function closeReceiptPreview() {
    setReceiptPreview(null);
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h2 className="text-[18px] font-semibold leading-none text-[#f5f7fb]">Office Costs</h2>
          <p className="text-[11px] text-[#8e9aad]">Track daily and monthly office expenses</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-[6px] border border-[#f5a30f] bg-transparent px-5 py-3 text-[12px] font-medium text-[#f5f7fb] transition hover:bg-[#f5a30f]/10"
            onClick={handleExport}
            type="button"
          >
            <DownloadIcon />
            Export
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#f5a30f] px-5 py-3 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327]"
            onClick={openModal}
            type="button"
          >
            <PlusIcon />
            Add Cost
          </button>
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        {["Daily Costs", "Monthly Costs"].map((tab) => (
          <button
            className={[
              "rounded-[4px] px-4 py-[9px] text-[12px] font-medium leading-none transition",
              activeCostTab === tab ? "bg-[#f5a30f] text-[#172136]" : "bg-[#4a5875] text-[#edf2f7] hover:bg-[#5a6886]",
            ].join(" ")}
            key={tab}
            onClick={() => setActiveCostTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </section>

      <section className="rounded-[5px] border border-[#80561a] bg-[#2f2a28] px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#98a3b8]">{totalLabel}</div>
          <div className="text-[30px] font-semibold text-[#ffb01a]">৳{totalOfficeCosts.toLocaleString("en-US")}</div>
        </div>
      </section>

      {errorMessage ? <div className="rounded-[5px] border border-[#7f1d1d] bg-[#3a1d1d] px-4 py-3 text-[12px] text-[#fecaca]">{errorMessage}</div> : null}

      <section className="rounded-[5px] border border-[#344059] bg-[#202b3f] px-4 py-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#344059] text-[10px] uppercase tracking-[0.14em] text-[#98a3b8]">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]">
                  <td className="py-6 text-center text-[#9aa5ba]" colSpan={6}>
                    Loading office costs...
                  </td>
                </tr>
              ) : null}
              {!isLoading && rows.length === 0 ? (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]">
                  <td className="py-6 text-center text-[#9aa5ba]" colSpan={6}>
                    No {activeCostTab === "Daily Costs" ? "daily" : "monthly"} office costs yet.
                  </td>
                </tr>
              ) : null}
              {rows.map((item) => (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={item.id}>
                  <td className="py-4 font-semibold text-[#f5a30f]">{item.id}</td>
                  <td className="py-4">{item.category}</td>
                  <td className="py-4">{item.description}</td>
                  <td className="py-4 font-semibold text-[#f5a30f]">{item.amountFormatted}</td>
                  <td className="py-4 text-[#b6c0d2]">{item.date}</td>
                  <td className="py-4 text-[#b6c0d2]">
                    {item.receiptLocation && item.receiptLocation.startsWith("/uploads/office_bill_receipt/") ? (
                      <button
                        className="text-[13px] font-medium text-[#f5a30f] transition hover:text-[#ffbf47]"
                        onClick={() => handleViewReceipt(item)}
                        type="button"
                      >
                        View
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1422]/70 px-4 py-8">
          <div className="w-full max-w-[450px] overflow-hidden rounded-[6px] border border-[#344059] bg-[#202b3f] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#344059] px-4 py-4">
              <h3 className="text-[20px] font-semibold text-[#e6ebf4]">Add {activeCostTab === "Daily Costs" ? "Daily" : "Monthly"} Office Cost</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <Field label="Category *" name="category" onChange={handleFormChange} placeholder="" value={formValues.category} />
              <Field label="Description *" name="description" onChange={handleFormChange} placeholder="" value={formValues.description} />
              <Field label="Amount (৳) *" name="amount" onChange={handleFormChange} placeholder="0.00" type="number" value={formValues.amount} />
              <Field label="Date" name="date" onChange={handleFormChange} placeholder="" readOnly type="date" value={formValues.date} />
              <ReceiptUpload fileName={formValues.receiptName} onChange={handleFormChange} />

              <div className="flex items-center justify-end gap-3 border-t border-[#344059] pt-4">
                <button className="px-4 py-2 text-[12px] text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                  Cancel
                </button>
                <button
                  className="rounded-[4px] bg-[#f5a30f] px-4 py-2 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? "Saving..." : "Save Cost"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {receiptPreview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1422]/75 px-4 py-4">
          <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-[820px] flex-col overflow-hidden rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <div>
                <h3 className="text-[20px] font-semibold text-[#e6ebf4]">Office Cost Receipt</h3>
                <p className="mt-1 text-[13px] text-[#8f9cb0]">
                  {receiptPreview.id} · {receiptPreview.category}
                </p>
              </div>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeReceiptPreview} type="button">
                <CloseIcon />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-[#182235] p-4">
              <div className="flex justify-center">
                <img
                  alt="Office cost receipt"
                  className="max-h-[70vh] max-w-full rounded-md border border-[#314058] object-contain"
                  src={getUploadUrl(receiptPreview.receiptLocation)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AccountsPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <section className="w-full min-w-0">
      <div className="rounded-[3px] bg-[#111827] px-0 py-0 text-white">
        <div className="space-y-5">
          <div className="space-y-1">
            <h1 className="text-[18px] font-semibold leading-none text-[#e5e7eb]">Accounts</h1>
            <p className="text-[11px] text-[#8e9aad]">Financial ledger and transaction management</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {accountTabs.map((tab) => (
              <button
                className={[
                  "rounded-[3px] px-4 py-[8px] text-[11px] font-medium leading-none transition",
                  activeTab === tab ? "bg-[#f5a30f] text-[#172136]" : "bg-[#334155] text-[#e5e7eb] hover:bg-[#3b4b60]",
                ].join(" ")}
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Dashboard" ? <DashboardPanel /> : null}
          {activeTab === "Project Wise" ? <ProjectWisePanel /> : null}
          {activeTab === "Factory Costs" ? <FactoryCostsPanel /> : null}
          {activeTab === "Shipment Costs" ? <ExportCostsPanel /> : null}
          {activeTab === "Office Costs" ? <OfficeCostsPanel /> : null}
        </div>
      </div>
    </section>
  );
}
