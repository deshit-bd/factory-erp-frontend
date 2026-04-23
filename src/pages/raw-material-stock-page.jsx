import { useState } from "react";

const initialMaterials = [
  {
    id: "MAT-001",
    material: "Steel Rods",
    category: "Raw Metal",
    currentStock: "450 kg",
    minStock: "500 kg",
    unitCost: "$12",
    totalValue: "$5,400",
    status: "Low Stock",
  },
  {
    id: "MAT-002",
    material: "Aluminum Sheets",
    category: "Raw Metal",
    currentStock: "800 kg",
    minStock: "300 kg",
    unitCost: "$18",
    totalValue: "$14,400",
    status: "Normal",
  },
  {
    id: "MAT-003",
    material: "Copper Wire",
    category: "Electrical",
    currentStock: "200 meters",
    minStock: "150 meters",
    unitCost: "$25",
    totalValue: "$5,000",
    status: "Normal",
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

function StockCardIcon({ type }) {
  const base = {
    "aria-hidden": "true",
    className: "h-5 w-5",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "1.8",
  };

  switch (type) {
    case "items":
      return (
        <svg {...base}>
          <path d="M12 2l7 4v12l-7 4-7-4V6z" />
          <path d="M12 22V10" />
          <path d="M19 6l-7 4-7-4" />
        </svg>
      );
    case "low-stock":
      return (
        <svg {...base}>
          <path d="M4 7l5 5 4-4 7 7" />
          <path d="M20 9v6h-6" />
        </svg>
      );
    case "value":
      return (
        <svg {...base}>
          <path d="M12 3v18M16 7.5a4 4 0 00-4-2.5 4 4 0 100 8 4 4 0 110 8 4 4 0 01-4-2.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function RawMaterialStockPage() {
  const [materials, setMaterials] = useState(initialMaterials);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("23-04-2024");
  const [dateTo, setDateTo] = useState("23-04-2024");
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    material: "",
    category: "",
    currentStock: "",
    minimumStock: "",
    unit: "",
    unitCost: "",
  });

  const filteredMaterials = materials.filter((material) => {
    const query = search.toLowerCase();
    return (
      material.id.toLowerCase().includes(query) ||
      material.material.toLowerCase().includes(query) ||
      material.category.toLowerCase().includes(query) ||
      material.status.toLowerCase().includes(query)
    );
  });

  const totalItems = materials.length;
  const lowStockCount = materials.filter((material) => material.status === "Low Stock").length;
  const stockValue = materials.reduce((total, material) => total + Number(material.totalValue.replace(/[$,]/g, "")), 0);

  function handleExport() {
    const header = ["ID", "Material", "Category", "Current Stock", "Min Stock", "Unit Cost", "Total Value", "Status"];
    const rows = materials.map((material) => [
      material.id,
      material.material,
      material.category,
      material.currentStock,
      material.minStock,
      material.unitCost,
      material.totalValue,
      material.status,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "raw-material-stock.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openAddMaterialModal() {
    setIsAddMaterialModalOpen(true);
  }

  function closeAddMaterialModal() {
    setIsAddMaterialModalOpen(false);
    setFormValues({
      material: "",
      category: "",
      currentStock: "",
      minimumStock: "",
      unit: "",
      unitCost: "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleAddMaterial(event) {
    event.preventDefault();
    const nextNumber = materials.length + 1;
    const padded = String(nextNumber).padStart(3, "0");
    const currentStockNumber = Number(formValues.currentStock || 0);
    const minimumStockNumber = Number(formValues.minimumStock || 0);
    const unitCostNumber = Number(formValues.unitCost || 0);
    const totalValueNumber = currentStockNumber * unitCostNumber;

    setMaterials((current) => [
      ...current,
      {
        id: `MAT-${padded}`,
        material: formValues.material,
        category: formValues.category,
        currentStock: `${currentStockNumber} ${formValues.unit}`,
        minStock: `${minimumStockNumber} ${formValues.unit}`,
        unitCost: `$${unitCostNumber}`,
        totalValue: `$${totalValueNumber.toLocaleString("en-US")}`,
        status: currentStockNumber < minimumStockNumber ? "Low Stock" : "Normal",
      },
    ]);

    closeAddMaterialModal();
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Raw Material Stock</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Monitor and manage inventory levels</p>
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
            onClick={openAddMaterialModal}
            type="button"
          >
            <PlusIcon />
            Add Material
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4b4129] text-[#f7a614]">
              <StockCardIcon type="items" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Total Items</div>
              <div className="mt-1 text-[34px] font-semibold leading-none text-white">{totalItems}</div>
            </div>
          </div>
        </article>

        <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4d3340] text-[#ef4444]">
              <StockCardIcon type="low-stock" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Low Stock</div>
              <div className="mt-1 text-[34px] font-semibold leading-none text-[#ef4444]">{lowStockCount}</div>
            </div>
          </div>
        </article>

        <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4b4129] text-[#f7a614]">
              <StockCardIcon type="value" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Stock Value</div>
              <div className="mt-1 text-[34px] font-semibold leading-none text-[#f7a614]">
                ${stockValue.toLocaleString("en-US")}
              </div>
            </div>
          </div>
        </article>
      </section>

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_140px_40px_140px]">
          <label className="flex h-11 items-center gap-3 rounded-md border border-[#334156] bg-[#243045] px-4 text-[#77879d]">
            <SearchIcon />
            <input
              className="w-full bg-transparent text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Material..."
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

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[90px] pb-3 font-medium">ID</th>
                <th className="w-[18%] pb-3 font-medium">Material</th>
                <th className="w-[16%] pb-3 font-medium">Category</th>
                <th className="w-[16%] pb-3 font-medium">Current Stock</th>
                <th className="w-[14%] pb-3 font-medium">Min Stock</th>
                <th className="w-[11%] pb-3 font-medium">Unit Cost</th>
                <th className="w-[13%] pb-3 font-medium">Total Value</th>
                <th className="w-[12%] pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((material) => (
                <tr
                  className={[
                    "border-b border-[#2d394d] text-[13px] text-[#d7deea]",
                    material.status === "Low Stock" ? "bg-[#3a313f]/45" : "",
                  ].join(" ")}
                  key={material.id}
                >
                  <td className="py-4 font-semibold text-[#f7a614]">{material.id}</td>
                  <td className="py-4 pr-3">{material.material}</td>
                  <td className="py-4 pr-3">{material.category}</td>
                  <td className="py-4">{material.currentStock}</td>
                  <td className="py-4">{material.minStock}</td>
                  <td className="py-4">{material.unitCost}</td>
                  <td className="py-4 font-semibold text-[#f7a614]">{material.totalValue}</td>
                  <td className="py-4">
                    <span
                      className={[
                        "inline-flex rounded-sm px-2 py-1 text-[11px] font-medium",
                        material.status === "Low Stock" ? "bg-[#5b2f35] text-[#ff6b6b]" : "bg-[#57411f] text-[#f5b14e]",
                      ].join(" ")}
                    >
                      {material.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {isAddMaterialModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[760px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[28px] font-semibold text-[#e6ebf4]">Add Material</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeAddMaterialModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleAddMaterial}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Material Name *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none"
                    name="material"
                    onChange={handleFormChange}
                    required
                    type="text"
                    value={formValues.material}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Category *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none"
                    name="category"
                    onChange={handleFormChange}
                    required
                    type="text"
                    value={formValues.category}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Current Stock</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none"
                    name="currentStock"
                    onChange={handleFormChange}
                    type="number"
                    value={formValues.currentStock}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Minimum Stock</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none"
                    name="minimumStock"
                    onChange={handleFormChange}
                    type="number"
                    value={formValues.minimumStock}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Unit</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
                    name="unit"
                    onChange={handleFormChange}
                    placeholder="kg, meters, liters, etc."
                    type="text"
                    value={formValues.unit}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Unit Cost ($)</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none"
                    name="unitCost"
                    onChange={handleFormChange}
                    type="number"
                    value={formValues.unitCost}
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#314058] pt-4">
                <button
                  className="inline-flex h-10 items-center rounded-md px-4 text-[14px] font-medium text-[#d7deea] transition hover:text-white"
                  onClick={closeAddMaterialModal}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex h-10 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  type="submit"
                >
                  Add Material
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
