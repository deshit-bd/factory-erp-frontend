import { useState } from "react";

const accountTabs = ["Dashboard", "Project Wise", "Factory Costs", "Exports Costs", "Monthly Bills", "Office Costs"];

const summaryCards = [
  { key: "receivables", label: "Total Receivables", value: "৳0", tone: "amber", icon: "receivables" },
  { key: "payables", label: "Total Payables", value: "৳0", tone: "red", icon: "payables" },
  { key: "cash", label: "Cash/Bank Balance", value: "৳27,000", tone: "amber", icon: "cash" },
  { key: "profit", label: "Net Profit/Loss", value: "+৳27,000", tone: "amber", icon: "profit" },
];

const debitRows = [
  { date: "2026-04-10", reference: "EXP-001", category: "Export Cost / PRJ-001", amount: "-4000.00" },
  { date: "2026-04-16", reference: "PAY-001", category: "Supplier Payment / PRJ-003", amount: "-300.00" },
  { date: "2026-04-16", reference: "OFC-001", category: "Office Cost / Travel", amount: "-300.00" },
];

const creditRows = [
  { date: "2026-04-10", reference: "INV-001", buyerName: "ABC Corp / PRJ-001", amount: "80000.00" },
  { date: "2026-04-16", reference: "INV-002", buyerName: "XYZ / PRJ-003", amount: "90000.00" },
  { date: "2026-04-16", reference: "INV-003", buyerName: "ABC / PRJ - 004", amount: "7000.00" },
];

const projectWiseCostCards = [
  { key: "material", label: "Material Cost", value: "৳0" },
  { key: "suppliers", label: "Suppliers Cost", value: "৳0" },
  { key: "total", label: "Total Cost", value: "৳27,000" },
];

const projectWiseCostRows = [
  {
    projectId: "PRJ-001",
    name: "Industrial Valves Order",
    buyerName: "ABC crop",
    materialCost: "50000.00",
    supplierCost: "30000.00",
    exportCost: "20000.00",
    totalCost: "400000",
  },
  {
    projectId: "PRJ-002",
    name: "Steel Pipes Manufacturing",
    buyerName: "XYZ.comp",
    materialCost: "70000.00",
    supplierCost: "40000.00",
    exportCost: "30000.00",
    totalCost: "400000",
  },
];

const projectWiseProfitCards = [
  { key: "budget", label: "Total Budget", value: "৳0" },
  { key: "cost", label: "Total Cost", value: "৳0" },
  { key: "profit", label: "Total Profit", value: "৳27,000" },
];

const projectWiseProfitRows = [
  {
    projectId: "PRJ-001",
    name: "Industrial Valves Order",
    buyerName: "ABC crop",
    totalBudget: "50000.00",
    totalCost: "30000.00",
    profits: "20000.00",
  },
  {
    projectId: "PRJ-002",
    name: "Steel Pipes Manufacturing",
    buyerName: "XYZ.comp",
    totalBudget: "70000.00",
    totalCost: "40000.00",
    profits: "30000.00",
  },
];

const factoryCostRows = {
  "Daily Costs": [{ id: "FC-001", category: "Electricity", amount: "৳450", date: "2026-04-17", recipe: "-" }],
  "Monthly Costs": [{ id: "FC-002", category: "Rent", amount: "৳15,000", date: "2026-04-01", recipe: "-" }],
};

const initialExportCosts = [
  {
    id: "EXP-001",
    project: "PRJ-001",
    destination: "USA",
    date: "2026-04-15",
    totalCost: "৳1,850",
    items: [
      { category: "Shipping", amount: 1200, description: "Ocean freight" },
      { category: "Customs", amount: 350, description: "Import clearance" },
      { category: "Insurance", amount: 300, description: "Cargo insurance" },
    ],
  },
];

const initialMonthlyBills = [
  {
    id: "BILL-001",
    vendor: "Electric Company",
    category: "Utilities",
    expenseFor: "Factory",
    amount: "৳2,500",
    dueDate: "2026-04-25",
    status: "Pending",
    receipt: null,
  },
  {
    id: "BILL-002",
    vendor: "Internet Provider",
    category: "Services",
    expenseFor: "Office",
    amount: "৳150",
    dueDate: "2026-04-20",
    status: "Paid",
    receipt: null,
  },
];

const initialOfficeCosts = [
  {
    id: "OFC-001",
    category: "Travel",
    description: "Client meeting in NY",
    amount: "৳350",
    date: "2026-04-15",
    receipt: "-",
  },
  {
    id: "OFC-002",
    category: "Supplies",
    description: "Office supplies",
    amount: "৳125",
    date: "2026-04-14",
    receipt: "-",
  },
];

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

function DashboardPanel() {
  const [activeLedger, setActiveLedger] = useState("Debit");
  const showingDebit = activeLedger === "Debit";
  const rows = showingDebit ? debitRows : creditRows;
  const searchPlaceholder = showingDebit ? "Search Debit transactions..." : "Search Credit transactions...";

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
          <span className="text-[12px]">{searchPlaceholder}</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#344059] text-[10px] uppercase tracking-[0.14em] text-[#98a3b8]">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">{showingDebit ? "Category" : "Buyer Name"}</th>
                <th className="pb-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={row.reference}>
                  <td className="py-4 text-[#9aa5ba]">{row.date}</td>
                  <td className="py-4 font-semibold text-[#f5a30f]">{row.reference}</td>
                  <td className="py-4">{showingDebit ? row.category : row.buyerName}</td>
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

  const filteredProjectWiseCostRows = projectWiseCostRows.filter((row) => {
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
      row.exportCost.toLowerCase().includes(query) ||
      row.totalCost.toLowerCase().includes(query)
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

      {activeProjectTab === "Project Wise cost" ? (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                    <th className="pb-3 font-medium">Export Cost</th>
                    <th className="pb-3 text-right font-medium">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjectWiseCostRows.map((row) => (
                    <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={row.projectId}>
                      <td className="py-4 font-semibold text-[#f5a30f]">{row.projectId}</td>
                      <td className="py-4">{row.name}</td>
                      <td className="py-4">{row.buyerName}</td>
                      <td className="py-4 font-semibold text-[#f1f5f9]">{row.materialCost}</td>
                      <td className="py-4 font-mono text-[#e5e7eb]">{row.supplierCost}</td>
                      <td className="py-4 font-mono text-[#e5e7eb]">{row.exportCost}</td>
                      <td className="py-4 text-right font-semibold text-[#f5a30f]">{row.totalCost}</td>
                    </tr>
                  ))}
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
            <div className="text-[13px] font-semibold text-[#d7deea]">Project Wise Cost</div>

            <div className="mt-4 flex items-center gap-3 rounded-[4px] border border-[#344059] bg-[#202b3f] px-3 py-3 text-[#8b96ab]">
              <SearchIcon />
              <span className="text-[12px]">Search...</span>
            </div>

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
                  {projectWiseProfitRows.map((row) => (
                    <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={row.projectId}>
                      <td className="py-4 font-semibold text-[#f5a30f]">{row.projectId}</td>
                      <td className="py-4">{row.name}</td>
                      <td className="py-4">{row.buyerName}</td>
                      <td className="py-4 font-semibold text-[#f1f5f9]">{row.totalBudget}</td>
                      <td className="py-4 font-mono text-[#e5e7eb]">{row.totalCost}</td>
                      <td className="py-4 font-semibold text-[#f1f5f9]">{row.profits}</td>
                    </tr>
                  ))}
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
  const rows = factoryCostRows[activeCostTab];
  const totalLabel = activeCostTab === "Daily Costs" ? "Total Daily Costs" : "Total Monthly Costs";
  const totalValue = activeCostTab === "Daily Costs" ? "৳450" : "৳15,000";

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
            type="button"
          >
            <DownloadIcon />
            Export
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#f5a30f] px-5 py-3 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327]"
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

      <section className="rounded-[5px] border border-[#344059] bg-[#202b3f] px-4 py-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#344059] text-[10px] uppercase tracking-[0.14em] text-[#98a3b8]">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Recipe</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={row.id}>
                  <td className="py-4 font-semibold text-[#f5a30f]">{row.id}</td>
                  <td className="py-4">{row.category}</td>
                  <td className="py-4 font-semibold text-[#f5a30f]">{row.amount}</td>
                  <td className="py-4 text-[#b6c0d2]">{row.date}</td>
                  <td className="py-4 text-[#b6c0d2]">{row.recipe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, placeholder, value, onChange, type = "text" }) {
  return (
    <label className="block space-y-2">
      <span className="text-[12px] font-medium text-[#d7deea]">{label}</span>
      <input
        className="h-11 w-full rounded-[4px] border border-[#344059] bg-[#202b3f] px-3 text-[13px] text-white outline-none placeholder:text-[#6f7d95] focus:border-[#4e6180]"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

function ReceiptUpload({ fileName, onSelect }) {
  return (
    <label className="block space-y-2">
      <span className="text-[12px] font-medium text-[#d7deea]">Receipt (Optional)</span>
      <div className="flex min-h-[92px] cursor-pointer items-center justify-center rounded-[4px] border border-dashed border-[#344059] bg-[#202b3f] px-4 text-center text-[12px] text-[#8e9aad]">
        <input
          className="sr-only"
          onChange={(event) => onSelect(event.target.files?.[0]?.name ?? "")}
          type="file"
        />
        <span>{fileName || "Upload Image or PDF (Max 5MB)"}</span>
      </div>
    </label>
  );
}

function ExportCostsPanel() {
  const [exportCosts, setExportCosts] = useState(initialExportCosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const [formValues, setFormValues] = useState({
    project: "",
    destination: "",
    date: "",
    category: "",
    amount: "",
    description: "",
  });
  const [draftItems, setDraftItems] = useState([]);

  const totalExportCosts = exportCosts.reduce((sum, item) => sum + Number(item.totalCost.replace(/[^\d.-]/g, "")), 0);

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
      date: "",
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
      date: "",
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

  function handleSubmit(event) {
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

    const total = itemsToSave.reduce((sum, item) => sum + item.amount, 0);
    const nextNumber = exportCosts.length + 1;
    const padded = String(nextNumber).padStart(3, "0");

    setExportCosts((current) => [
      ...current,
      {
        id: `EXP-${padded}`,
        project: formValues.project,
        destination: formValues.destination,
        date: formValues.date,
        totalCost: `৳${total.toLocaleString("en-US")}`,
        items: itemsToSave,
      },
    ]);

    closeModal();
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-[18px] font-semibold leading-none text-[#f5f7fb]">Export Costs</h2>
          <p className="text-[11px] text-[#8e9aad]">Track international shipping and export expenses with itemized breakdown</p>
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
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#98a3b8]">Total Export Costs</div>
          <div className="text-[30px] font-semibold text-[#ffb01a]">৳{totalExportCosts.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </section>

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
              {exportCosts.map((item) => (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={item.id}>
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
          <div className="w-full max-w-[450px] overflow-hidden rounded-[6px] border border-[#344059] bg-[#202b3f] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#344059] px-4 py-4">
              <h3 className="text-[20px] font-semibold text-[#e6ebf4]">Add Export Cost Breakdown</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <Field label="Project *" name="project" onChange={handleFormChange} placeholder="" value={formValues.project} />
              <Field
                label="Destination *"
                name="destination"
                onChange={handleFormChange}
                placeholder="e.g., USA, UK, Germany"
                value={formValues.destination}
              />
              <Field label="Date" name="date" onChange={handleFormChange} placeholder="" type="text" value={formValues.date} />

              <div className="border-t border-[#344059] pt-4">
                <div className="mb-3 text-[13px] font-semibold text-[#d7deea]">Cost Items</div>
                <div className="space-y-4">
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
                <button className="rounded-[4px] bg-[#f5a30f] px-4 py-2 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327]" type="submit">
                  Save Entry
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
  const [monthlyBills, setMonthlyBills] = useState(initialMonthlyBills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    vendor: "",
    category: "",
    expenseFor: "",
    amount: "",
    dueDate: "",
    receipt: "",
  });

  function handleExport() {
    const header = ["Bill ID", "Vendor", "Category", "Expense For", "Amount", "Due Date", "Status"];
    const rows = monthlyBills.map((item) => [
      item.id,
      item.vendor,
      item.category,
      item.expenseFor,
      item.amount,
      item.dueDate,
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
      vendor: "",
      category: "",
      expenseFor: "",
      amount: "",
      dueDate: "",
      receipt: "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextNumber = monthlyBills.length + 1;
    const padded = String(nextNumber).padStart(3, "0");

    setMonthlyBills((current) => [
      ...current,
      {
        id: `BILL-${padded}`,
        vendor: formValues.vendor,
        category: formValues.category,
        expenseFor: formValues.expenseFor,
        amount: `৳${Number(formValues.amount || 0).toLocaleString("en-US")}`,
        dueDate: formValues.dueDate,
        status: "Pending",
        receipt: formValues.receipt || null,
      },
    ]);

    closeModal();
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

      <section className="rounded-[5px] border border-[#344059] bg-[#202b3f] px-4 py-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#344059] text-[10px] uppercase tracking-[0.14em] text-[#98a3b8]">
                <th className="pb-3 font-medium">Bill ID</th>
                <th className="pb-3 font-medium">Vendor</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Expense For</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Due Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {monthlyBills.map((item) => (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={item.id}>
                  <td className="py-4 font-semibold text-[#f5a30f]">{item.id}</td>
                  <td className="py-4">{item.vendor}</td>
                  <td className="py-4">{item.category}</td>
                  <td className="py-4">
                    <span
                      className={[
                        "inline-flex rounded-[4px] px-2 py-1 text-[10px] font-medium",
                        item.expenseFor === "Factory" ? "bg-[#204a84] text-[#a9d0ff]" : "bg-[#4c5568] text-[#d7deea]",
                      ].join(" ")}
                    >
                      {item.expenseFor}
                    </span>
                  </td>
                  <td className="py-4 font-semibold text-[#f5a30f]">{item.amount}</td>
                  <td className="py-4 text-[#b6c0d2]">{item.dueDate}</td>
                  <td className="py-4">
                    <span
                      className={[
                        "inline-flex rounded-[4px] px-2 py-1 text-[10px] font-medium",
                        item.status === "Paid" ? "bg-[#5e4c20] text-[#f7c25f]" : "bg-[#6b4b28] text-[#ffcf75]",
                      ].join(" ")}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      className="rounded-[4px] bg-[#f5a30f] px-3 py-2 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327]"
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
          <div className="w-full max-w-[450px] overflow-hidden rounded-[6px] border border-[#344059] bg-[#202b3f] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#344059] px-4 py-4">
              <h3 className="text-[20px] font-semibold text-[#e6ebf4]">Add Monthly Bill</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <Field label="Vendor *" name="vendor" onChange={handleFormChange} placeholder="" value={formValues.vendor} />
              <Field
                label="Category"
                name="category"
                onChange={handleFormChange}
                placeholder="e.g., Utilities, Services"
                value={formValues.category}
              />
              <Field label="Expense For *" name="expenseFor" onChange={handleFormChange} placeholder="" value={formValues.expenseFor} />
              <Field label="Amount (৳) *" name="amount" onChange={handleFormChange} placeholder="" type="number" value={formValues.amount} />
              <Field label="Due Date *" name="dueDate" onChange={handleFormChange} placeholder="" value={formValues.dueDate} />
              <ReceiptUpload fileName={formValues.receipt} onSelect={(fileName) => setFormValues((current) => ({ ...current, receipt: fileName }))} />

              <div className="flex items-center justify-end gap-3 border-t border-[#344059] pt-4">
                <button className="px-4 py-2 text-[12px] text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                  Cancel
                </button>
                <button className="rounded-[4px] bg-[#f5a30f] px-4 py-2 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327]" type="submit">
                  Add Bill
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
  const [officeCosts, setOfficeCosts] = useState(initialOfficeCosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    category: "",
    description: "",
    amount: "",
    date: "",
    receipt: "",
  });

  const totalOfficeCosts = officeCosts.reduce((sum, item) => sum + Number(item.amount.replace(/[^\d.-]/g, "")), 0);

  function handleExport() {
    const header = ["Expense ID", "Category", "Description", "Amount", "Date", "Receipt"];
    const rows = officeCosts.map((item) => [item.id, item.category, item.description, item.amount, item.date, item.receipt]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "office-costs.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openModal() {
    setFormValues({
      category: "",
      description: "",
      amount: "",
      date: "",
      receipt: "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextNumber = officeCosts.length + 1;
    const padded = String(nextNumber).padStart(3, "0");

    setOfficeCosts((current) => [
      ...current,
      {
        id: `OFC-${padded}`,
        category: formValues.category,
        description: formValues.description,
        amount: `৳${Number(formValues.amount || 0).toLocaleString("en-US")}`,
        date: formValues.date,
        receipt: formValues.receipt || "-",
      },
    ]);

    closeModal();
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-[18px] font-semibold leading-none text-[#f5f7fb]">Office Cost</h2>
          <p className="text-[11px] text-[#8e9aad]">Track general business expenses</p>
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
            Add Expense
          </button>
        </div>
      </section>

      <section className="rounded-[5px] border border-[#80561a] bg-[#2f2a28] px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#98a3b8]">Total Expenses (Current Month)</div>
          <div className="text-[30px] font-semibold text-[#ffb01a]">৳{totalOfficeCosts.toLocaleString("en-US")}</div>
        </div>
      </section>

      <section className="rounded-[5px] border border-[#344059] bg-[#202b3f] px-4 py-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#344059] text-[10px] uppercase tracking-[0.14em] text-[#98a3b8]">
                <th className="pb-3 font-medium">Expense ID</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {officeCosts.map((item) => (
                <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={item.id}>
                  <td className="py-4 font-semibold text-[#f5a30f]">{item.id}</td>
                  <td className="py-4">{item.category}</td>
                  <td className="py-4">{item.description}</td>
                  <td className="py-4 font-semibold text-[#f5a30f]">{item.amount}</td>
                  <td className="py-4 text-[#b6c0d2]">{item.date}</td>
                  <td className="py-4 text-[#b6c0d2]">{item.receipt}</td>
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
              <h3 className="text-[20px] font-semibold text-[#e6ebf4]">Add Expense</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <Field label="Category *" name="category" onChange={handleFormChange} placeholder="" value={formValues.category} />
              <Field label="Description *" name="description" onChange={handleFormChange} placeholder="" value={formValues.description} />
              <Field label="Amount (৳) *" name="amount" onChange={handleFormChange} placeholder="" type="number" value={formValues.amount} />
              <Field label="Date" name="date" onChange={handleFormChange} placeholder="" value={formValues.date} />
              <ReceiptUpload fileName={formValues.receipt} onSelect={(fileName) => setFormValues((current) => ({ ...current, receipt: fileName }))} />

              <div className="flex items-center justify-end gap-3 border-t border-[#344059] pt-4">
                <button className="px-4 py-2 text-[12px] text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                  Cancel
                </button>
                <button className="rounded-[4px] bg-[#f5a30f] px-4 py-2 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327]" type="submit">
                  Add Expense
                </button>
              </div>
            </form>
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
          {activeTab === "Exports Costs" ? <ExportCostsPanel /> : null}
          {activeTab === "Monthly Bills" ? <MonthlyBillsPanel /> : null}
          {activeTab === "Office Costs" ? <OfficeCostsPanel /> : null}
        </div>
      </div>
    </section>
  );
}
