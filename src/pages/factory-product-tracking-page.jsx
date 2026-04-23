import { useState } from "react";

const initialEntries = [
  {
    id: "FP-001",
    date: "2026-04-15",
    projectId: "PRJ-001",
    productName: "Industrial Valves",
    quantityProduced: "100",
    qualityStatus: "Pass",
    remarks: "Good quality",
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

function EditIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 20h4l10-10-4-4L4 16v4zM13 7l4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
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

export function FactoryProductTrackingPage() {
  const [entries, setEntries] = useState(initialEntries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({
    project: "",
    productName: "",
    quantityProduced: "",
    qualityStatus: "",
    remarks: "",
    date: "",
  });

  function handleExport() {
    const header = ["ID", "Date", "Project ID", "Product Name", "Quantity Produced", "Quality Status", "Remarks"];
    const rows = entries.map((entry) => [
      entry.id,
      entry.date,
      entry.projectId,
      entry.productName,
      entry.quantityProduced,
      entry.qualityStatus,
      entry.remarks,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "factory-product-tracking.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openAddModal() {
    setEditingId(null);
    setFormValues({
      project: "",
      productName: "",
      quantityProduced: "",
      qualityStatus: "",
      remarks: "",
      date: "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(entry) {
    setEditingId(entry.id);
    setFormValues({
      project: entry.projectId,
      productName: entry.productName,
      quantityProduced: entry.quantityProduced,
      qualityStatus: entry.qualityStatus,
      remarks: entry.remarks,
      date: entry.date,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setFormValues({
      project: "",
      productName: "",
      quantityProduced: "",
      qualityStatus: "",
      remarks: "",
      date: "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId) {
      setEntries((current) =>
        current.map((entry) =>
          entry.id === editingId
            ? {
                ...entry,
                projectId: formValues.project,
                productName: formValues.productName,
                quantityProduced: formValues.quantityProduced,
                qualityStatus: formValues.qualityStatus,
                remarks: formValues.remarks,
                date: formValues.date,
              }
            : entry,
        ),
      );
    } else {
      const nextNumber = entries.length + 1;
      const padded = String(nextNumber).padStart(3, "0");

      setEntries((current) => [
        ...current,
        {
          id: `FP-${padded}`,
          date: formValues.date,
          projectId: formValues.project,
          productName: formValues.productName,
          quantityProduced: formValues.quantityProduced,
          qualityStatus: formValues.qualityStatus,
          remarks: formValues.remarks,
        },
      ]);
    }

    closeModal();
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Factory Product Tracking</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Track factory-level production output with quality control</p>
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
            onClick={openAddModal}
            type="button"
          >
            <PlusIcon />
            Add Entry
          </button>
        </div>
      </div>

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[7%] pb-3 font-medium">ID</th>
                <th className="w-[11%] pb-3 font-medium">Date</th>
                <th className="w-[11%] pb-3 font-medium">Project ID</th>
                <th className="w-[16%] pb-3 font-medium">Product Name</th>
                <th className="w-[20%] pb-3 font-medium">Quantity Produced</th>
                <th className="w-[15%] pb-3 font-medium">Quality Status</th>
                <th className="w-[18%] pb-3 font-medium">Remarks</th>
                <th className="w-[8%] pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={entry.id}>
                  <td className="py-4 font-semibold text-[#f7a614]">{entry.id}</td>
                  <td className="py-4 text-[#98a5bb]">{entry.date}</td>
                  <td className="py-4">{entry.projectId}</td>
                  <td className="py-4 pr-3">{entry.productName}</td>
                  <td className="py-4">{entry.quantityProduced}</td>
                  <td className="py-4">
                    <span className="inline-flex rounded-sm bg-[#57411f] px-2 py-1 text-[11px] font-medium text-[#f5b14e]">
                      {entry.qualityStatus}
                    </span>
                  </td>
                  <td className="py-4 pr-3 text-[#aeb8c9]">{entry.remarks}</td>
                  <td className="py-4">
                    <div className="flex justify-end">
                      <button className="text-[#d7deea] transition hover:text-white" onClick={() => openEditModal(entry)} type="button">
                        <EditIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[760px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">
                {editingId ? "Edit Factory Product Entry" : "Add Factory Product Entry"}
              </h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  <span className="text-[14px] font-medium text-[#d6ddea]">Product Name *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="productName"
                    onChange={handleFormChange}
                    placeholder="Enter product name"
                    required
                    type="text"
                    value={formValues.productName}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Quantity Produced *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="quantityProduced"
                    onChange={handleFormChange}
                    placeholder="Enter quantity"
                    required
                    type="number"
                    value={formValues.quantityProduced}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Quality Status *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                    name="qualityStatus"
                    onChange={handleFormChange}
                    required
                    type="text"
                    value={formValues.qualityStatus}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Remarks</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="remarks"
                    onChange={handleFormChange}
                    placeholder="Optional remarks"
                    type="text"
                    value={formValues.remarks}
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
              </div>

              <div className="rounded-md border border-[#314058] bg-[#2a3548] px-3 py-2.5 text-[12px] text-[#9aa6bb]">
                A Only <span className="font-medium text-[#f7a614]">Quality Passed</span> items will be eligible for Finished Goods
              </div>

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  type="submit"
                >
                  {editingId ? "Save Entry" : "Add Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
