import { useState } from "react";

const initialExportCosts = [
  {
    id: "EXP-001",
    project: "PRJ-001",
    destination: "USA",
    date: "2026-04-15",
    totalCost: "$1,850",
    items: [
      { category: "Shipping", amount: 1200, description: "Ocean freight" },
      { category: "Customs", amount: 350, description: "Import clearance" },
      { category: "Insurance", amount: 300, description: "Cargo insurance" },
    ],
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

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function ExportCostsPage() {
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

  const totalExportCosts = exportCosts.reduce((sum, item) => sum + Number(item.totalCost.replace(/[$,]/g, "")), 0);

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
        totalCost: `$${total.toLocaleString("en-US")}`,
        items: itemsToSave,
      },
    ]);

    closeModal();
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Export Costs</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">
            Track international shipping and export expenses with itemized breakdown
          </p>
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
            Add Cost Breakdown
          </button>
        </div>
      </div>

      <article className="rounded-md border border-[#6a4d1a] bg-[#2f2b2a] px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#8f9cb0]">Total Export Costs</div>
          <div className="text-[36px] font-semibold leading-none text-[#f7a614]">${totalExportCosts.toLocaleString("en-US")}</div>
        </div>
      </article>

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[13%] pb-3 font-medium">ID</th>
                <th className="w-[18%] pb-3 font-medium">Project</th>
                <th className="w-[20%] pb-3 font-medium">Destination</th>
                <th className="w-[18%] pb-3 font-medium">Date</th>
                <th className="w-[18%] pb-3 font-medium">Total Cost</th>
                <th className="w-[13%] pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exportCosts.map((item) => (
                <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={item.id}>
                  <td className="py-4 font-semibold text-[#f7a614]">{item.id}</td>
                  <td className="py-4">{item.project}</td>
                  <td className="py-4">{item.destination}</td>
                  <td className="py-4 text-[#98a5bb]">{item.date}</td>
                  <td className="py-4 font-semibold text-[#f7a614]">{item.totalCost}</td>
                  <td className="py-4">
                    <button
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-[#f7a614] transition hover:text-[#ffc550]"
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
      </article>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1422]/70 px-4 py-8">
          <div className="w-full max-w-[460px] overflow-hidden rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">Add Export Cost Breakdown</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Project *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="project"
                  onChange={handleFormChange}
                  required
                  type="text"
                  value={formValues.project}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Destination *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                  name="destination"
                  onChange={handleFormChange}
                  placeholder="e.g., USA, UK, Germany"
                  required
                  type="text"
                  value={formValues.destination}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Date</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="date"
                  onChange={handleFormChange}
                  type="text"
                  value={formValues.date}
                />
              </label>

              <div className="border-t border-[#314058] pt-2">
                <div className="text-[14px] font-medium text-[#d6ddea]">Cost Items</div>
              </div>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Category *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="category"
                  onChange={handleFormChange}
                  required={draftItems.length === 0}
                  type="text"
                  value={formValues.category}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Amount ($) *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                  name="amount"
                  onChange={handleFormChange}
                  placeholder="0.00"
                  required={draftItems.length === 0}
                  type="number"
                  value={formValues.amount}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Description</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                  name="description"
                  onChange={handleFormChange}
                  placeholder="Optional details"
                  type="text"
                  value={formValues.description}
                />
              </label>

              <button
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                onClick={handleAddItem}
                type="button"
              >
                <PlusIcon />
                Add Item
              </button>

              {draftItems.length > 0 ? (
                <div className="rounded-md border border-[#314058] bg-[#243045] px-3 py-3">
                  <div className="space-y-2">
                    {draftItems.map((item, index) => (
                      <div className="flex items-center justify-between text-[13px] text-[#d7deea]" key={`${item.category}-${index}`}>
                        <span>{item.category}</span>
                        <span className="font-semibold text-[#f7a614]">${item.amount.toLocaleString("en-US")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  type="submit"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {selectedBreakdown ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0d1422]/78 px-4 py-8">
          <div className="w-full max-w-[520px] overflow-hidden rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">Export Cost Breakdown</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={() => setSelectedBreakdown(null)} type="button">
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4 px-4 py-4">
              <div className="grid grid-cols-2 gap-4 rounded-md bg-[#2a3548] px-4 py-4 text-[14px] text-[#d7deea]">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#8f9ab0]">Project</div>
                  <div className="mt-1 font-semibold">{selectedBreakdown.project}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#8f9ab0]">Destination</div>
                  <div className="mt-1 font-semibold">{selectedBreakdown.destination}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#8f9ab0]">Date</div>
                  <div className="mt-1">{selectedBreakdown.date}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#8f9ab0]">Total Cost</div>
                  <div className="mt-1 font-semibold text-[#f7a614]">{selectedBreakdown.totalCost}</div>
                </div>
              </div>

              <div className="rounded-md border border-[#314058] px-4 py-4">
                <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9aa6bb]">Cost Items</div>
                <div className="mt-3 space-y-3">
                  {selectedBreakdown.items.map((item, index) => (
                    <div className="rounded-md bg-[#243045] px-3 py-3" key={`${item.category}-${index}`}>
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-[#e6ebf4]">{item.category}</div>
                        <div className="font-semibold text-[#f7a614]">${item.amount.toLocaleString("en-US")}</div>
                      </div>
                      {item.description ? <div className="mt-1 text-[13px] text-[#8f9cb0]">{item.description}</div> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
