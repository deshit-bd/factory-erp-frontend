import { useState } from "react";

const initialInvoices = [
  {
    id: "INV-001",
    buyer: "ABC Corp",
    project: "PRJ-001",
    amount: "$60,000",
    paid: "$30,000",
    due: "$30,000",
    date: "2026-04-10",
    status: "Partial",
  },
  {
    id: "INV-002",
    buyer: "XYZ Ltd",
    project: "PRJ-002",
    amount: "$25,500",
    paid: "$25,500",
    due: "$0",
    date: "2026-04-08",
    status: "Paid",
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

function Field({ label, name, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block space-y-2">
      <span className="text-[13px] font-medium text-[#d6ddea]">{label}</span>
      <input
        className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

export function InvoicesPage() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [formValues, setFormValues] = useState({
    buyer: "",
    project: "",
    amount: "",
    paid: "",
    date: "",
  });

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
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoices.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openCreateModal() {
    setFormValues({
      buyer: "",
      project: "",
      amount: "",
      paid: "",
      date: "",
    });
    setIsCreateOpen(true);
  }

  function closeCreateModal() {
    setIsCreateOpen(false);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleCreateInvoice(event) {
    event.preventDefault();
    const nextNumber = invoices.length + 1;
    const padded = String(nextNumber).padStart(3, "0");
    const amount = Number(formValues.amount || 0);
    const paid = Number(formValues.paid || 0);
    const due = Math.max(amount - paid, 0);

    const nextInvoice = {
      id: `INV-${padded}`,
      buyer: formValues.buyer,
      project: formValues.project,
      amount: `$${amount.toLocaleString("en-US")}`,
      paid: `$${paid.toLocaleString("en-US")}`,
      due: `$${due.toLocaleString("en-US")}`,
      date: formValues.date,
      status: due > 0 ? "Partial" : "Paid",
    };

    setInvoices((current) => [...current, nextInvoice]);
    setIsCreateOpen(false);
    setPreviewInvoice(nextInvoice);
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[18px] font-semibold leading-none text-[#e6ebf4]">Invoices</h2>
          <p className="mt-2 text-[11px] text-[#8f9cb0]">Create and manage customer invoices</p>
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
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#f6a313] px-5 py-3 text-[12px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
            onClick={openCreateModal}
            type="button"
          >
            <PlusIcon />
            Create Invoice
          </button>
        </div>
      </div>

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[12%] pb-3 font-medium">Invoice ID</th>
                <th className="w-[12%] pb-3 font-medium">Buyer</th>
                <th className="w-[10%] pb-3 font-medium">Project</th>
                <th className="w-[10%] pb-3 font-medium">Amount</th>
                <th className="w-[10%] pb-3 font-medium">Paid</th>
                <th className="w-[10%] pb-3 font-medium">Due</th>
                <th className="w-[14%] pb-3 font-medium">Date</th>
                <th className="w-[12%] pb-3 font-medium">Status</th>
                <th className="w-[10%] pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={invoice.id}>
                  <td className="py-4 font-semibold text-[#f7a614]">{invoice.id}</td>
                  <td className="py-4">{invoice.buyer}</td>
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
              ))}
            </tbody>
          </table>
        </div>
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
              <Field label="Buyer *" name="buyer" onChange={handleFormChange} value={formValues.buyer} />
              <Field label="Project *" name="project" onChange={handleFormChange} value={formValues.project} />
              <Field label="Amount ($) *" name="amount" onChange={handleFormChange} type="number" value={formValues.amount} />
              <Field label="Paid ($)" name="paid" onChange={handleFormChange} type="number" value={formValues.paid} />
              <Field label="Date *" name="date" onChange={handleFormChange} placeholder="YYYY-MM-DD" value={formValues.date} />

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeCreateModal} type="button">
                  Close
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  type="submit"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {previewInvoice ? (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#0d1422]/82 px-4 py-4">
          <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-[600px] flex-col overflow-hidden rounded-md border border-[#314058] bg-[#f3f4f6] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-[#cfd5df] bg-[#f3f4f6] px-4 py-3">
              <h3 className="text-[18px] font-medium text-[#3b4454]">Invoice Preview</h3>
              <div className="flex items-center gap-2">
                <button className="rounded bg-[#475569] px-4 py-2 text-[12px] font-medium text-white transition hover:bg-[#5a6a7f]" type="button">
                  Print
                </button>
                <button className="rounded bg-[#f6a313] px-4 py-2 text-[12px] font-medium text-[#111827] transition hover:bg-[#ffb733]" type="button">
                  Download PDF
                </button>
                <button
                  className="rounded bg-[#475569] px-4 py-2 text-[12px] font-medium text-white transition hover:bg-[#5a6a7f]"
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
                    <div className="text-[18px] font-semibold uppercase tracking-[0.04em] text-[#f7a614]">Factory ERP</div>
                    <div className="mt-2 text-[11px] text-[#cbd5e1]">Manufacturing & Industrial Solutions</div>
                    <div className="text-[11px] text-[#cbd5e1]">Industrial District, NY 10001</div>
                    <div className="text-[11px] text-[#cbd5e1]">Phone: +1-234-567-8900</div>
                    <div className="text-[11px] text-[#cbd5e1]">Email: contact@factory.com</div>
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
                      <span>$0.00</span>
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
                  <div>Generated by Factory ERP System on 4/18/2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
