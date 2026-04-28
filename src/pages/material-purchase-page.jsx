import { useEffect, useState } from "react";

import { createRawMaterialPurchase, getRawMaterialPurchases, getUploadUrl } from "@/shared/lib/raw-material-purchase-api";
import { getRawMaterialStocks } from "@/shared/lib/raw-material-stock-api";
import { getRawMaterialSuppliers } from "@/shared/lib/raw-material-supplier-api";
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

function MinusIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M5 12h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
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

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
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

function StarIcon({ filled = false }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24">
      <path
        d="M12 3.6l2.57 5.2 5.74.83-4.15 4.05.98 5.72L12 16.7l-5.14 2.7.98-5.72-4.15-4.05 5.74-.83L12 3.6z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

const supplierRatingOptions = [1, 2, 3, 4, 5];

export function MaterialPurchasePage() {
  const [purchases, setPurchases] = useState([]);
  const [purchasesLoading, setPurchasesLoading] = useState(true);
  const [stockMaterials, setStockMaterials] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [suppliersLoading, setSuppliersLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddPurchaseModalOpen, setIsAddPurchaseModalOpen] = useState(false);
  const [isMaterialSuggestionsOpen, setIsMaterialSuggestionsOpen] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [receiptZoom, setReceiptZoom] = useState(1);
  const [formValues, setFormValues] = useState({
    material: "",
    supplier: "",
    quantity: "",
    unitCost: "",
    supplierRating: "",
    date: "",
    receiptName: "",
    receiptFile: null,
    category: "",
    minimumStock: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadPurchases() {
      try {
        const records = await getRawMaterialPurchases();

        if (isMounted) {
          setPurchases(records);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setPurchasesLoading(false);
        }
      }
    }

    async function loadStockMaterials() {
      try {
        const materials = await getRawMaterialStocks();

        if (isMounted) {
          setStockMaterials(materials);
        }
      } catch {
        if (isMounted) {
          setStockMaterials([]);
        }
      }
    }

    async function loadSuppliers() {
      try {
        const suppliers = await getRawMaterialSuppliers();

        if (isMounted) {
          setSupplierOptions(suppliers);
        }
      } catch {
        if (isMounted) {
          setSupplierOptions([]);
        }
      } finally {
        if (isMounted) {
          setSuppliersLoading(false);
        }
      }
    }

    loadPurchases();
    loadStockMaterials();
    loadSuppliers();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedSupplier = supplierOptions.find((supplier) => String(supplier.recordId) === formValues.supplier);
  const materialSuggestions = stockMaterials
    .filter((item) => item.material.toLowerCase().includes(formValues.material.trim().toLowerCase()))
    .filter((item, index, array) => array.findIndex((entry) => entry.material.toLowerCase() === item.material.toLowerCase()) === index)
    .slice(0, 6);
  const matchingStockMaterial = stockMaterials.find(
    (item) => item.material.trim().toLowerCase() === formValues.material.trim().toLowerCase(),
  );
  const isNewMaterial = formValues.material.trim() && !matchingStockMaterial;
  const receiptPreviewUrl = receiptPreview?.receiptLocation ? getUploadUrl(receiptPreview.receiptLocation) : "";
  const isReceiptPreviewPdf = /\.pdf($|\?)/i.test(receiptPreviewUrl);
  const receiptZoomStyle = {
    transform: `scale(${receiptZoom})`,
    transformOrigin: "top center",
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const query = search.toLowerCase();
    const matchesSearch =
      purchase.id.toLowerCase().includes(query) ||
      purchase.material.toLowerCase().includes(query) ||
      purchase.supplier.toLowerCase().includes(query);

    const matchesDateFrom = !dateFrom || purchase.dateValue >= dateFrom;
    const matchesDateTo = !dateTo || purchase.dateValue <= dateTo;

    return matchesSearch && matchesDateFrom && matchesDateTo;
  });
  const paginatedPurchases = getPaginatedRows(filteredPurchases, currentPage, pageSize);

  function handleExport() {
    const header = ["Purchase ID", "Material", "Supplier", "Rating", "Quantity", "Unit Cost", "Total", "Date"];
    const rows = filteredPurchases.map((purchase) => [
      purchase.id,
      purchase.material,
      purchase.supplier,
      purchase.supplierRating,
      purchase.quantity,
      purchase.unitCost,
      purchase.total,
      purchase.date,
    ]);
    downloadCsvFile("material-purchase.csv", header, rows);
  }

  function handleDownloadPdf() {
    openTablePdfWindow({
      title: "Material Purchase",
      columns: ["Purchase ID", "Material", "Supplier", "Rating", "Quantity", "Unit Cost", "Total", "Date"],
      rows: filteredPurchases.map((purchase) => [
        purchase.id,
        purchase.material,
        purchase.supplier,
        purchase.supplierRating,
        purchase.quantity,
        purchase.unitCost,
        purchase.total,
        purchase.date,
      ]),
    });
  }

  function openAddPurchaseModal() {
    setErrorMessage("");
    setIsMaterialSuggestionsOpen(false);
    setIsAddPurchaseModalOpen(true);
  }

  function closeAddPurchaseModal() {
    setIsAddPurchaseModalOpen(false);
    setIsMaterialSuggestionsOpen(false);
    setFormValues({
      material: "",
      supplier: "",
      quantity: "",
      unitCost: "",
      supplierRating: "",
      date: "",
      receiptName: "",
      receiptFile: null,
      category: "",
      minimumStock: "",
    });
  }

  function openReceiptPreview(purchase) {
    setReceiptZoom(1);
    setReceiptPreview(purchase);
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

  function handleFormChange(event) {
    const { name, value, files, type } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]:
        type === "file"
          ? files?.[0]?.name ?? ""
          : value,
      ...(type === "file" ? { receiptFile: files?.[0] ?? null } : {}),
    }));

    if (name === "material" && type !== "file") {
      setIsMaterialSuggestionsOpen(true);
    }
  }

  function handleMaterialSelect(materialName) {
    setFormValues((current) => ({
      ...current,
      material: materialName,
    }));
    setIsMaterialSuggestionsOpen(false);
  }

  async function handleAddPurchase(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = new FormData();
      payload.append("material", formValues.material);
      payload.append("supplierId", formValues.supplier);
      payload.append("quantity", formValues.quantity);
      payload.append("unitCost", formValues.unitCost);
      payload.append("supplierRating", formValues.supplierRating);
      payload.append("date", formValues.date);
      payload.append("receipt", formValues.receiptFile);
      payload.append("isNewMaterial", String(Boolean(isNewMaterial)));
      if (isNewMaterial) {
        payload.append("category", formValues.category);
        payload.append("minimumStock", formValues.minimumStock);
      }

      const newPurchase = await createRawMaterialPurchase(payload);
      setPurchases((current) => [newPurchase, ...current]);
      if (isNewMaterial) {
        const materials = await getRawMaterialStocks();
        setStockMaterials(materials);
      } else if (matchingStockMaterial) {
        const materials = await getRawMaterialStocks();
        setStockMaterials(materials);
      }
      closeAddPurchaseModal();
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
            className="inline-flex h-11 items-center gap-2 rounded-md border border-[#334156] px-5 text-[14px] font-medium text-white transition hover:bg-[#334156]/40"
            onClick={handleDownloadPdf}
            type="button"
          >
            <DownloadIcon />
            Download PDF
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

      {errorMessage ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[14px] text-[#f7c8cf]">{errorMessage}</div> : null}

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

          <label className="flex h-11 items-center justify-between rounded-md border border-[#334156] bg-[#243045] px-4 text-[12px] text-[#d6ddea]">
            <input
              className="w-full bg-transparent text-[12px] text-[#d6ddea] outline-none"
              onChange={(event) => setDateFrom(event.target.value)}
              type="date"
              value={dateFrom}
            />
          </label>

          <div className="flex items-center justify-center text-[12px] text-[#9aa6bb]">to</div>

          <label className="flex h-11 items-center justify-between rounded-md border border-[#334156] bg-[#243045] px-4 text-[12px] text-[#d6ddea]">
            <input
              className="w-full bg-transparent text-[12px] text-[#d6ddea] outline-none"
              onChange={(event) => setDateTo(event.target.value)}
              type="date"
              value={dateTo}
            />
          </label>
        </div>

        <div className="mt-4 overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[11%] pb-3 font-medium">Purchase ID</th>
                <th className="w-[15%] pb-3 font-medium">Material</th>
                <th className="w-[16%] pb-3 font-medium">Supplier</th>
                <th className="w-[10%] pb-3 font-medium">Rating</th>
                <th className="w-[10%] pb-3 font-medium">Quantity</th>
                <th className="w-[11%] pb-3 font-medium">Unit Cost</th>
                <th className="w-[11%] pb-3 font-medium">Total</th>
                <th className="w-[8%] pb-3 font-medium">Date</th>
                <th className="w-[8%] pb-3 text-center font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {purchasesLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={9}>
                    Loading material purchases...
                  </td>
                </tr>
              ) : filteredPurchases.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={9}>
                    No material purchases found.
                  </td>
                </tr>
              ) : (
                paginatedPurchases.rows.map((purchase) => (
                  <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={purchase.recordId}>
                    <td className="truncate py-4 pr-3 font-semibold text-[#f7a614]">{purchase.id}</td>
                    <td className="truncate py-4 pr-3">{purchase.material}</td>
                    <td className="truncate py-4 pr-3">{purchase.supplier}</td>
                    <td className="py-4">
                      {purchase.supplierRating ? (
                        <div className="flex items-center gap-0.5 text-[#f7a614]" aria-label={`${purchase.supplierRating} out of 5`}>
                          {supplierRatingOptions.map((rating) => (
                            <StarIcon filled={rating <= purchase.supplierRating} key={rating} />
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="truncate py-4 pr-3">{purchase.quantity}</td>
                    <td className="truncate py-4 pr-3">{purchase.unitCost}</td>
                    <td className="truncate py-4 pr-3 font-semibold text-[#f7a614]">{purchase.total}</td>
                    <td className="truncate py-4 pr-3 text-[#98a5bb]">{purchase.date}</td>
                    <td className="py-4 text-center">
                      <button
                        className="inline-flex h-8 min-w-[52px] items-center justify-center rounded-md text-[13px] font-medium text-[#f7a614] transition hover:bg-[#f6a313]/10 hover:text-[#ffc550] disabled:opacity-50"
                        disabled={!purchase.receiptLocation}
                        onClick={() => openReceiptPreview(purchase)}
                        type="button"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!purchasesLoading && filteredPurchases.length > 0 ? (
          <TablePagination
            currentPage={paginatedPurchases.currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            pageSize={paginatedPurchases.pageSize}
            totalItems={paginatedPurchases.totalItems}
            totalPages={paginatedPurchases.totalPages}
          />
        ) : null}
      </article>

      {isAddPurchaseModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[760px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">Add Material Purchase</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeAddPurchaseModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleAddPurchase}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
                <label className="block space-y-2 md:col-span-4">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Material *</span>
                  <div className="relative">
                    <input
                      className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                      onBlur={() => {
                        window.setTimeout(() => setIsMaterialSuggestionsOpen(false), 120);
                      }}
                      name="material"
                      onChange={handleFormChange}
                      onFocus={() => setIsMaterialSuggestionsOpen(true)}
                      required
                      type="text"
                      value={formValues.material}
                    />
                    {isMaterialSuggestionsOpen && formValues.material.trim() && materialSuggestions.length > 0 ? (
                      <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded-md border border-[#334156] bg-[#243045] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                        {materialSuggestions.map((item) => (
                          <button
                            className="flex w-full items-center justify-between border-b border-[#334156] px-4 py-3 text-left text-[13px] text-[#d6ddea] transition hover:bg-[#2c3a52] last:border-b-0"
                            key={item.recordId}
                            onMouseDown={() => handleMaterialSelect(item.material)}
                            type="button"
                          >
                            <span>{item.material}</span>
                            <span className="text-[11px] text-[#8ea0bb]">{item.category}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </label>

                <label className="block space-y-2 md:col-span-4">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Supplier *</span>
                  <div className="relative">
                    <select
                      className="h-11 w-full appearance-none rounded-md border border-[#334156] bg-[#243045] px-4 pr-11 text-[14px] text-[#e6ebf4] outline-none"
                      disabled={suppliersLoading}
                      name="supplier"
                      onChange={handleFormChange}
                      required
                      value={formValues.supplier}
                    >
                      <option disabled value="">
                        {suppliersLoading ? "Loading suppliers..." : "Select supplier"}
                      </option>
                      {supplierOptions.map((supplier) => (
                        <option key={supplier.recordId} value={supplier.recordId}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#97a5bc]">
                      <ChevronDownIcon />
                    </span>
                  </div>
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
                  <span className="text-[14px] font-medium text-[#d6ddea]">Unit Cost (৳) *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="unitCost"
                    onChange={handleFormChange}
                    required
                    type="number"
                    value={formValues.unitCost}
                  />
                </label>

                <div className="block space-y-2 md:col-span-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Supplier Rating *</span>
                  <div
                    aria-label="Supplier rating"
                    className="flex h-11 items-center gap-1 rounded-md border border-[#334156] bg-[#243045] px-3"
                    role="radiogroup"
                  >
                    {supplierRatingOptions.map((rating) => {
                      const isFilled = rating <= Number(formValues.supplierRating || 0);

                      return (
                        <label
                          className={`cursor-pointer rounded p-0.5 transition ${
                            isFilled ? "text-[#f7a614]" : "text-[#6f7f96] hover:text-[#f7a614]"
                          }`}
                          key={rating}
                          title={`${rating} out of 5`}
                        >
                          <input
                            checked={formValues.supplierRating === String(rating)}
                            className="sr-only"
                            name="supplierRating"
                            onChange={handleFormChange}
                            required
                            type="radio"
                            value={rating}
                          />
                          <StarIcon filled={isFilled} />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <label className="block space-y-2 md:col-span-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Date *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="date"
                    onChange={handleFormChange}
                    required
                    type="date"
                    value={formValues.date}
                  />
                </label>

                {isNewMaterial ? (
                  <label className="block space-y-2 md:col-span-4">
                    <span className="text-[14px] font-medium text-[#d6ddea]">Category *</span>
                    <input
                      className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                      name="category"
                      onChange={handleFormChange}
                      required
                      type="text"
                      value={formValues.category}
                    />
                  </label>
                ) : null}

                {isNewMaterial ? (
                  <label className="block space-y-2 md:col-span-4">
                    <span className="text-[14px] font-medium text-[#d6ddea]">Minimum Stock *</span>
                    <input
                      className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                      name="minimumStock"
                      onChange={handleFormChange}
                      required
                      type="number"
                      value={formValues.minimumStock}
                    />
                  </label>
                ) : null}
              </div>

              <div className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Receipt</span>
                <label className="flex h-[66px] w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#3a475c] bg-[#243045] px-4 text-[14px] text-[#8997ac] transition hover:border-[#4b5a72]">
                  <UploadIcon />
                  <span className="truncate">{formValues.receiptName || "Upload Image or PDF (Max 5MB)"}</span>
                  <input accept="image/*,.pdf" className="sr-only" name="receiptName" onChange={handleFormChange} required type="file" />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeAddPurchaseModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  disabled={isSubmitting || !selectedSupplier}
                  type="submit"
                >
                  Add Purchase
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
                <h3 className="text-[20px] font-semibold text-[#e6ebf4]">Purchase Receipt</h3>
                <p className="mt-1 text-[13px] text-[#8f9cb0]">
                  {receiptPreview.id} · {receiptPreview.material}
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
                    title="Purchase receipt"
                  />
                </div>
              ) : (
                <div className="flex justify-center">
                  <img
                    alt="Purchase receipt"
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
    </section>
  );
}
