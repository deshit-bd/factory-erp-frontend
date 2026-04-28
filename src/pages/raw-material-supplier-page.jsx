import { useEffect, useState } from "react";

import {
  createRawMaterialSupplier,
  deleteRawMaterialSupplier,
  getRawMaterialSuppliers,
  updateRawMaterialSupplier,
} from "@/shared/lib/raw-material-supplier-api";
import { getRawMaterialPurchases } from "@/shared/lib/raw-material-purchase-api";
import { getRawMaterialSupplierPayments } from "@/shared/lib/raw-material-supplier-payment-api";
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

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 7h14M9 7V5h6v2M8 7l1 12h6l1-12"
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

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
      <path d="M10 1.5l2.5 5.07 5.6.82-4.05 3.95.96 5.58L10 14.25 5 16.92l.96-5.58L1.9 7.39l5.6-.82z" />
    </svg>
  );
}

function formatSupplierDate(value) {
  if (!value) {
    return "";
  }

  return String(value).split("T")[0];
}

function isWithinDateRange(value, dateFrom, dateTo) {
  const normalizedValue = formatSupplierDate(value);

  if (!normalizedValue) {
    return false;
  }

  if (dateFrom && normalizedValue < dateFrom) {
    return false;
  }

  if (dateTo && normalizedValue > dateTo) {
    return false;
  }

  return true;
}

export function RawMaterialSupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersLoading, setSuppliersLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [previewSupplier, setPreviewSupplier] = useState(null);
  const [previewActiveTab, setPreviewActiveTab] = useState("due");
  const [previewSupplierDueRows, setPreviewSupplierDueRows] = useState([]);
  const [previewSupplierDueLoading, setPreviewSupplierDueLoading] = useState(false);
  const [previewSupplierPaymentRows, setPreviewSupplierPaymentRows] = useState([]);
  const [previewSupplierPaymentLoading, setPreviewSupplierPaymentLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    category: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadSuppliers() {
      try {
        const records = await getRawMaterialSuppliers();

        if (isMounted) {
          setSuppliers(records);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setSuppliersLoading(false);
        }
      }
    }

    loadSuppliers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const query = search.toLowerCase();
    const matchesSearch =
      supplier.id.toLowerCase().includes(query) ||
      supplier.name.toLowerCase().includes(query) ||
      supplier.category.toLowerCase().includes(query) ||
      supplier.email.toLowerCase().includes(query) ||
      supplier.phone.toLowerCase().includes(query);

    return matchesSearch && isWithinDateRange(supplier.createdAt, dateFrom, dateTo);
  });
  const paginatedSuppliers = getPaginatedRows(filteredSuppliers, currentPage, pageSize);

  function handleExport() {
    downloadCsvFile(
      "raw-material-suppliers.csv",
      ["ID", "Name", "Category", "Email", "Phone", "Rating"],
      filteredSuppliers.map((supplier) => [supplier.id, supplier.name, supplier.category, supplier.email, supplier.phone, supplier.rating]),
    );
  }

  function handleDownloadPdf() {
    openTablePdfWindow({
      title: "Raw Material Supplier",
      columns: ["ID", "Name", "Category", "Email", "Phone", "Rating"],
      rows: filteredSuppliers.map((supplier) => [supplier.id, supplier.name, supplier.category, supplier.email, supplier.phone, supplier.rating]),
    });
  }

  function openAddSupplierModal() {
    setErrorMessage("");
    setEditingId(null);
    setFormValues({
      name: "",
      category: "",
      email: "",
      phone: "",
    });
    setIsAddSupplierModalOpen(true);
  }

  function openEditSupplierModal(supplier) {
    setErrorMessage("");
    setEditingId(supplier.recordId);
    setFormValues({
      name: supplier.name,
      category: supplier.category,
      email: supplier.email,
      phone: supplier.phone,
    });
    setIsAddSupplierModalOpen(true);
  }

  function closeAddSupplierModal() {
    setEditingId(null);
    setIsAddSupplierModalOpen(false);
    setFormValues({
      name: "",
      category: "",
      email: "",
      phone: "",
    });
  }

  async function openViewSupplierModal(supplier) {
    setPreviewSupplier(supplier);
    setPreviewActiveTab("due");
    setPreviewSupplierDueLoading(true);
    setPreviewSupplierDueRows([]);
    setPreviewSupplierPaymentLoading(true);
    setPreviewSupplierPaymentRows([]);

    try {
      const [purchases, payments] = await Promise.all([getRawMaterialPurchases(), getRawMaterialSupplierPayments()]);
      const supplierPurchases = purchases.filter(
        (purchase) => purchase.supplierId === supplier.id || purchase.supplierRecordId === supplier.recordId || purchase.supplier === supplier.name,
      );

      const groupedRows = Array.from(
        supplierPurchases.reduce((map, purchase) => {
          const current = map.get(purchase.material) || {
            material: purchase.material,
            quantity: 0,
            totalDue: 0,
          };

          current.quantity += Number(purchase.quantity || 0);
          current.totalDue += Number(String(purchase.total || "0").replace(/[^\d.-]/g, ""));
          map.set(purchase.material, current);
          return map;
        }, new Map()).values(),
      );

      setPreviewSupplierDueRows(groupedRows);

      const supplierPayments = payments.filter(
        (payment) => payment.supplierId === supplier.id || payment.supplierRecordId === supplier.recordId || payment.supplier === supplier.name,
      );
      setPreviewSupplierPaymentRows(supplierPayments);
    } catch {
      setPreviewSupplierDueRows([]);
      setPreviewSupplierPaymentRows([]);
    } finally {
      setPreviewSupplierDueLoading(false);
      setPreviewSupplierPaymentLoading(false);
    }
  }

  function closeViewSupplierModal() {
    setPreviewSupplier(null);
    setPreviewActiveTab("due");
    setPreviewSupplierDueRows([]);
    setPreviewSupplierDueLoading(false);
    setPreviewSupplierPaymentRows([]);
    setPreviewSupplierPaymentLoading(false);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (editingId) {
        const updatedSupplier = await updateRawMaterialSupplier(editingId, formValues);
        setSuppliers((current) => current.map((supplier) => (supplier.recordId === editingId ? updatedSupplier : supplier)));
      } else {
        const newSupplier = await createRawMaterialSupplier(formValues);
        setSuppliers((current) => [...current, newSupplier]);
      }

      closeAddSupplierModal();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteSupplier(recordId) {
    try {
      setErrorMessage("");
      await deleteRawMaterialSupplier(recordId);
      setSuppliers((current) => current.filter((supplier) => supplier.recordId !== recordId));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Raw Material Supplier</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Manage raw material supplier relationships</p>
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
            onClick={openAddSupplierModal}
            type="button"
          >
            <PlusIcon />
            Add Supplier
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
              placeholder="Search Raw Material Suppliers..."
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
            <colgroup>
              <col className="w-[8%]" />
              <col className="w-[20%]" />
              <col className="w-[15%]" />
              <col className="w-[22%]" />
              <col className="w-[16%]" />
              <col className="w-[9%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Rating</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliersLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={7}>
                    Loading raw material suppliers...
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={7}>
                    No raw material suppliers found.
                  </td>
                </tr>
              ) : (
                paginatedSuppliers.rows.map((supplier) => (
                  <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={supplier.recordId}>
                    <td className="truncate py-4 pr-3 font-semibold text-[#f7a614]">{supplier.id}</td>
                    <td className="truncate py-4 pr-3">{supplier.name}</td>
                    <td className="truncate py-4 pr-3">{supplier.category}</td>
                    <td className="truncate py-4 pr-3 text-[#98a5bb]">{supplier.email}</td>
                    <td className="truncate py-4 pr-3">{supplier.phone}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 text-[#f7a614]">
                        <StarIcon />
                        <span className="text-[#d7deea]">{supplier.rating}</span>
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-4">
                        <button className="text-[#93c5fd] transition hover:text-white" onClick={() => openViewSupplierModal(supplier)} type="button">
                          <EyeIcon />
                        </button>
                        <button className="text-[#d7deea] transition hover:text-white" onClick={() => openEditSupplierModal(supplier)} type="button">
                          <EditIcon />
                        </button>
                        <button
                          className="text-[#ef4444] transition hover:text-[#f87171]"
                          onClick={() => handleDeleteSupplier(supplier.recordId)}
                          type="button"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!suppliersLoading ? (
          <TablePagination
            currentPage={paginatedSuppliers.currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            pageSize={paginatedSuppliers.pageSize}
            totalItems={paginatedSuppliers.totalItems}
            totalPages={paginatedSuppliers.totalPages}
          />
        ) : null}
      </article>

      {isAddSupplierModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[520px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">{editingId ? "Edit Supplier" : "Add Supplier"}</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeAddSupplierModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Name *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="name"
                  onChange={handleFormChange}
                  required
                  type="text"
                  value={formValues.name}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Category *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="category"
                  onChange={handleFormChange}
                  required
                  type="text"
                  value={formValues.category}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Email</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="email"
                  onChange={handleFormChange}
                  required
                  type="email"
                  value={formValues.email}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Phone</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="phone"
                  onChange={handleFormChange}
                  required
                  type="text"
                  value={formValues.phone}
                />
              </label>
              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeAddSupplierModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {editingId ? "Save Supplier" : "Add Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {previewSupplier ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-w-[520px] rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">Supplier Details</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeViewSupplierModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2">
              <div className="rounded-md border border-[#314058] bg-[#243045] px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#7f8ea6]">Supplier ID</div>
                <div className="mt-2 text-[15px] font-semibold text-[#f7a614]">{previewSupplier.id}</div>
              </div>
              <div className="rounded-md border border-[#314058] bg-[#243045] px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#7f8ea6]">Rating</div>
                <div className="mt-2 inline-flex items-center gap-1 text-[15px] text-[#f7a614]">
                  <StarIcon />
                  <span className="text-[#e6ebf4]">{previewSupplier.rating}</span>
                </div>
              </div>
              <div className="rounded-md border border-[#314058] bg-[#243045] px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#7f8ea6]">Name</div>
                <div className="mt-2 text-[15px] text-[#e6ebf4]">{previewSupplier.name}</div>
              </div>
              <div className="rounded-md border border-[#314058] bg-[#243045] px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#7f8ea6]">Category</div>
                <div className="mt-2 text-[15px] text-[#e6ebf4]">{previewSupplier.category}</div>
              </div>
              <div className="rounded-md border border-[#314058] bg-[#243045] px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#7f8ea6]">Email</div>
                <div className="mt-2 break-all text-[15px] text-[#98a5bb]">{previewSupplier.email || "N/A"}</div>
              </div>
              <div className="rounded-md border border-[#314058] bg-[#243045] px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#7f8ea6]">Phone</div>
                <div className="mt-2 text-[15px] text-[#e6ebf4]">{previewSupplier.phone || "N/A"}</div>
              </div>
              <div className="rounded-md border border-[#314058] bg-[#243045] px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#7f8ea6]">Previous Due</div>
                <div className="mt-2 text-[15px] text-[#e6ebf4]">৳{Number(previewSupplier.previousDue || 0).toLocaleString("en-US")}</div>
              </div>
              <div className="rounded-md border border-[#314058] bg-[#243045] px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#7f8ea6]">Created Date</div>
                <div className="mt-2 text-[15px] text-[#e6ebf4]">{formatSupplierDate(previewSupplier.createdAt) || "N/A"}</div>
              </div>
            </div>

            <div className="border-t border-[#314058] px-4 py-4">
              <div className="flex flex-wrap items-center gap-2 border-b border-[#314058] pb-3">
                <button
                  className={[
                    "rounded-md px-3 py-2 text-[13px] font-medium transition",
                    previewActiveTab === "due" ? "bg-[#f6a313] text-[#111827]" : "bg-[#243045] text-[#d7deea] hover:text-white",
                  ].join(" ")}
                  onClick={() => setPreviewActiveTab("due")}
                  type="button"
                >
                  Product-wise Due
                </button>
                <button
                  className={[
                    "rounded-md px-3 py-2 text-[13px] font-medium transition",
                    previewActiveTab === "payments" ? "bg-[#f6a313] text-[#111827]" : "bg-[#243045] text-[#d7deea] hover:text-white",
                  ].join(" ")}
                  onClick={() => setPreviewActiveTab("payments")}
                  type="button"
                >
                  Payment History
                </button>
              </div>

              {previewActiveTab === "due" ? (
                <div className="mt-3 overflow-hidden rounded-md border border-[#314058] bg-[#243045]">
                  <table className="w-full table-fixed border-collapse text-left">
                    <colgroup>
                      <col className="w-[52%]" />
                      <col className="w-[18%]" />
                      <col className="w-[30%]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                        <th className="px-4 py-3 font-medium">Product</th>
                        <th className="px-4 py-3 font-medium">Qty</th>
                        <th className="px-4 py-3 font-medium">Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewSupplierDueLoading ? (
                        <tr>
                          <td className="px-4 py-6 text-center text-[13px] text-[#93a0b4]" colSpan={3}>
                            Loading product-wise due...
                          </td>
                        </tr>
                      ) : previewSupplierDueRows.length === 0 ? (
                        <tr>
                          <td className="px-4 py-6 text-center text-[13px] text-[#93a0b4]" colSpan={3}>
                            No product-wise due found.
                          </td>
                        </tr>
                      ) : (
                        previewSupplierDueRows.map((row) => (
                          <tr className="border-b border-[#314058] text-[13px] text-[#d7deea] last:border-b-0" key={row.material}>
                            <td className="truncate px-4 py-3">{row.material}</td>
                            <td className="px-4 py-3">{row.quantity}</td>
                            <td className="px-4 py-3 font-medium text-[#f7a614]">৳{row.totalDue.toLocaleString("en-US")}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-3 overflow-hidden rounded-md border border-[#314058] bg-[#243045]">
                  <table className="w-full table-fixed border-collapse text-left">
                    <colgroup>
                      <col className="w-[24%]" />
                      <col className="w-[20%]" />
                      <col className="w-[20%]" />
                      <col className="w-[18%]" />
                      <col className="w-[18%]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                        <th className="px-4 py-3 font-medium">Payment ID</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Paid</th>
                        <th className="px-4 py-3 font-medium">Remaining</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewSupplierPaymentLoading ? (
                        <tr>
                          <td className="px-4 py-6 text-center text-[13px] text-[#93a0b4]" colSpan={5}>
                            Loading payment history...
                          </td>
                        </tr>
                      ) : previewSupplierPaymentRows.length === 0 ? (
                        <tr>
                          <td className="px-4 py-6 text-center text-[13px] text-[#93a0b4]" colSpan={5}>
                            No payment history found.
                          </td>
                        </tr>
                      ) : (
                        previewSupplierPaymentRows.map((row) => (
                          <tr className="border-b border-[#314058] text-[13px] text-[#d7deea] last:border-b-0" key={row.recordId}>
                            <td className="truncate px-4 py-3 text-[#f7a614]">{row.id}</td>
                            <td className="px-4 py-3">{row.date}</td>
                            <td className="px-4 py-3">{row.totalPaid}</td>
                            <td className="px-4 py-3">{row.remainingDue}</td>
                            <td className="px-4 py-3">{row.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-[#314058] px-4 py-4">
              <button
                className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                onClick={closeViewSupplierModal}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
