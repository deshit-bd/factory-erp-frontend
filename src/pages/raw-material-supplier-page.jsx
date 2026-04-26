import { useEffect, useState } from "react";

import {
  createRawMaterialSupplier,
  deleteRawMaterialSupplier,
  getRawMaterialSuppliers,
  updateRawMaterialSupplier,
} from "@/shared/lib/raw-material-supplier-api";

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
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
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

  function handleExport() {
    const header = ["ID", "Name", "Category", "Email", "Phone", "Rating"];
    const rows = filteredSuppliers.map((supplier) => [
      supplier.id,
      supplier.name,
      supplier.category,
      supplier.email,
      supplier.phone,
      supplier.rating,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "raw-material-suppliers.csv";
    link.click();
    URL.revokeObjectURL(url);
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
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[68px] pb-3 font-medium">ID</th>
                <th className="w-[19%] pb-3 font-medium">Name</th>
                <th className="w-[14%] pb-3 font-medium">Category</th>
                <th className="w-[19%] pb-3 font-medium">Email</th>
                <th className="w-[13%] pb-3 font-medium">Phone</th>
                <th className="w-[7%] pb-3 font-medium">Rating</th>
                <th className="w-[11%] pb-3 text-right font-medium">Actions</th>
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
                filteredSuppliers.map((supplier) => (
                  <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={supplier.recordId}>
                    <td className="py-4 font-semibold text-[#f7a614]">{supplier.id}</td>
                    <td className="py-4 pr-3">{supplier.name}</td>
                    <td className="py-4 pr-3">{supplier.category}</td>
                    <td className="py-4 pr-3 text-[#98a5bb]">{supplier.email}</td>
                    <td className="py-4 pr-3">{supplier.phone}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 text-[#f7a614]">
                        <StarIcon />
                        <span className="text-[#d7deea]">{supplier.rating}</span>
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-4">
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
    </section>
  );
}
