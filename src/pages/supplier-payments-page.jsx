import { useState,useEffect } from "react";

import { getProjectGoodsSuppliers } from "@/shared/lib/project-goods-supplier-api";
import { getRawMaterialSuppliers } from "@/shared/lib/raw-material-supplier-api";

const initialPayments = [
  {
    id: "PAY-001",
    supplierId: "SUP-001",
    supplier: "Metal Suppliers Inc",
    project: "PRJ-001",
    status: "Partial",
    totalPaid: "৳3,000",
    remainingDue: "৳3,000",
    date: "2026-04-16",
    paymentMethod: "Mobile Banking",
    previousDueAmount: "৳6,000",
    invoiceId: "PINV-001",
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

function QrMock() {
  return (
    <svg aria-hidden="true" className="h-[110px] w-[110px]" viewBox="0 0 110 110">
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

export function SupplierPaymentsPage({
  pageTitle = "Supplier Payments",
  pageDescription = "Track payments with auto invoice generation and due management",
  exportFileName = "supplier-payments.csv",
  recordModalTitle = "Record Supplier Payment",
  supplierOptionsLoader = getRawMaterialSuppliers,
}) {
  const [payments, setPayments] = useState(initialPayments);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [detailsPayment, setDetailsPayment] = useState(null);
  const [invoicePayment, setInvoicePayment] = useState(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    supplier: "",
    paymentMethod: "",
    previousDueAmount: "",
    paidAmount: "",
    date: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadSuppliers() {
      try {
        const records = await supplierOptionsLoader();

        if (isMounted) {
          setSupplierOptions(records);
        }
      } catch (error) {
        if (isMounted) {
          setSupplierOptions([]);
        }
      }
    }

    loadSuppliers();

    return () => {
      isMounted = false;
    };
  }, [supplierOptionsLoader]);

  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.totalPaid.replace(/[^\d.-]/g, "")), 0);
  const totalDue = payments.reduce((sum, payment) => sum + Number(payment.remainingDue.replace(/[^\d.-]/g, "")), 0);
  const totalSuppliers = new Set(payments.map((payment) => payment.supplier)).size;

  function handleExport() {
    const header = ["Payment ID", "Supplier", "Project", "Status", "Total Paid", "Remaining Due", "Date"];
    const rows = payments.map((payment) => [
      payment.id,
      payment.supplier,
      payment.project,
      payment.status,
      payment.totalPaid,
      payment.remainingDue,
      payment.date,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = exportFileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  function openRecordModal() {
    setFormValues({
      supplier: "",
      paymentMethod: "",
      previousDueAmount: "",
      paidAmount: "",
      date: "",
    });
    setIsRecordModalOpen(true);
  }

  function closeRecordModal() {
    setIsRecordModalOpen(false);
    setFormValues({
      supplier: "",
      paymentMethod: "",
      previousDueAmount: "",
      paidAmount: "",
      date: "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleRecordPayment(event) {
    event.preventDefault();
    const nextNumber = payments.length + 1;
    const padded = String(nextNumber).padStart(3, "0");
    const previous = Number(formValues.previousDueAmount || 0);
    const paid = Number(formValues.paidAmount || 0);
    const remaining = Math.max(previous - paid, 0);

    setPayments((current) => [
      ...current,
      {
        id: `PAY-${padded}`,
        supplierId: `SUP-${padded}`,
        supplier: formValues.supplier,
        project: "N/A",
        status: remaining > 0 ? "Partial" : "Paid",
        totalPaid: `৳${paid.toLocaleString("en-US")}`,
        remainingDue: `৳${remaining.toLocaleString("en-US")}`,
        date: formValues.date,
        paymentMethod: formValues.paymentMethod,
        previousDueAmount: `৳${previous.toLocaleString("en-US")}`,
        invoiceId: `PINV-${padded}`,
      },
    ]);

    closeRecordModal();
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[18px] font-semibold leading-none text-[var(--app-text)]">{pageTitle}</h2>
          <p className="mt-2 text-[11px] text-[var(--app-text-muted)]">{pageDescription}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-[6px] border border-[#2563eb] px-5 py-3 text-[12px] font-medium text-[#2563eb] transition hover:bg-[#2563eb]/10"
            onClick={handleExport}
            type="button"
          >
            <DownloadIcon />
            Export
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#2563eb] px-5 py-3 text-[12px] font-medium text-white transition hover:bg-[#1d4ed8]"
            onClick={openRecordModal}
            type="button"
          >
            <PlusIcon />
            Add Payment
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <article className="rounded-[4px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--app-text-soft)]">Total Paid</div>
          <div className="mt-2 text-[15px] font-semibold text-[#2563eb]">৳{totalPaid.toLocaleString("en-US")}</div>
        </article>
        <article className="rounded-[4px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--app-text-soft)]">Total Due</div>
          <div className="mt-2 text-[15px] font-semibold text-[#ef4444]">৳{totalDue.toLocaleString("en-US")}</div>
        </article>
        <article className="rounded-[4px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--app-text-soft)]">Total Suppliers</div>
          <div className="mt-2 text-[28px] font-semibold leading-none text-[var(--app-text)]">{totalSuppliers}</div>
        </article>
      </section>

      <article className="rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        <div className="overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[11%]" />
              <col className="w-[10%]" />
              <col className="w-[17%]" />
              <col className="w-[8%]" />
              <col className="w-[16%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[8%]" />
              <col className="w-[6%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[var(--app-border)] text-[10px] uppercase tracking-[0.16em] text-[var(--app-text-soft)]">
                <th className="pb-3 font-medium">Payment ID</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Supplier</th>
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Payment Method</th>
                <th className="pb-3 font-medium">Paid Amount</th>
                <th className="pb-3 font-medium">Due Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr className="border-b border-[var(--app-border)] text-[13px] text-[var(--app-text)]" key={payment.id}>
                  <td className="py-4 font-semibold text-[#2563eb]">{payment.id}</td>
                  <td className="py-4 text-[var(--app-text-muted)]">{payment.date}</td>
                  <td className="py-4 pr-3 break-words">{payment.supplier}</td>
                  <td className="py-4">{payment.project}</td>
                  <td className="py-4 break-words">
                    <span className="inline-flex rounded-full bg-[#e2e8f0] px-2.5 py-1 text-[10px] font-medium text-[#64748b]">
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 font-semibold text-[#2563eb]">{payment.totalPaid}</td>
                  <td className="py-4 font-semibold text-[#ef4444]">{payment.remainingDue}</td>
                  <td className="py-4">
                    <span className="inline-flex rounded-full bg-[rgba(16,185,129,0.12)] px-2.5 py-1 text-[11px] font-medium text-[#10b981]">
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex justify-end">
                      <button
                        className="inline-flex items-center gap-1 text-[var(--app-text-muted)] transition hover:text-[#2563eb]"
                        onClick={() => setDetailsPayment(payment)}
                        type="button"
                      >
                        <EyeIcon />
                        <span className="sr-only">View payment details</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {detailsPayment ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/78 px-4 py-6 md:items-center">
          <div className="w-full max-w-[470px] overflow-hidden rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[20px] font-semibold text-[#e6ebf4]">Payment Details</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={() => setDetailsPayment(null)} type="button">
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4 px-4 py-4">
              <div className="rounded-md bg-[#2a3548] px-4 py-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#8d9ab0]">Payment ID</div>
                    <div className="mt-1 font-semibold text-[#f7a614]">{detailsPayment.id}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#8d9ab0]">Status</div>
                    <div className="mt-1">
                      <span className="inline-flex rounded-sm bg-[#57411f] px-2 py-1 text-[11px] font-medium text-[#f5b14e]">
                        {detailsPayment.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#8d9ab0]">Supplier</div>
                    <div className="mt-1 text-[#e6ebf4]">{detailsPayment.supplier}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#8d9ab0]">Project</div>
                    <div className="mt-1 text-[#e6ebf4]">{detailsPayment.project}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#8d9ab0]">Total Paid</div>
                    <div className="mt-1 font-semibold text-[#f7a614]">{detailsPayment.totalPaid}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#8d9ab0]">Remaining Due</div>
                    <div className="mt-1 font-semibold text-[#ef4444]">{detailsPayment.remainingDue}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9aa6bb]">Payment Invoices (1)</div>
                <div className="mt-3 rounded-md border border-[#314058] px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="font-semibold text-[#f7a614]">{detailsPayment.invoiceId}</div>
                      <div className="text-[12px] text-[#8f9cb0]">{detailsPayment.date}</div>
                      <div className="flex gap-10 pt-1 text-[12px]">
                        <div>
                          <div className="text-[#8f9cb0]">Method</div>
                          <div className="text-[#e6ebf4]">{detailsPayment.paymentMethod}</div>
                        </div>
                        <div>
                          <div className="text-[#8f9cb0]">Paid</div>
                          <div className="font-semibold text-[#f7a614]">{detailsPayment.totalPaid}</div>
                        </div>
                        <div>
                          <div className="text-[#8f9cb0]">Remaining</div>
                          <div className="font-semibold text-[#ef4444]">{detailsPayment.remainingDue}</div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="inline-flex items-center rounded-md bg-[#f6a313] px-4 py-2 text-[13px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                      onClick={() => setInvoicePayment(detailsPayment)}
                      type="button"
                    >
                      <EyeIcon />
                      <span className="ml-1">View Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {invoicePayment ? (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#0d1422]/82 px-4 py-6 md:items-center">
          <div className="w-full max-w-[560px] overflow-hidden rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[22px] font-semibold text-[#e6ebf4]">Payment Invoice</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={() => setInvoicePayment(null)} type="button">
                <CloseIcon />
              </button>
            </div>

            <div className="max-h-[calc(100vh-72px)] space-y-4 overflow-y-auto px-4 py-4">
              <div className="border-b border-[#314058] pb-4 text-center">
                <div className="text-[29px] font-semibold uppercase tracking-[0.04em] text-[#f7a614]">Payment Invoice</div>
                <div className="mt-1.5 text-[#d7deea]">Factory ERP System</div>
                <div className="text-[12px] text-[#8f9cb0]">Invoice ID: {invoicePayment.invoiceId}</div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-b border-[#314058] pb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#8f9ab0]">Supplier Details</div>
                  <div className="mt-3 font-semibold text-[#e6ebf4]">{invoicePayment.supplier}</div>
                  <div className="text-[13px] text-[#8f9cb0]">ID: {invoicePayment.supplierId}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#8f9ab0]">Payment Details</div>
                  <div className="mt-3 space-y-1 text-[14px] text-[#d7deea]">
                    <div>
                      Payment ID: <span className="font-semibold">{invoicePayment.id}</span>
                    </div>
                    <div>
                      Project: <span className="font-semibold">{invoicePayment.project}</span>
                    </div>
                    <div>Date: {invoicePayment.date}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-[#314058] bg-[#2a3548] px-4 py-4">
                <div className="space-y-3.5 text-[15px]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#aab4c5]">Payment Method</span>
                    <span className="rounded-sm bg-[#4b5568] px-2 py-1 text-[11px] font-medium text-[#dbe3ef]">
                      {invoicePayment.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#aab4c5]">Previous Due Amount</span>
                    <span className="font-semibold text-[#e6ebf4]">{invoicePayment.previousDueAmount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-[#e6ebf4]">Paid Amount</span>
                    <span className="text-[26px] font-semibold leading-none text-[#f7a614]">{invoicePayment.totalPaid}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-[#e6ebf4]">Remaining Due</span>
                    <span className="text-[26px] font-semibold leading-none text-[#ef4444]">{invoicePayment.remainingDue}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-[#75541d] bg-[#3a3834] px-4 py-4 text-center">
                <div className="text-[13px] text-[#b1bac8]">Payment Status</div>
                <div className="mt-2">
                  <span className="inline-flex rounded-sm bg-[#57411f] px-2 py-1 text-[11px] font-medium uppercase text-[#f5b14e]">
                    {invoicePayment.status === "Partial" ? "Partially Paid" : "Paid"}
                  </span>
                </div>
              </div>

              <div className="flex justify-center pt-1">
                <div className="rounded-md bg-white p-2 shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
                  <QrMock />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isRecordModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[820px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">{recordModalTitle}</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeRecordModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleRecordPayment}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Supplier *</span>
                  <select
                    className="h-11 w-full appearance-none rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                    name="supplier"
                    onChange={handleFormChange}
                    required
                    value={formValues.supplier}
                  >
                    <option value="">Select supplier</option>
                    {supplierOptions.map((supplier) => (
                      <option key={supplier.recordId} value={supplier.name}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Payment Method *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                    name="paymentMethod"
                    onChange={handleFormChange}
                    required
                    type="text"
                    value={formValues.paymentMethod}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Previous Due Amount (৳) *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="previousDueAmount"
                    onChange={handleFormChange}
                    placeholder="Enter total due amount"
                    required
                    type="number"
                    value={formValues.previousDueAmount}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Paid Amount (৳) *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="paidAmount"
                    onChange={handleFormChange}
                    placeholder="Enter payment amount"
                    required
                    type="number"
                    value={formValues.paidAmount}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Date *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="date"
                    onChange={handleFormChange}
                    placeholder="DD/MM/YYYY"
                    required
                    type="text"
                    value={formValues.date}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeRecordModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  type="submit"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
