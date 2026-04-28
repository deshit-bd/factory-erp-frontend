import { useEffect, useState } from "react";

import { createRawMaterialStock, getRawMaterialStocks } from "@/shared/lib/raw-material-stock-api";
import { downloadCsvFile, getPaginatedRows, openTablePdfWindow } from "@/shared/lib/table-export";
import { TablePagination } from "@/shared/ui/table-pagination";

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
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    material: "",
    category: "",
    currentStock: "",
    minimumStock: "",
    unitCost: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadMaterials() {
      try {
        const records = await getRawMaterialStocks();

        if (isMounted) {
          setMaterials(records);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setMaterialsLoading(false);
        }
      }
    }

    loadMaterials();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMaterials = materials.filter((material) => {
    const query = search.toLowerCase();
    const matchesSearch =
      material.id.toLowerCase().includes(query) ||
      material.material.toLowerCase().includes(query) ||
      material.category.toLowerCase().includes(query) ||
      material.status.toLowerCase().includes(query);

    const matchesDateFrom = !dateFrom || material.createdAt >= `${dateFrom} 00:00:00`;
    const matchesDateTo = !dateTo || material.createdAt <= `${dateTo} 23:59:59`;

    return matchesSearch && matchesDateFrom && matchesDateTo;
  });
  const paginatedMaterials = getPaginatedRows(filteredMaterials, currentPage, pageSize);

  const totalItems = materials.length;
  const lowStockCount = materials.filter((material) => material.status === "Low Stock").length;
  const stockValue = materials.reduce((total, material) => {
    const numericValue = Number(material.totalValue.replace(/[^\d.-]/g, ""));
    return total + numericValue;
  }, 0);

  function handleExport() {
    const header = ["ID", "Material", "Category", "Current Stock", "Min Stock", "Unit Cost", "Total Value", "Status"];
    const rows = materials.map((material) => [
      material.id,
      material.material,
      material.category,
      material.currentStock,
      material.minimumStock,
      material.unitCost,
      material.totalValue,
      material.status,
    ]);
    downloadCsvFile("raw-material-stock.csv", header, rows);
  }

  function handleDownloadPdf() {
    openTablePdfWindow({
      title: "Raw Material Stock",
      columns: ["ID", "Material", "Category", "Current Stock", "Min Stock", "Unit Cost", "Total Value", "Status"],
      rows: filteredMaterials.map((material) => [
        material.id,
        material.material,
        material.category,
        material.currentStock,
        material.minimumStock,
        material.unitCost,
        material.totalValue,
        material.status,
      ]),
    });
  }

  function openAddMaterialModal() {
    setErrorMessage("");
    setIsAddMaterialModalOpen(true);
  }

  function closeAddMaterialModal() {
    setIsAddMaterialModalOpen(false);
    setFormValues({
      material: "",
      category: "",
      currentStock: "",
      minimumStock: "",
      unitCost: "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function handleAddMaterial(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const newMaterial = await createRawMaterialStock({
        material: formValues.material,
        category: formValues.category,
        currentStock: formValues.currentStock,
        minimumStock: formValues.minimumStock,
        unitCost: formValues.unitCost,
      });

      setMaterials((current) => [...current, newMaterial]);
      closeAddMaterialModal();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
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
            className="inline-flex h-11 items-center gap-2 rounded-md border border-[#334156] px-5 text-[14px] font-medium text-white transition hover:bg-[#334156]/40"
            onClick={handleDownloadPdf}
            type="button"
          >
            <DownloadIcon />
            Download PDF
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

      {errorMessage ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[14px] text-[#f7c8cf]">{errorMessage}</div> : null}

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <article className="rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[rgba(37,99,235,0.12)] text-[#2563eb]">
              <StockCardIcon type="items" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--app-text-soft)]">Total Items</div>
              <div className="mt-1 text-[34px] font-semibold leading-none text-[var(--app-text)]">{totalItems}</div>
            </div>
          </div>
        </article>

        <article className="rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[rgba(239,68,68,0.12)] text-[#ef4444]">
              <StockCardIcon type="low-stock" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--app-text-soft)]">Low Stock</div>
              <div className="mt-1 text-[34px] font-semibold leading-none text-[#ef4444]">{lowStockCount}</div>
            </div>
          </div>
        </article>

        <article className="rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[rgba(37,99,235,0.12)] text-[#2563eb]">
              <StockCardIcon type="value" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--app-text-soft)]">Stock Value</div>
              <div className="mt-1 text-[34px] font-semibold leading-none text-[#2563eb]">
                ৳{stockValue.toLocaleString("en-US")}
              </div>
            </div>
          </div>
        </article>
      </section>

      <article className="rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_140px_40px_140px]">
          <label className="flex h-11 items-center gap-3 rounded-md border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 text-[var(--app-text-soft)]">
            <SearchIcon />
            <input
              className="w-full bg-transparent text-[14px] text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-soft)]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Material..."
              type="text"
              value={search}
            />
          </label>

          <label className="flex h-11 items-center justify-between rounded-md border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 text-[12px] text-[var(--app-text)]">
            <input
              className="w-full bg-transparent text-[12px] text-[var(--app-text)] outline-none"
              onChange={(event) => setDateFrom(event.target.value)}
              type="date"
              value={dateFrom}
            />
          </label>

          <div className="flex items-center justify-center text-[12px] text-[var(--app-text-muted)]">to</div>

          <label className="flex h-11 items-center justify-between rounded-md border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 text-[12px] text-[var(--app-text)]">
            <input
              className="w-full bg-transparent text-[12px] text-[var(--app-text)] outline-none"
              onChange={(event) => setDateTo(event.target.value)}
              type="date"
              value={dateTo}
            />
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--app-border)] text-[10px] uppercase tracking-[0.16em] text-[var(--app-text-soft)]">
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
              {materialsLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[var(--app-text-soft)]" colSpan={8}>
                    Loading raw material stock...
                  </td>
                </tr>
              ) : paginatedMaterials.rows.map((material) => (
                  <tr
                  className={[
                    "border-b border-[var(--app-border)] text-[13px] text-[var(--app-text)]",
                    material.status === "Low Stock" ? "bg-[rgba(239,68,68,0.08)]" : "",
                  ].join(" ")}
                  key={material.id}
                >
                  <td className="py-4 font-semibold text-[#2563eb]">{material.id}</td>
                  <td className="py-4 pr-3">{material.material}</td>
                  <td className="py-4 pr-3">{material.category}</td>
                  <td className="py-4">{material.currentStock}</td>
                  <td className="py-4">{material.minimumStock}</td>
                  <td className="py-4">{material.unitCost}</td>
                  <td className="py-4 font-semibold text-[#2563eb]">{material.totalValue}</td>
                  <td className="py-4">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium",
                        material.status === "Low Stock"
                          ? "bg-[rgba(239,68,68,0.12)] text-[#dc2626]"
                          : "bg-[rgba(16,185,129,0.12)] text-[#10b981]",
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

        {!materialsLoading && filteredMaterials.length > 0 ? (
          <TablePagination
            currentPage={paginatedMaterials.currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            pageSize={paginatedMaterials.pageSize}
            totalItems={paginatedMaterials.totalItems}
            totalPages={paginatedMaterials.totalPages}
          />
        ) : null}
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
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Unit Cost (৳)</span>
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
                  disabled={isSubmitting}
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
