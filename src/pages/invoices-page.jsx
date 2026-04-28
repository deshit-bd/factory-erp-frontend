import { useEffect, useState } from "react";

import { getCompanyInfo } from "@/shared/lib/accounts-api";
import { createInvoice, getInvoiceFormOptions, getInvoices } from "@/shared/lib/invoice-api";
import { downloadCsvFile, getPaginatedRows, openTablePdfWindow } from "@/shared/lib/table-export";
import { TablePagination } from "@/shared/ui/table-pagination";

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

function QrMock() {
  return (
    <svg aria-hidden="true" className="h-[86px] w-[86px]" viewBox="0 0 110 110">
      <rect width="110" height="110" fill="#fff" />
      <rect x="8" y="8" width="28" height="28" fill="#000" />
      <rect x="14" y="14" width="16" height="16" fill="#fff" />
      <rect x="74" y="8" width="28" height="28" fill="#000" />
      <rect x="80" y="14" width="16" height="16" fill="#fff" />
      <rect x="8" y="74" width="28" height="28" fill="#000" />
      <rect x="14" y="80" width="16" height="16" fill="#fff" />
      <rect x="46" y="12" width="8" height="8" fill="#000" />
      <rect x="56" y="12" width="8" height="8" fill="#000" />
      <rect x="46" y="22" width="8" height="8" fill="#000" />
      <rect x="56" y="32" width="8" height="8" fill="#000" />
      <rect x="42" y="46" width="8" height="8" fill="#000" />
      <rect x="52" y="46" width="8" height="8" fill="#000" />
      <rect x="62" y="46" width="8" height="8" fill="#000" />
      <rect x="72" y="46" width="8" height="8" fill="#000" />
      <rect x="82" y="46" width="8" height="8" fill="#000" />
      <rect x="42" y="56" width="8" height="8" fill="#000" />
      <rect x="62" y="56" width="8" height="8" fill="#000" />
      <rect x="82" y="56" width="8" height="8" fill="#000" />
      <rect x="42" y="66" width="8" height="8" fill="#000" />
      <rect x="52" y="66" width="8" height="8" fill="#000" />
      <rect x="72" y="66" width="8" height="8" fill="#000" />
      <rect x="82" y="66" width="8" height="8" fill="#000" />
      <rect x="46" y="82" width="8" height="8" fill="#000" />
      <rect x="56" y="82" width="8" height="8" fill="#000" />
      <rect x="66" y="82" width="8" height="8" fill="#000" />
      <rect x="76" y="82" width="8" height="8" fill="#000" />
      <rect x="86" y="82" width="8" height="8" fill="#000" />
    </svg>
  );
}

const emptyFormValues = {
  buyerId: "",
  projectId: "",
  paidAmount: "",
  date: "",
};

const defaultCompanyInfo = {
  companyName: "Factory ERP",
  email: "",
  phone: "",
  address: "",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createInvoicePrintMarkup(invoice, companyInfo) {
  const companyName = companyInfo?.companyName || defaultCompanyInfo.companyName;
  const companyAddress = companyInfo?.address || "";
  const companyPhone = companyInfo?.phone || "";
  const companyEmail = companyInfo?.email || "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(invoice.id)}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 24px;
        font-family: Arial, Helvetica, sans-serif;
        background: #f3f4f6;
        color: #4b5563;
      }
      .sheet {
        max-width: 800px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #cbd5e1;
      }
      .header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding: 24px;
        background: #111827;
        color: #ffffff;
      }
      .brand {
        color: #f7a614;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .muted {
        margin-top: 8px;
        font-size: 12px;
        color: #cbd5e1;
        line-height: 1.5;
      }
      .invoice-badge {
        text-align: right;
      }
      .invoice-title {
        color: #f7a614;
        font-size: 24px;
        font-weight: 700;
        text-transform: uppercase;
      }
      .qr {
        margin-top: 12px;
        width: 96px;
        height: 96px;
        border: 8px solid #fff;
        background:
          linear-gradient(90deg, #000 0 20%, transparent 20% 30%, #000 30% 40%, transparent 40% 60%, #000 60% 70%, transparent 70% 80%, #000 80% 100%),
          linear-gradient(#000 0 20%, transparent 20% 30%, #000 30% 40%, transparent 40% 60%, #000 60% 70%, transparent 70% 80%, #000 80% 100%);
      }
      .meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 32px;
        padding: 24px;
        border-bottom: 1px solid #d6dbe5;
      }
      .label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #64748b;
      }
      .buyer {
        margin-top: 12px;
        color: #2563eb;
        font-weight: 700;
      }
      .details {
        margin-top: 12px;
        font-size: 14px;
        line-height: 1.7;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      thead tr {
        background: #eef2f7;
        color: #64748b;
        font-size: 11px;
        text-transform: uppercase;
      }
      th, td {
        padding: 12px 14px;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
      }
      th:last-child, td:last-child {
        text-align: right;
      }
      .summary {
        display: flex;
        justify-content: flex-end;
        padding: 24px;
      }
      .summary-card {
        width: 260px;
        font-size: 14px;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .summary-total {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #334155;
        font-weight: 700;
      }
      .accent { color: #f7a614; }
      .success { color: #22c55e; font-weight: 700; }
      .danger { color: #ef4444; font-weight: 700; }
      .footer {
        border-top: 1px solid #d6dbe5;
        padding: 20px 24px;
        text-align: center;
        font-size: 11px;
        color: #6b7280;
      }
      @media print {
        body {
          padding: 0;
          background: #ffffff;
        }
        .sheet {
          border: 0;
        }
      }
    </style>
  </head>
  <body>
    <div class="sheet">
      <div class="header">
        <div>
          <div class="brand">${escapeHtml(companyName)}</div>
          <div class="muted">${companyAddress ? `${escapeHtml(companyAddress)}<br />` : ""}${companyPhone ? `Phone: ${escapeHtml(companyPhone)}<br />` : ""}${
            companyEmail ? `Email: ${escapeHtml(companyEmail)}` : ""
          }</div>
        </div>
        <div class="invoice-badge">
          <div class="invoice-title">Invoice</div>
          <div class="qr"></div>
        </div>
      </div>
      <div class="meta">
        <div>
          <div class="label">Bill To</div>
          <div class="buyer">${escapeHtml(invoice.buyer)}</div>
          <div class="details">Project: ${escapeHtml(invoice.project)}</div>
        </div>
        <div>
          <div class="label">Invoice Details</div>
          <div class="details">
            <div>Invoice ID: <strong>${escapeHtml(invoice.id)}</strong></div>
            <div>Date: <strong>${escapeHtml(invoice.date)}</strong></div>
            <div>Status: <strong>${escapeHtml(invoice.status)}</strong></div>
          </div>
        </div>
      </div>
      <div style="padding: 24px;">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${escapeHtml(invoice.project)}</td>
              <td>${escapeHtml(invoice.amount)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="summary">
        <div class="summary-card">
          <div class="summary-row"><span>Subtotal:</span><span>${escapeHtml(invoice.amount)}</span></div>
          <div class="summary-row"><span>Tax (0%):</span><span>৳0.00</span></div>
          <div class="summary-row summary-total"><span>Total:</span><span class="accent">${escapeHtml(invoice.amount)}</span></div>
          <div class="summary-row"><span>Paid:</span><span class="success">${escapeHtml(invoice.paid)}</span></div>
          <div class="summary-row"><span>Balance Due:</span><span class="danger">${escapeHtml(invoice.due)}</span></div>
        </div>
      </div>
      <div class="footer">
        <div>Thank you for your business!</div>
        <div>Generated by Factory ERP System</div>
      </div>
    </div>
  </body>
</html>`;
}

export function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(defaultCompanyInfo);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formValues, setFormValues] = useState(emptyFormValues);

  useEffect(() => {
    let isMounted = true;

    async function loadInvoicePage() {
      try {
        const [invoiceRecords, formOptions, companyInfoResponse] = await Promise.all([getInvoices(), getInvoiceFormOptions(), getCompanyInfo()]);

        if (isMounted) {
          setInvoices(invoiceRecords);
          setBuyers(formOptions.buyers);
          setProjects(formOptions.projects);
          setCompanyInfo({
            companyName: companyInfoResponse?.companyName || defaultCompanyInfo.companyName,
            email: companyInfoResponse?.email || "",
            phone: companyInfoResponse?.phone || "",
            address: companyInfoResponse?.address || "",
          });
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

    loadInvoicePage();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedBuyer = buyers.find((buyer) => String(buyer.recordId) === formValues.buyerId);
  const availableProjects = selectedBuyer
    ? projects.filter((project) => String(project.buyerRecordId) === formValues.buyerId && Number(project.amountValue || 0) > 0)
    : [];
  const selectedProject = availableProjects.find((project) => String(project.recordId) === formValues.projectId);
  const enteredPaidAmount = Number(formValues.paidAmount || 0);
  const selectedAmount = Number(selectedProject?.amountValue || 0);
  const selectedProjectDisplayAmount = selectedProject?.amountFormatted || "৳0";
  const selectedProjectAmountHelper = selectedProject
    ? selectedProject.invoiceSource === "due"
      ? `This invoice will be recreated from outstanding due: ${selectedProject.totalDueAmountFormatted || "৳0"}.`
      : `This invoice will be created from remaining uninvoiced amount: ${selectedProject.amountFormatted || "৳0"}.`
    : "";
  const paginatedInvoices = getPaginatedRows(invoices, currentPage, pageSize);

  function handleExport() {
    const header = ["Invoice ID", "Buyer", "Project", "Amount", "Paid", "Due", "Date", "Status"];
    const rows = invoices.map((invoice) => [
      invoice.id,
      invoice.buyer,
      invoice.project,
      invoice.amount,
      invoice.paid,
      invoice.due,
      invoice.date,
      invoice.status,
    ]);
    downloadCsvFile("invoices.csv", header, rows);
  }

  function handleDownloadTablePdf() {
    openTablePdfWindow({
      title: "Invoices",
      columns: ["Invoice ID", "Buyer", "Project", "Amount", "Paid", "Due", "Date", "Status"],
      rows: invoices.map((invoice) => [invoice.id, invoice.buyer, invoice.project, invoice.amount, invoice.paid, invoice.due, invoice.date, invoice.status]),
    });
  }

  function openCreateModal() {
    setErrorMessage("");
    setFormValues(emptyFormValues);
    setIsCreateOpen(true);
  }

  function closeCreateModal() {
    setIsCreateOpen(false);
    setFormValues(emptyFormValues);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    if (name === "buyerId") {
      setFormValues((current) => ({
        ...current,
        buyerId: value,
        projectId: "",
        paidAmount: "",
      }));
      return;
    }

    if (name === "projectId") {
      setFormValues((current) => ({
        ...current,
        projectId: value,
        paidAmount: "",
      }));
      return;
    }

    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function openInvoicePrintWindow(invoice, autoPrint = true) {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      setErrorMessage("Please allow popups to print or download the invoice.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(createInvoicePrintMarkup(invoice, companyInfo));
    printWindow.document.close();

    if (autoPrint) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  }

  function handlePrintInvoice() {
    if (!previewInvoice) {
      return;
    }

    openInvoicePrintWindow(previewInvoice, true);
  }

  function handleDownloadInvoicePdf() {
    if (!previewInvoice) {
      return;
    }

    openInvoicePrintWindow(previewInvoice, true);
  }

  async function handleCreateInvoice(event) {
    event.preventDefault();

    if (!selectedBuyer) {
      setErrorMessage("Please select a buyer.");
      return;
    }

    if (!selectedProject) {
      setErrorMessage("Please select a project.");
      return;
    }

    if (enteredPaidAmount < 0) {
      setErrorMessage("Paid amount cannot be negative.");
      return;
    }

    if (enteredPaidAmount > selectedAmount) {
      setErrorMessage("Paid amount cannot exceed the remaining invoice amount.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const newInvoice = await createInvoice({
        buyerId: formValues.buyerId,
        projectId: formValues.projectId,
        paidAmount: formValues.paidAmount || "0",
        date: formValues.date,
      });

      setInvoices((current) => [newInvoice, ...current]);
      setIsCreateOpen(false);
      setPreviewInvoice(newInvoice);
      setFormValues(emptyFormValues);
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
          <h2 className="text-[18px] font-semibold leading-none text-[#e6ebf4]">Invoices</h2>
          <p className="mt-2 text-[11px] text-[#8f9cb0]">Buyer and project come from the database, and due is saved automatically.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-[6px] border border-[#f6a313] px-5 py-3 text-[12px] font-medium text-white transition hover:bg-[#f6a313]/10"
            onClick={handleExport}
            type="button"
          >
            <DownloadIcon />
            Export
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-[6px] border border-[#334156] px-5 py-3 text-[12px] font-medium text-white transition hover:bg-[#334156]/40"
            onClick={handleDownloadTablePdf}
            type="button"
          >
            <DownloadIcon />
            Download PDF
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#f6a313] px-5 py-3 text-[12px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
            onClick={openCreateModal}
            type="button"
          >
            <PlusIcon />
            Create Invoice
          </button>
        </div>
      </div>

      {errorMessage ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[14px] text-[#f7c8cf]">{errorMessage}</div> : null}

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[14%]" />
              <col className="w-[11%]" />
              <col className="w-[11%]" />
              <col className="w-[11%]" />
              <col className="w-[11%]" />
              <col className="w-[13%]" />
              <col className="w-[10%]" />
              <col className="w-[7%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="pb-3 font-medium">Invoice ID</th>
                <th className="pb-3 font-medium">Buyer</th>
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Paid</th>
                <th className="pb-3 font-medium">Due</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={9}>
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length > 0 ? (
                paginatedInvoices.rows.map((invoice) => (
                  <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={invoice.recordId}>
                    <td className="py-4 font-semibold text-[#f7a614]">{invoice.id}</td>
                    <td className="py-4 break-words">{invoice.buyer}</td>
                    <td className="py-4">{invoice.project}</td>
                    <td className="py-4 text-[#d7deea]">{invoice.amount}</td>
                    <td className="py-4 font-semibold text-[#f7a614]">{invoice.paid}</td>
                    <td className="py-4 font-semibold text-[#ef4444]">{invoice.due}</td>
                    <td className="py-4 text-[#98a5bb]">{invoice.date}</td>
                    <td className="py-4">
                      <span className="inline-flex rounded-sm bg-[#57411f] px-2 py-1 text-[11px] font-medium text-[#f5b14e]">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end">
                        <button
                          className="inline-flex items-center gap-1 text-[#d7deea] transition hover:text-white"
                          onClick={() => setPreviewInvoice(invoice)}
                          type="button"
                        >
                          <EyeIcon />
                          <span className="sr-only">View invoice preview</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={9}>
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!pageLoading && invoices.length > 0 ? (
          <TablePagination
            currentPage={paginatedInvoices.currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            pageSize={paginatedInvoices.pageSize}
            totalItems={paginatedInvoices.totalItems}
            totalPages={paginatedInvoices.totalPages}
          />
        ) : null}
      </article>

      {isCreateOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[520px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[22px] font-semibold text-[#e6ebf4]">Create Invoice</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeCreateModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleCreateInvoice}>
              <label className="block space-y-2">
                <span className="text-[13px] font-medium text-[#d6ddea]">Buyer *</span>
                <select
                  className="h-11 w-full appearance-none rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="buyerId"
                  onChange={handleFormChange}
                  required
                  value={formValues.buyerId}
                >
                  <option value="">Select buyer</option>
                  {buyers.map((buyer) => (
                    <option key={buyer.recordId} value={buyer.recordId}>
                      {buyer.company}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-[13px] font-medium text-[#d6ddea]">Project *</span>
                <select
                  className="h-11 w-full appearance-none rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="projectId"
                  onChange={handleFormChange}
                  required
                  value={formValues.projectId}
                >
                  <option value="">{selectedBuyer ? "Select project" : "Select project"}</option>
                  {availableProjects.map((project) => (
                    <option key={project.recordId} value={project.recordId}>
                      {project.id} - {project.name}
                    </option>
                  ))}
                </select>
                {selectedBuyer && availableProjects.length === 0 ? (
                  <p className="text-[12px] text-[#f7c8cf]">
                    No projects currently have invoiceable remaining amount or transferable due.
                  </p>
                ) : null}
              </label>

              <label className="block space-y-2">
                <span className="text-[13px] font-medium text-[#d6ddea]">Amount (৳) *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="amount"
                  readOnly
                  type="text"
                  value={selectedProjectDisplayAmount}
                />
                {selectedProject ? (
                  <p className="text-[12px] text-[#8f9cb0]">
                    {selectedProjectAmountHelper} Total order: {selectedProject.totalOrderAmountFormatted || "৳0"}. Already invoiced:{" "}
                    {selectedProject.totalInvoicedAmountFormatted || "৳0"}.
                  </p>
                ) : null}
              </label>

              <label className="block space-y-2">
                <span className="text-[13px] font-medium text-[#d6ddea]">Paid (৳)</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  min="0"
                  name="paidAmount"
                  onChange={handleFormChange}
                  step="0.01"
                  type="number"
                  value={formValues.paidAmount}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[13px] font-medium text-[#d6ddea]">Date *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="date"
                  onChange={handleFormChange}
                  required
                  type="date"
                  value={formValues.date}
                />
              </label>

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeCreateModal} type="button">
                  Close
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Creating..." : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {previewInvoice ? (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#0d1422]/82 px-4 py-4">
          <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-[600px] flex-col overflow-hidden rounded-md border border-[#314058] bg-[#f3f4f6] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col gap-3 border-b border-[#cfd5df] bg-[#f3f4f6] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-[18px] font-medium text-[#3b4454]">Invoice Preview</h3>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
                <button
                  className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-md bg-[#475569] px-4 text-[12px] font-medium text-white transition hover:bg-[#5a6a7f]"
                  onClick={handlePrintInvoice}
                  type="button"
                >
                  Print
                </button>
                <button
                  className="inline-flex h-10 min-w-[128px] items-center justify-center rounded-md bg-[#f6a313] px-4 text-[12px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  onClick={handleDownloadInvoicePdf}
                  type="button"
                >
                  Download PDF
                </button>
                <button
                  className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-md bg-[#475569] px-4 text-[12px] font-medium text-white transition hover:bg-[#5a6a7f]"
                  onClick={() => setPreviewInvoice(null)}
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="overflow-y-auto bg-white p-4 text-[#4b5563]">
                <div className="border border-[#334155]">
                  <div className="flex items-start justify-between bg-[#111827] px-4 py-6 text-white">
                    <div>
                    <div className="text-[18px] font-semibold uppercase tracking-[0.04em] text-[#f7a614]">{companyInfo.companyName || defaultCompanyInfo.companyName}</div>
                    {companyInfo.address ? <div className="mt-2 text-[11px] text-[#cbd5e1]">{companyInfo.address}</div> : null}
                    {companyInfo.phone ? <div className="text-[11px] text-[#cbd5e1]">Phone: {companyInfo.phone}</div> : null}
                    {companyInfo.email ? <div className="text-[11px] text-[#cbd5e1]">Email: {companyInfo.email}</div> : null}
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-semibold uppercase tracking-[0.04em] text-[#f7a614]">Invoice</div>
                    <div className="mt-2 rounded bg-white p-2">
                      <QrMock />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 border-b border-[#d6dbe5] px-4 py-6">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#64748b]">Bill To</div>
                    <div className="mt-3 font-semibold text-[#60a5fa]">{previewInvoice.buyer}</div>
                    <div className="mt-1 text-[14px]">Project: {previewInvoice.project}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#64748b]">Invoice Details</div>
                    <div className="mt-3 space-y-1 text-[14px]">
                      <div>
                        Invoice ID: <span className="font-semibold text-[#93c5fd]">{previewInvoice.id}</span>
                      </div>
                      <div>
                        Date: <span className="text-[#93c5fd]">{previewInvoice.date}</span>
                      </div>
                      <div>
                        Status:{" "}
                        <span className="inline-flex rounded-sm bg-[#f4d7a6] px-2 py-0.5 text-[11px] font-medium text-[#b56a12]">
                          {previewInvoice.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-[#d6dbe5] px-4 py-6">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[#eef2f7] text-[10px] uppercase tracking-[0.12em] text-[#64748b]">
                        <th className="px-3 py-2 font-semibold">Description</th>
                        <th className="px-3 py-2 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#e5e7eb] text-[14px]">
                        <td className="px-3 py-4">{previewInvoice.project}</td>
                        <td className="px-3 py-4 text-right">{previewInvoice.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end px-4 py-6">
                  <div className="w-full max-w-[240px] space-y-1 text-[14px]">
                    <div className="flex items-center justify-between">
                      <span>Subtotal:</span>
                      <span>{previewInvoice.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tax (0%):</span>
                      <span>৳0.00</span>
                    </div>
                    <div className="mt-2 border-t border-[#334155] pt-2" />
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-[24px] text-[#f7a614]">{previewInvoice.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Paid:</span>
                      <span className="font-semibold text-[#22c55e]">{previewInvoice.paid}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Balance Due:</span>
                      <span className="font-semibold text-[#ef4444]">{previewInvoice.due}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#d6dbe5] px-4 py-5 text-center text-[11px] text-[#6b7280]">
                  <div>Thank you for your business!</div>
                  <div>Generated by Factory ERP System</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
