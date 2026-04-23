import { useState } from "react";

const initialPurchases = [
  {
    id: "PUR-001",
    material: "Steel Rods",
    supplier: "Metal Suppliers Inc",
    quantity: "500",
    unitCost: "$12",
    total: "$6,000",
    date: "2026-04-15",
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

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M10 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
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

export function MaterialPurchasePage() {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("23-04-2024");
  const [dateTo, setDateTo] = useState("23-04-2024");
  const [isAddPurchaseModalOpen, setIsAddPurchaseModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    material: "",
    supplier: "",
    quantity: "",
    unitCost: "",
    date: "",
    receiptName: "",
  });

  const filteredPurchases = purchases.filter((purchase) => {
    const query = search.toLowerCase();
    return (
      purchase.id.toLowerCase().includes(query) ||
      purchase.material.toLowerCase().includes(query) ||
      purchase.supplier.toLowerCase().includes(query)
    );
  });

  function handleExport() {
    const header = ["Purchase ID", "Material", "Supplier", "Quantity", "Unit Cost", "Total", "Date"];
    const rows = purchases.map((purchase) => [
      purchase.id,
      purchase.material,
      purchase.supplier,
      purchase.quantity,
      purchase.unitCost,
      purchase.total,
      purchase.date,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "material-purchase.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openAddPurchaseModal() {
    setIsAddPurchaseModalOpen(true);
  }

  function closeAddPurchaseModal() {
    setIsAddPurchaseModalOpen(false);
    setFormValues({
      material: "",
      supplier: "",
      quantity: "",
      unitCost: "",
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

  function handleAddPurchase(event) {
    event.preventDefault();
    const nextNumber = purchases.length + 1;
    const padded = String(nextNumber).padStart(3, "0");
    const quantity = Number(formValues.quantity || 0);
    const unitCost = Number(formValues.unitCost || 0);
    const total = quantity * unitCost;

    setPurchases((current) => [
      ...current,
      {
        id: `PUR-${padded}`,
        material: formValues.material,
        supplier: formValues.supplier,
        quantity: String(quantity),
        unitCost: `$${unitCost}`,
        total: `$${total.toLocaleString("en-US")}`,
        date: formValues.date,
      },
    ]);

    closeAddPurchaseModal();
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Material Purchase</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Record material purchases and update inventory</p>
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
            onClick={openAddPurchaseModal}
            type="button"
          >
            <PlusIcon />
            Add Purchase
          </button>
        </div>
      </div>

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_140px_40px_140px]">
          <label className="flex h-11 items-center gap-3 rounded-md border border-[#334156] bg-[#243045] px-4 text-[#77879d]">
            <SearchIcon />
            <input
              className="w-full bg-transparent text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search project..."
              type="text"
              value={search}
            />
          </label>

          <button
            className="flex h-11 items-center justify-between rounded-md border border-[#334156] bg-[#243045] px-4 text-[12px] text-[#d6ddea]"
            onClick={() => setDateFrom("23-04-2024")}
            type="button"
          >
            <span>{dateFrom}</span>
            <ChevronRightIcon />
          </button>

          <div className="flex items-center justify-center text-[12px] text-[#9aa6bb]">to</div>

          <button
            className="flex h-11 items-center justify-between rounded-md border border-[#334156] bg-[#243045] px-4 text-[12px] text-[#d6ddea]"
            onClick={() => setDateTo("23-04-2024")}
            type="button"
          >
            <span>{dateTo}</span>
            <ChevronRightIcon />
          </button>
        </div>

        <div className="mt-4 overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[120px] pb-3 font-medium">Purchase ID</th>
                <th className="w-[17%] pb-3 font-medium">Material</th>
                <th className="w-[24%] pb-3 font-medium">Supplier</th>
                <th className="w-[120px] pb-3 font-medium">Quantity</th>
                <th className="w-[120px] pb-3 font-medium">Unit Cost</th>
                <th className="w-[120px] pb-3 font-medium">Total</th>
                <th className="w-[120px] pb-3 font-medium">Date</th>
                <th className="w-[90px] pb-3 text-right font-medium">Reset</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={purchase.id}>
                  <td className="py-4 font-semibold text-[#f7a614]">{purchase.id}</td>
                  <td className="py-4 pr-3">{purchase.material}</td>
                  <td className="py-4 pr-3">{purchase.supplier}</td>
                  <td className="py-4">{purchase.quantity}</td>
                  <td className="py-4">{purchase.unitCost}</td>
                  <td className="py-4 font-semibold text-[#f7a614]">{purchase.total}</td>
                  <td className="py-4 text-[#98a5bb]">{purchase.date}</td>
                  <td className="py-4 text-right">
                    <button className="text-[13px] font-medium text-[#f7a614] transition hover:text-[#ffc550]" type="button">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {isAddPurchaseModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1422]/70 px-4 py-8">
          <div className="w-full max-w-[760px] overflow-hidden rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">Add Material Purchase</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeAddPurchaseModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleAddPurchase}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                <label className="block space-y-2 md:col-span-3">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Material *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="material"
                    onChange={handleFormChange}
                    required
                    type="text"
                    value={formValues.material}
                  />
                </label>

                <label className="block space-y-2 md:col-span-3">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Supplier *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="supplier"
                    onChange={handleFormChange}
                    required
                    type="text"
                    value={formValues.supplier}
                  />
                </label>

                <label className="block space-y-2 md:col-span-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Quantity *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="quantity"
                    onChange={handleFormChange}
                    required
                    type="number"
                    value={formValues.quantity}
                  />
                </label>

                <label className="block space-y-2 md:col-span-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Unit Cost ($) *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="unitCost"
                    onChange={handleFormChange}
                    required
                    type="number"
                    value={formValues.unitCost}
                  />
                </label>

                <label className="block space-y-2 md:col-span-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Date *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="date"
                    onChange={handleFormChange}
                    placeholder="DD/MM/YY"
                    required
                    type="text"
                    value={formValues.date}
                  />
                </label>
              </div>

              <div className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Receipt</span>
                <label className="flex h-[66px] w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#3a475c] bg-[#243045] px-4 text-[14px] text-[#8997ac] transition hover:border-[#4b5a72]">
                  <UploadIcon />
                  <span className="truncate">{formValues.receiptName || "Upload Image or PDF (Max 5MB)"}</span>
                  <input accept="image/*,.pdf" className="sr-only" name="receiptName" onChange={handleFormChange} type="file" />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeAddPurchaseModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  type="submit"
                >
                  Add Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
