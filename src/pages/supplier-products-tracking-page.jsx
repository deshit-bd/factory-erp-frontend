import { useEffect, useState } from "react";

import { getProjectGoodsSuppliers } from "@/shared/lib/project-goods-supplier-api";
import { getProjects } from "@/shared/lib/project-api";
import { getSupplierAssignments } from "@/shared/lib/supplier-assignment-api";
import {
  createSupplierProductsTracking,
  getSupplierProductsTracking,
  getUploadUrl,
  updateSupplierProductsTracking,
} from "@/shared/lib/supplier-products-tracking-api";

function DownloadIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 3v11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M8 10l4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M4 19h16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const dateText = String(dateString);
  const dateOnlyMatch = dateText.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return `${day}/${month}/${year}`;
  }

  const date = new Date(dateText);

  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatDateInputValue(dateString) {
  if (!dateString) {
    return "";
  }

  const dateText = String(dateString);
  const dateOnlyMatch = dateText.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (dateOnlyMatch) {
    return dateOnlyMatch[0];
  }

  const date = new Date(dateText);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

function UploadIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 16V5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M8 9l4-4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M5 19h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
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

const emptyFormValues = {
  supplier: "",
  project: "",
  productName: "",
  quantitySupplied: "",
  qualityStatus: "",
  notes: "",
  date: "",
  receiptName: "",
  receiptFile: null,
};

export function SupplierProductsTrackingPage() {
  const [entries, setEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierAssignments, setSupplierAssignments] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [receiptZoom, setReceiptZoom] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState(emptyFormValues);

  useEffect(() => {
    let isMounted = true;

    async function loadPageData() {
      try {
        const [entryRecords, projectRecords, supplierRecords, assignmentRecords] = await Promise.all([
          getSupplierProductsTracking(),
          getProjects(),
          getProjectGoodsSuppliers(),
          getSupplierAssignments(),
        ]);

        if (isMounted) {
          setEntries(entryRecords);
          setProjects(projectRecords);
          setSuppliers(supplierRecords);
          setSupplierAssignments(assignmentRecords);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setPageLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedSupplier = suppliers.find((supplier) => String(supplier.recordId) === formValues.supplier);
  const availableProjects = selectedSupplier
    ? projects.filter((project) =>
        supplierAssignments.some(
          (assignment) => assignment.supplier === selectedSupplier.name && assignment.projectId === project.recordId,
        ),
      )
    : [];
  const receiptPreviewUrl = receiptPreview?.receiptLocation ? getUploadUrl(receiptPreview.receiptLocation) : "";
  const isReceiptPreviewPdf = /\.pdf($|\?)/i.test(receiptPreviewUrl);
  const receiptZoomStyle = {
    transform: `scale(${receiptZoom})`,
    transformOrigin: "top center",
  };

  function handleExport() {
    const header = ["ID", "Date", "Supplier", "Project ID", "Product", "Quantity Supplied", "Quality Status", "Notes"];
    const rows = entries.map((entry) => [
      entry.id,
      formatDate(entry.date),
      entry.supplier,
      entry.projectId,
      entry.product,
      entry.quantitySupplied,
      entry.qualityStatus,
      entry.notes,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "supplier-products-tracking.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openAddModal() {
    setErrorMessage("");
    setEditingId(null);
    setEditingRecordId(null);
    setFormValues(emptyFormValues);
    setIsModalOpen(true);
  }

  function openEditModal(entry) {
    const selectedProject = projects.find((project) => project.recordId === entry.projectRecordId);
    const selectedSupplier = suppliers.find((supplier) => supplier.recordId === entry.supplierId);

    setErrorMessage("");
    setEditingId(entry.id);
    setEditingRecordId(entry.recordId);
    setFormValues({
      supplier: selectedSupplier ? String(selectedSupplier.recordId) : "",
      project: selectedProject ? String(selectedProject.recordId) : "",
      productName: entry.product,
      quantitySupplied: entry.quantitySupplied,
      qualityStatus: entry.qualityStatus.toLowerCase(),
      notes: entry.notes,
      date: formatDateInputValue(entry.date),
      receiptName: entry.receiptLocation ? "Current receipt uploaded" : "",
      receiptFile: null,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setEditingRecordId(null);
    setFormValues(emptyFormValues);
  }

  function openReceiptPreview(entry) {
    setReceiptZoom(1);
    setReceiptPreview(entry);
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

    if (name === "supplier") {
      setFormValues((current) => ({
        ...current,
        supplier: value,
        project: "",
        productName: "",
      }));
      return;
    }

    if (name === "project") {
      const selectedProject = projects.find((project) => String(project.recordId) === value);
      setFormValues((current) => ({
        ...current,
        project: value,
        productName: selectedProject?.name || "",
      }));
      return;
    }

    setFormValues((current) => ({
      ...current,
      [name]: type === "file" ? files?.[0]?.name ?? "" : value,
      ...(type === "file" ? { receiptFile: files?.[0] ?? null } : {}),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const selectedProject = projects.find((project) => String(project.recordId) === formValues.project);
    const payload = new FormData();
    payload.append("supplierId", formValues.supplier);
    payload.append("projectId", formValues.project);
    payload.append("productId", String(selectedProject?.recordId || 0));
    payload.append("quantitySupplied", formValues.quantitySupplied);
    payload.append("qualityStatus", formValues.qualityStatus);
    payload.append("notes", formValues.notes || "");
    payload.append("date", formValues.date);

    if (formValues.receiptFile) {
      payload.append("receipt", formValues.receiptFile);
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const action = editingRecordId
      ? updateSupplierProductsTracking(editingRecordId, payload)
      : createSupplierProductsTracking(payload);

    action
      .then((savedEntry) => {
        setEntries((current) =>
          editingRecordId
            ? current.map((entry) => (entry.recordId === editingRecordId ? savedEntry : entry))
            : [savedEntry, ...current],
        );
        closeModal();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Supplier Products Tracking</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Track supplier-provided products with quality control</p>
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

      {errorMessage ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[14px] text-[#f7c8cf]">{errorMessage}</div> : null}

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[7%] pb-3 font-medium">ID</th>
                <th className="w-[11%] pb-3 font-medium">Date</th>
                <th className="w-[16%] pb-3 font-medium">Supplier</th>
                <th className="w-[10%] pb-3 font-medium">Project ID</th>
                <th className="w-[17%] pb-3 font-medium">Product</th>
                <th className="w-[15%] pb-3 font-medium">Quantity Supplied</th>
                <th className="w-[10%] pb-3 font-medium">Quality Status</th>
                <th className="w-[8%] pb-3 font-medium">Receipt</th>
                <th className="w-[6%] pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={9}>
                    Loading supplier product entries...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={9}>
                    No supplier product entries found.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={entry.id}>
                    <td className="py-4 font-semibold text-[#f7a614]">{entry.id}</td>
                    <td className="py-4 text-[#98a5bb]">{formatDate(entry.date)}</td>
                    <td className="py-4 pr-3">{entry.supplier}</td>
                    <td className="py-4">{entry.projectId}</td>
                    <td className="py-4 pr-3">{entry.product}</td>
                    <td className="py-4">{entry.quantitySupplied}</td>
                    <td className="py-4">
                      <span className="inline-flex rounded-sm bg-[#57411f] px-2 py-1 text-[11px] font-medium text-[#f5b14e]">
                        {entry.qualityStatus}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        className="text-[13px] font-medium text-[#f7a614] transition hover:text-[#ffc550] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!entry.receiptLocation}
                        onClick={() => openReceiptPreview(entry)}
                        type="button"
                      >
                        View
                      </button>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end">
                        <button className="text-[#d7deea] transition hover:text-white" onClick={() => openEditModal(entry)} type="button">
                          <EditIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[760px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">
                {editingId ? "Edit Supplier Product Entry" : "Add Supplier Product Entry"}
              </h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Supplier *</span>
                  <select
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                    name="supplier"
                    onChange={handleFormChange}
                    required
                    value={formValues.supplier}
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.recordId} value={supplier.recordId}>
                        {supplier.id} - {supplier.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Project *</span>
                  <select
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                    name="project"
                    onChange={handleFormChange}
                    disabled={!formValues.supplier}
                    required
                    value={formValues.project}
                  >
                    <option value="">{formValues.supplier ? "Select project" : "Select supplier first"}</option>
                    {availableProjects.map((project) => (
                      <option key={project.recordId} value={project.recordId}>
                        {project.id} - {project.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Product Name *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#1e293b] px-4 text-[14px] text-[#e6ebf4] outline-none"
                    name="productName"
                    readOnly
                    required
                    type="text"
                    value={formValues.productName}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Quantity Supplied *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="quantitySupplied"
                    onChange={handleFormChange}
                    placeholder="Enter quantity"
                    required
                    type="number"
                    value={formValues.quantitySupplied}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Quality Status *</span>
                  <select
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                    name="qualityStatus"
                    onChange={handleFormChange}
                    required
                    value={formValues.qualityStatus}
                  >
                    <option value="">Select quality status</option>
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Date *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                    name="date"
                    onChange={handleFormChange}
                    required
                    type="date"
                    value={formValues.date}
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Notes</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                  name="notes"
                  onChange={handleFormChange}
                  placeholder="Optional notes"
                  type="text"
                  value={formValues.notes}
                />
              </label>

              <div className="space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Receipt</span>
                <label className="flex h-11 cursor-pointer items-center gap-3 rounded-md border border-dashed border-[#3a4a62] bg-[#243045] px-4 text-[14px] text-[#9aa6bb] transition hover:border-[#f6a313] hover:text-[#e6ebf4]">
                  <UploadIcon />
                  <span className="truncate">{formValues.receiptName || "Upload Image or PDF (Max 5MB)"}</span>
                  <input accept="image/*,.pdf" className="sr-only" name="receiptName" onChange={handleFormChange} type="file" />
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
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting || pageLoading}
                  type="submit"
                >
                  {editingId ? "Save Entry" : "Add Entry"}
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
                <h3 className="text-[20px] font-semibold text-[#e6ebf4]">Supplier Product Receipt</h3>
                <p className="mt-1 text-[13px] text-[#8f9cb0]">
                  {receiptPreview.id} · {receiptPreview.product}
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
                    title="Supplier product receipt"
                  />
                </div>
              ) : (
                <div className="flex justify-center">
                  <img
                    alt="Supplier product receipt"
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
