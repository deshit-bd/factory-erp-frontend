import { useState } from "react";

const initialDailyCosts = [
  {
    id: "FC-001",
    category: "Electricity",
    amount: "$450",
    date: "2026-04-17",
    receipt: "-",
  },
];

const initialMonthlyCosts = [
  {
    id: "FC-002",
    category: "Rent",
    amount: "$15,000",
    date: "2026-04-01",
    receipt: "-",
  },
];

function DownloadIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 3v11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M8 10l4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M4 19h16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 16V5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M8 9l4-4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M5 19h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function FactoryCostsPage() {
  const [activeTab, setActiveTab] = useState("daily");
  const [dailyCosts, setDailyCosts] = useState(initialDailyCosts);
  const [monthlyCosts, setMonthlyCosts] = useState(initialMonthlyCosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    category: "",
    amount: "",
    date: "",
    receiptName: "",
  });

  const costs = activeTab === "daily" ? dailyCosts : monthlyCosts;
  const totalAmount = costs.reduce((sum, item) => sum + Number(item.amount.replace(/[$,]/g, "")), 0);

  function handleExport() {
    const header = ["ID", "Category", "Amount", "Date", "Receipt"];
    const rows = costs.map((item) => [item.id, item.category, item.amount, item.date, item.receipt]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeTab}-factory-costs.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function openModal() {
    setFormValues({
      category: "",
      amount: "",
      date: "",
      receiptName: "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setFormValues({
      category: "",
      amount: "",
      date: "",
      receiptName: "",
    });
  }

  function handleFormChange(event) {
    const { name, value, files, type } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: type === "file" ? files?.[0]?.name ?? "" : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextSource = activeTab === "daily" ? dailyCosts : monthlyCosts;
    const nextNumber = nextSource.length + 1;
    const padded = String(nextNumber).padStart(3, "0");
    const nextItem = {
      id: `FC-${padded}`,
      category: formValues.category,
      amount: `$${Number(formValues.amount || 0).toLocaleString("en-US")}`,
      date: formValues.date,
      receipt: formValues.receiptName || "-",
    };

    if (activeTab === "daily") {
      setDailyCosts((current) => [...current, nextItem]);
    } else {
      setMonthlyCosts((current) => [...current, nextItem]);
    }

    closeModal();
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Factory Costs</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Track daily and monthly factory expenses</p>
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
          <button
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
            onClick={openModal}
            type="button"
          >
            <PlusIcon />
            Add Cost
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className={[
            "inline-flex h-9 items-center rounded-sm px-4 text-[13px] font-medium transition",
            activeTab === "daily" ? "bg-[#f6a313] text-[#111827]" : "bg-[#3d4960] text-[#e6ebf4] hover:bg-[#4b5972]",
          ].join(" ")}
          onClick={() => setActiveTab("daily")}
          type="button"
        >
          Daily Costs
        </button>
        <button
          className={[
            "inline-flex h-9 items-center rounded-sm px-4 text-[13px] font-medium transition",
            activeTab === "monthly" ? "bg-[#f6a313] text-[#111827]" : "bg-[#3d4960] text-[#e6ebf4] hover:bg-[#4b5972]",
          ].join(" ")}
          onClick={() => setActiveTab("monthly")}
          type="button"
        >
          Monthly Costs
        </button>
      </div>

      <article className="rounded-md border border-[#6a4d1a] bg-[#2f2b2a] px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#8f9cb0]">
            {activeTab === "daily" ? "Total Daily Costs" : "Total Monthly Costs"}
          </div>
          <div className="text-[36px] font-semibold leading-none text-[#f7a614]">${totalAmount.toLocaleString("en-US")}</div>
        </div>
      </article>

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[18%] pb-3 font-medium">ID</th>
                <th className="w-[28%] pb-3 font-medium">Category</th>
                <th className="w-[22%] pb-3 font-medium">Amount</th>
                <th className="w-[22%] pb-3 font-medium">Date</th>
                <th className="w-[10%] pb-3 font-medium">Recipe</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((item) => (
                <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={item.id}>
                  <td className="py-4 font-semibold text-[#f7a614]">{item.id}</td>
                  <td className="py-4">{item.category}</td>
                  <td className="py-4 font-semibold text-[#f7a614]">{item.amount}</td>
                  <td className="py-4 text-[#98a5bb]">{item.date}</td>
                  <td className="py-4 text-[#8f9cb0]">{item.receipt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1422]/70 px-4 py-8">
          <div className="w-full max-w-[460px] overflow-hidden rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">
                {activeTab === "daily" ? "Add Daily Cost" : "Add Monthly Cost"}
              </h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Category *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                  name="category"
                  onChange={handleFormChange}
                  placeholder="e.g., Electricity, Labor, Rent"
                  required
                  type="text"
                  value={formValues.category}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Amount ($) *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="amount"
                  onChange={handleFormChange}
                  required
                  type="number"
                  value={formValues.amount}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Date *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="date"
                  onChange={handleFormChange}
                  required
                  type="text"
                  value={formValues.date}
                />
              </label>

              <div className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Receipt (Optional)</span>
                <label className="flex h-[60px] w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#3a475c] bg-[#243045] px-4 text-[14px] text-[#8997ac] transition hover:border-[#4b5a72]">
                  <UploadIcon />
                  <span className="truncate">{formValues.receiptName || "Upload Image or PDF (Max 5MB)"}</span>
                  <input accept="image/*,.pdf" className="sr-only" name="receiptName" onChange={handleFormChange} type="file" />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  type="submit"
                >
                  Add Cost
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
