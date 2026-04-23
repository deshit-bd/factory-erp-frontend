import { useState } from "react";

const initialSuppliers = [
  {
    id: "SUP-001",
    name: "Metal Suppliers Inc",
    category: "Raw Materials",
    email: "contact@metalsup.com",
    phone: "+1-555-0100",
    rating: "4.5",
    paymentTerms: "Net 30",
    receipt: "Supplier Profile.pdf",
  },
  {
    id: "SUP-002",
    name: "Industrial Materials Co",
    category: "Raw Materials",
    email: "sales@indmat.com",
    phone: "+1-555-0101",
    rating: "4.2",
    paymentTerms: "Net 45",
    receipt: "Registration.pdf",
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

function UploadIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 16V5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M8 9l4-4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M5 19h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
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

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("23-04-2024");
  const [dateTo, setDateTo] = useState("23-04-2024");
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    category: "",
    email: "",
    phone: "",
    receiptName: "",
  });

  const filteredSuppliers = suppliers.filter((supplier) => {
    const query = search.toLowerCase();
    return (
      supplier.id.toLowerCase().includes(query) ||
      supplier.name.toLowerCase().includes(query) ||
      supplier.category.toLowerCase().includes(query) ||
      supplier.email.toLowerCase().includes(query) ||
      supplier.phone.toLowerCase().includes(query)
    );
  });

  function handleExport() {
    const header = ["ID", "Name", "Category", "Email", "Phone", "Rating", "Payment Terms", "Receipt"];
    const rows = suppliers.map((supplier) => [
      supplier.id,
      supplier.name,
      supplier.category,
      supplier.email,
      supplier.phone,
      supplier.rating,
      supplier.paymentTerms,
      supplier.receipt,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "suppliers.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openAddSupplierModal() {
    setEditingId(null);
    setFormValues({
      name: "",
      category: "",
      email: "",
      phone: "",
      receiptName: "",
    });
    setIsAddSupplierModalOpen(true);
  }

  function openEditSupplierModal(supplier) {
    setEditingId(supplier.id);
    setFormValues({
      name: supplier.name,
      category: supplier.category,
      email: supplier.email,
      phone: supplier.phone,
      receiptName: supplier.receipt,
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
      receiptName: "",
    });
  }

  function handleFormChange(event) {
    const { name, value, files, type } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: type === "file" ? files?.[0]?.name ?? "" : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId) {
      setSuppliers((current) =>
        current.map((supplier) =>
          supplier.id === editingId
            ? {
                ...supplier,
                name: formValues.name,
                category: formValues.category,
                email: formValues.email,
                phone: formValues.phone,
                receipt: formValues.receiptName || "No receipt",
              }
            : supplier,
        ),
      );
    } else {
      const nextNumber = suppliers.length + 1;
      const padded = String(nextNumber).padStart(3, "0");
      setSuppliers((current) => [
        ...current,
        {
          id: `SUP-${padded}`,
          name: formValues.name,
          category: formValues.category,
          email: formValues.email,
          phone: formValues.phone,
          rating: "4.0",
          paymentTerms: "Net 30",
          receipt: formValues.receiptName || "No receipt",
        },
      ]);
    }

    closeAddSupplierModal();
  }

  function handleDeleteSupplier(id) {
    setSuppliers((current) => current.filter((supplier) => supplier.id !== id));
  }

  function handleViewReceipt(receipt) {
    window.alert(receipt === "No receipt" ? "No receipt uploaded for this supplier." : `Receipt: ${receipt}`);
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Suppliers</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Manage supplier relationships</p>
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

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_140px_40px_140px]">
          <label className="flex h-11 items-center gap-3 rounded-md border border-[#334156] bg-[#243045] px-4 text-[#77879d]">
            <SearchIcon />
            <input
              className="w-full bg-transparent text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Suppliers..."
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

        <div className="mt-4 overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[68px] pb-3 font-medium">ID</th>
                <th className="w-[18%] pb-3 font-medium">Name</th>
                <th className="w-[12%] pb-3 font-medium">Category</th>
                <th className="w-[17%] pb-3 font-medium">Email</th>
                <th className="w-[12%] pb-3 font-medium">Phone</th>
                <th className="w-[7%] pb-3 font-medium">Rating</th>
                <th className="w-[14%] pb-3 font-medium">Payment Terms</th>
                <th className="w-[8%] pb-3 font-medium">Receipt</th>
                <th className="w-[9%] pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={supplier.id}>
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
                  <td className="py-4 text-[#d7deea]">{supplier.paymentTerms}</td>
                  <td className="py-4">
                    <button
                      className="text-[13px] font-medium text-[#f7a614] transition hover:text-[#ffc550]"
                      onClick={() => handleViewReceipt(supplier.receipt)}
                      type="button"
                    >
                      View
                    </button>
                  </td>
                  <td className="py-4">
                    <div className="flex justify-end gap-4">
                      <button className="text-[#d7deea] transition hover:text-white" onClick={() => openEditSupplierModal(supplier)} type="button">
                        <EditIcon />
                      </button>
                      <button
                        className="text-[#ef4444] transition hover:text-[#f87171]"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        type="button"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {isAddSupplierModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1422]/70 px-4 py-8">
          <div className="w-full max-w-[520px] overflow-hidden rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
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
                  type="text"
                  value={formValues.phone}
                />
              </label>

              <div className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Receipt (Optional)</span>
                <label className="flex h-[66px] w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#3a475c] bg-[#243045] px-4 text-[14px] text-[#8997ac] transition hover:border-[#4b5a72]">
                  <UploadIcon />
                  <span className="truncate">{formValues.receiptName || "Upload Image or PDF (Max 5MB)"}</span>
                  <input accept="image/*,.pdf" className="sr-only" name="receiptName" onChange={handleFormChange} type="file" />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeAddSupplierModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
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
