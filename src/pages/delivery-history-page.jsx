import { useState } from "react";

const initialHistory = [
  {
    id: "DEL-001",
    project: "PRJ-002",
    buyer: "XYZ Ltd",
    quantity: "300",
    date: "2026-04-13",
  },
  {
    id: "DEL-002",
    project: "PRJ-002",
    buyer: "XYZ Ltd",
    quantity: "300",
    date: "2026-04-13",
  },
];

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

function DownloadIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 3v11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M8 10l4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M4 19h16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function DeliveryHistoryPage() {
  const [search, setSearch] = useState("");
  const [history] = useState(initialHistory);

  const filteredHistory = history.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.id.toLowerCase().includes(query) ||
      item.project.toLowerCase().includes(query) ||
      item.buyer.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query)
    );
  });

  function handleExport() {
    const header = ["Delivery ID", "Project", "Buyer", "Quantity", "Date"];
    const rows = history.map((item) => [item.id, item.project, item.buyer, item.quantity, item.date]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "delivery-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Delivery History</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Manage product deliveries and shipments</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex h-11 items-center gap-2 rounded-md border border-[#f6a313] px-5 text-[14px] font-medium text-white transition hover:bg-[#f6a313]/10"
            onClick={handleExport}
            type="button"
          >
            <DownloadIcon />
            Export
          </button>
        </div>
      </div>

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <label className="flex h-11 items-center gap-3 rounded-md border border-[#334156] bg-[#243045] px-4 text-[#77879d]">
          <SearchIcon />
          <input
            className="w-full bg-transparent text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search..."
            type="text"
            value={search}
          />
        </label>

        <div className="mt-4 overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[14%] pb-3 font-medium">Delivery ID</th>
                <th className="w-[20%] pb-3 font-medium">Project</th>
                <th className="w-[22%] pb-3 font-medium">Buyer</th>
                <th className="w-[18%] pb-3 font-medium">Quantity</th>
                <th className="w-[26%] pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={item.id}>
                  <td className="py-4 font-semibold text-[#f7a614]">{item.id}</td>
                  <td className="py-4 font-semibold text-[#d7deea]">{item.project}</td>
                  <td className="py-4 pr-3">{item.buyer}</td>
                  <td className="py-4">{item.quantity}</td>
                  <td className="py-4 text-[#98a5bb]">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
