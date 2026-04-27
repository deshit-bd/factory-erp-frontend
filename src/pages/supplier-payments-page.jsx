import { useEffect, useState } from "react";

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

function normalizeSupplierOptions(records) {
  if (Array.isArray(records)) {
    return records;
  }

  if (Array.isArray(records?.data)) {
    return records.data;
  }

  return [];
}

function normalizeProjectOptions(records) {
  if (Array.isArray(records)) {
    return records;
  }

  if (Array.isArray(records?.data)) {
    return records.data;
  }

  return [];
}

function getCurrentDateDisplay() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  return `${day}/${month}/${year}`;
}

function getCurrentDateValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDateToValue(value) {
  if (!value) {
    return "";
  }

  const [day, month, year] = String(value).split("/");

  if (!day || !month || !year) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

function formatCurrencyNumber(value) {
  return `৳${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function SupplierPaymentsPage({
  pageTitle = "Supplier Payment",
  pageDescription = "Track supplier payments with auto invoice generation and due management",
  exportFileName = "supplier-payments.csv",
  recordModalTitle = "Record Supplier Payment",
  supplierOptionsLoader = null,
  projectOptionsLoader = null,
  paymentsLoader = null,
  createPayment = null,
  showProjectField = true,
  showProjectColumn = true,
  showProjectDetails = true,
}) {
  const [payments, setPayments] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [detailsPayment, setDetailsPayment] = useState(null);
  const [invoicePayment, setInvoicePayment] = useState(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    supplier: "",
    project: "",
    paymentMethod: "",
    previousDueAmount: "",
    paidAmount: "",
    date: getCurrentDateDisplay(),
  });

  useEffect(() => {
    let isMounted = true;

    async function loadSuppliers() {
      try {
        if (!supplierOptionsLoader) {
          if (isMounted) {
            setSupplierOptions([]);
          }
          return;
        }

        const records = await supplierOptionsLoader();

        if (isMounted) {
          setSupplierOptions(normalizeSupplierOptions(records));
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

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        if (!projectOptionsLoader) {
          if (isMounted) {
            setProjectOptions([]);
          }
          return;
        }

        const records = await projectOptionsLoader();

        if (isMounted) {
          setProjectOptions(normalizeProjectOptions(records));
        }
      } catch (error) {
        if (isMounted) {
          setProjectOptions([]);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, [projectOptionsLoader]);

  useEffect(() => {
    let isMounted = true;

    async function loadPayments() {
      try {
        if (!paymentsLoader) {
          if (isMounted) {
            setPayments([]);
          }
          return;
        }

        const records = await paymentsLoader();

        if (isMounted) {
          setPayments(Array.isArray(records) ? records : []);
        }
      } catch (error) {
        if (isMounted) {
          setPayments([]);
          setErrorMessage(error.message);
        }
      }
    }

    loadPayments();

    return () => {
      isMounted = false;
    };
  }, [paymentsLoader]);

  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.totalPaid.replace(/[^\d.-]/g, "")), 0);
  const totalDue = payments.reduce((sum, payment) => sum + Number(payment.remainingDue.replace(/[^\d.-]/g, "")), 0);
  const totalSuppliers = new Set(payments.map((payment) => payment.supplier)).size;
  const selectedSupplier = supplierOptions.find((supplier) => String(supplier.recordId) === formValues.supplier) ?? null;
  const currentPreviousDue = Number(formValues.previousDueAmount || 0);
  const currentPaidAmount = Number(formValues.paidAmount || 0);
  const currentRemainingDue = Math.max(currentPreviousDue - currentPaidAmount, 0);

  function handleExport() {
    const header = ["Payment ID", "Supplier", "Project", "Status", "Total Paid", "Remaining Due", "Date"];
    const rows = payments.map((payment) => {
      const baseRow = [payment.id, payment.supplier];

      if (showProjectColumn) {
        baseRow.push(payment.project);
      }

      baseRow.push(payment.status, payment.totalPaid, payment.remainingDue, payment.date);
      return baseRow;
    });
    const normalizedHeader = showProjectColumn
      ? header
      : ["Payment ID", "Supplier", "Status", "Total Paid", "Remaining Due", "Date"];
    const csv = [normalizedHeader, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = exportFileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  function openRecordModal() {
    setErrorMessage("");
    setFormValues({
      supplier: "",
      project: showProjectField ? "" : String(projectOptions[0]?.recordId || ""),
      paymentMethod: "",
      previousDueAmount: "",
      paidAmount: "",
      date: getCurrentDateDisplay(),
    });
    setIsRecordModalOpen(true);
  }

  function closeRecordModal() {
    setIsRecordModalOpen(false);
    setErrorMessage("");
    setFormValues({
      supplier: "",
      project: showProjectField ? "" : String(projectOptions[0]?.recordId || ""),
      paymentMethod: "",
      previousDueAmount: "",
      paidAmount: "",
      date: getCurrentDateDisplay(),
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    if (name === "supplier") {
      const selectedOption = supplierOptions.find((supplier) => String(supplier.recordId) === value);
      const previousDueAmount = selectedOption ? String(selectedOption.previousDue ?? 0) : "";

      setFormValues((current) => ({
        ...current,
        supplier: value,
        previousDueAmount,
      }));
      return;
    }

    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function handleRecordPayment(event) {
    event.preventDefault();
    setErrorMessage("");

    const previous = Number(formValues.previousDueAmount || 0);
    const paid = Number(formValues.paidAmount || 0);

    if (paid > previous) {
      setErrorMessage("Paid amount cannot be greater than the remaining due.");
      return;
    }

    if (!createPayment) {
      const remaining = Math.max(previous - paid, 0);
      const resolvedProjectId = formValues.project || String(projectOptions[0]?.recordId || "");
      const selectedProject = projectOptions.find((project) => String(project.recordId) === resolvedProjectId);
      const nextNumber = payments.length + 1;
      const padded = String(nextNumber).padStart(3, "0");

      setPayments((current) => [
        {
          id: `PAY-${padded}`,
          supplierId: selectedSupplier?.id || `SUP-${padded}`,
          supplier: selectedSupplier?.name || "",
          project: selectedProject?.id || "N/A",
          status: remaining > 0 ? "Partial" : "Paid",
          totalPaid: `৳${paid.toLocaleString("en-US")}`,
          remainingDue: `৳${remaining.toLocaleString("en-US")}`,
          date: formValues.date,
          paymentMethod: formValues.paymentMethod,
          previousDueAmount: `৳${previous.toLocaleString("en-US")}`,
          invoiceId: `PINV-${padded}`,
        },
        ...current,
      ]);

      closeRecordModal();
      return;
    }

    setIsSubmitting(true);

    try {
      const createdPayment = await createPayment({
        paymentDate: formatDisplayDateToValue(formValues.date) || getCurrentDateValue(),
        supplierId: formValues.supplier,
        projectId: formValues.project || String(projectOptions[0]?.recordId || ""),
        paymentMethod: formValues.paymentMethod.toLowerCase(),
        paidAmount: formValues.paidAmount,
      });

      setPayments((current) => [createdPayment, ...current]);
      setSupplierOptions((current) =>
        current.map((supplier) =>
          String(supplier.recordId) === formValues.supplier
            ? { ...supplier, previousDue: Number(createdPayment.remainingDue.replace(/[^\d.-]/g, "")) }
            : supplier,
        ),
      );
      closeRecordModal();
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

      {errorMessage ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[14px] text-[#f7c8cf]">{errorMessage}</div> : null}

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
              {showProjectColumn ? <col className="w-[8%]" /> : null}
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
                {showProjectColumn ? <th className="pb-3 font-medium">Project</th> : null}
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
                  {showProjectColumn ? <td className="py-4">{payment.project}</td> : null}
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
              {payments.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[var(--app-text-muted)]" colSpan={showProjectColumn ? 9 : 8}>
                    No payments found.
                  </td>
                </tr>
              ) : null}
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
                  {showProjectDetails ? (
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.14em] text-[#8d9ab0]">Project</div>
                      <div className="mt-1 text-[#e6ebf4]">{detailsPayment.project}</div>
                    </div>
                  ) : null}
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
                    {showProjectDetails ? (
                      <div>
                        Project: <span className="font-semibold">{invoicePayment.project}</span>
                      </div>
                    ) : null}
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
              {errorMessage ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[14px] text-[#f7c8cf]">{errorMessage}</div> : null}

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
                      <option key={supplier.recordId} value={supplier.recordId}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Payment Method *</span>
                  <select
                    className="h-11 w-full appearance-none rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                    name="paymentMethod"
                    onChange={handleFormChange}
                    required
                    value={formValues.paymentMethod}
                  >
                    <option value="">Select payment method</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                  </select>
                </label>

                {showProjectField && projectOptions.length > 0 ? (
                  <label className="block space-y-2">
                    <span className="text-[14px] font-medium text-[#d6ddea]">Project *</span>
                    <select
                      className="h-11 w-full appearance-none rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                      name="project"
                      onChange={handleFormChange}
                      required
                      value={formValues.project}
                    >
                      <option value="">Select project</option>
                      {projectOptions.map((project) => (
                        <option key={project.recordId} value={project.recordId}>
                          {project.id} - {project.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Previous Due Amount (৳) *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="previousDueAmount"
                    placeholder="Auto-filled from supplier due"
                    readOnly
                    required
                    type="number"
                    value={formValues.previousDueAmount}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Paid Amount (৳) *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    max={currentPreviousDue > 0 ? currentPreviousDue : undefined}
                    min="0"
                    name="paidAmount"
                    onChange={handleFormChange}
                    placeholder="Enter payment amount"
                    required
                    type="number"
                    value={formValues.paidAmount}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Remaining Due (৳)</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] font-medium text-[#ef4444] outline-none"
                    readOnly
                    type="text"
                    value={formatCurrencyNumber(currentRemainingDue)}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Date *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="date"
                    readOnly
                    required
                    type="text"
                    value={formValues.date}
                  />
                </label>
              </div>

              {selectedSupplier ? (
                <div className="rounded-md border border-[#334156] bg-[#243045] px-4 py-4">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9aa6bb]">Supplier Details</div>
                  <div className="mt-3 grid grid-cols-1 gap-3 text-[13px] text-[#d7deea] md:grid-cols-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.14em] text-[#8f9ab0]">Supplier ID</div>
                      <div className="mt-1 font-medium text-[#e6ebf4]">{selectedSupplier.id}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.14em] text-[#8f9ab0]">Category</div>
                      <div className="mt-1">{selectedSupplier.category}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.14em] text-[#8f9ab0]">Email</div>
                      <div className="mt-1 break-all">{selectedSupplier.email}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.14em] text-[#8f9ab0]">Phone</div>
                      <div className="mt-1">{selectedSupplier.phone}</div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeRecordModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Submitting..." : "Submit Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
