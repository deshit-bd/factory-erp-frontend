import { useEffect, useState } from "react";

import { createBuyer, deleteBuyer, getBuyers, updateBuyer, updateBuyerStatus } from "@/shared/lib/buyer-api";
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

const initialFormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  address: "",
  country: "",
  status: "",
};
const fallbackCountryOptions = ["Bangladesh", "India", "United Kingdom", "United States"];

export function BuyerManagementPage() {
  const [buyers, setBuyers] = useState([]);
  const [countryOptions, setCountryOptions] = useState(fallbackCountryOptions);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddBuyerModalOpen, setIsAddBuyerModalOpen] = useState(false);
  const [editingBuyerId, setEditingBuyerId] = useState(null);
  const [formValues, setFormValues] = useState(initialFormValues);

  useEffect(() => {
    async function loadBuyers() {
      try {
        setErrorMessage("");
        const buyerList = await getBuyers();
        setBuyers(buyerList);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadBuyers();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCountries() {
      try {
        const response = await fetch("/countries.json");

        if (!response.ok) {
          throw new Error("Failed to load countries.");
        }

        const countries = await response.json();

        if (isMounted && Array.isArray(countries) && countries.length > 0) {
          setCountryOptions(countries);
        }
      } catch {
        // Keep the small fallback list when the JSON file is unavailable.
      }
    }

    loadCountries();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBuyers = buyers.filter((buyer) => {
    const query = search.toLowerCase();
    return (
      buyer.id.toLowerCase().includes(query) ||
      buyer.name.toLowerCase().includes(query) ||
      buyer.company.toLowerCase().includes(query) ||
      buyer.email.toLowerCase().includes(query) ||
      buyer.phone.toLowerCase().includes(query) ||
      buyer.country.toLowerCase().includes(query) ||
      buyer.status.toLowerCase().includes(query)
    );
  });
  const paginatedBuyers = getPaginatedRows(filteredBuyers, currentPage, pageSize);

  function openAddBuyerModal() {
    setEditingBuyerId(null);
    setFormValues(initialFormValues);
    setIsAddBuyerModalOpen(true);
  }

  function openEditBuyerModal(buyer) {
    setEditingBuyerId(buyer.recordId);
    setFormValues({
      name: buyer.name,
      company: buyer.company,
      email: buyer.email,
      phone: buyer.phone || "",
      address: buyer.address || "",
      country: buyer.country || "",
      status: buyer.status,
    });
    setIsAddBuyerModalOpen(true);
  }

  function closeAddBuyerModal() {
    setEditingBuyerId(null);
    setFormValues(initialFormValues);
    setIsAddBuyerModalOpen(false);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function handleAddBuyer(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (editingBuyerId) {
        const updatedBuyer = await updateBuyer(editingBuyerId, formValues);
        setBuyers((current) => current.map((buyer) => (buyer.recordId === editingBuyerId ? updatedBuyer : buyer)));
      } else {
        const newBuyer = await createBuyer(formValues);
        setBuyers((current) => [...current, newBuyer]);
      }

      closeAddBuyerModal();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleExport() {
    const header = ["ID", "Name", "Company", "Email", "Phone", "Country", "Status"];
    const rows = buyers.map((buyer) => [buyer.id, buyer.name, buyer.company, buyer.email, buyer.phone, buyer.country, buyer.status]);
    downloadCsvFile("buyers.csv", header, rows);
  }

  function handleDownloadPdf() {
    openTablePdfWindow({
      title: "Buyer Management",
      columns: ["ID", "Name", "Company", "Email", "Phone", "Country", "Status"],
      rows: filteredBuyers.map((buyer) => [buyer.id, buyer.name, buyer.company, buyer.email, buyer.phone, buyer.country, buyer.status]),
    });
  }

  async function handleDeleteBuyer(recordId) {
    try {
      setErrorMessage("");
      await deleteBuyer(recordId);
      setBuyers((current) => current.filter((buyer) => buyer.recordId !== recordId));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleToggleStatus(buyer) {
    const nextStatus = buyer.status === "Active" ? "Inactive" : "Active";

    try {
      setErrorMessage("");
      const updatedBuyer = await updateBuyerStatus(buyer.recordId, nextStatus);
      setBuyers((current) => current.map((item) => (item.recordId === buyer.recordId ? updatedBuyer : item)));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Buyer Management</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Manage customer and buyer information</p>
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
            onClick={openAddBuyerModal}
            type="button"
          >
            <PlusIcon />
            Add Buyer
          </button>
        </div>
      </div>

      {errorMessage ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[14px] text-[#f7c8cf]">{errorMessage}</div> : null}

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <label className="flex h-11 items-center gap-3 rounded-md border border-[#334156] bg-[#243045] px-4 text-[#77879d]">
          <SearchIcon />
          <input
            className="w-full bg-transparent text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search buyers..."
            type="text"
            value={search}
          />
        </label>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[90px] pb-3 font-medium">ID</th>
                <th className="w-[16%] pb-3 font-medium">Name</th>
                <th className="w-[14%] pb-3 font-medium">Company</th>
                <th className="w-[20%] pb-3 font-medium">Email</th>
                <th className="w-[14%] pb-3 font-medium">Phone</th>
                <th className="w-[11%] pb-3 font-medium">Country</th>
                <th className="w-[12%] pb-3 font-medium">Status</th>
                <th className="w-[90px] pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={8}>
                    Loading buyers...
                  </td>
                </tr>
              ) : filteredBuyers.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={8}>
                    No buyers found.
                  </td>
                </tr>
              ) : (
                paginatedBuyers.rows.map((buyer) => (
                  <tr className="border-b border-[#2d394d] text-[14px] text-[#d7deea]" key={buyer.recordId}>
                    <td className="py-4 font-semibold text-[#f7a614]">{buyer.id}</td>
                    <td className="py-4 pr-3">{buyer.name}</td>
                    <td className="py-4 pr-3 text-[#d7deea]">{buyer.company}</td>
                    <td className="py-4 pr-3 text-[#98a5bb]">{buyer.email}</td>
                    <td className="py-4 pr-3 text-[#d7deea]">{buyer.phone}</td>
                    <td className="py-4 pr-3 text-[#d7deea]">{buyer.country}</td>
                    <td className="py-4">
                      <button
                        className={[
                          "inline-flex rounded-sm px-2 py-1 text-[11px] font-medium",
                          buyer.status === "Active" ? "bg-[#6d4c1b] text-[#f5b14e]" : "bg-[#4a5568] text-[#cdd6e3]",
                        ].join(" ")}
                        onClick={() => handleToggleStatus(buyer)}
                        type="button"
                      >
                        {buyer.status}
                      </button>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          className="text-[#d7deea] transition hover:text-white"
                          onClick={() => openEditBuyerModal(buyer)}
                          type="button"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="text-[#ef4444] transition hover:text-[#f87171]"
                          onClick={() => handleDeleteBuyer(buyer.recordId)}
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

        {!isLoading && filteredBuyers.length > 0 ? (
          <TablePagination
            currentPage={paginatedBuyers.currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            pageSize={paginatedBuyers.pageSize}
            totalItems={paginatedBuyers.totalItems}
            totalPages={paginatedBuyers.totalPages}
          />
        ) : null}
      </article>

      {isAddBuyerModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[980px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[28px] font-semibold text-[#e6ebf4]">{editingBuyerId ? "Edit Buyer" : "Add New Buyer"}</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeAddBuyerModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleAddBuyer}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Name *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
                    name="name"
                    onChange={handleFormChange}
                    placeholder="Enter buyer name"
                    required
                    type="text"
                    value={formValues.name}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Company *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
                    name="company"
                    onChange={handleFormChange}
                    placeholder="Enter company name"
                    required
                    type="text"
                    value={formValues.company}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Email *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
                    name="email"
                    onChange={handleFormChange}
                    placeholder="Enter email address"
                    required
                    type="email"
                    value={formValues.email}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Phone</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
                    name="phone"
                    onChange={handleFormChange}
                    placeholder="Enter phone number"
                    type="text"
                    value={formValues.phone}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Address</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
                    name="address"
                    onChange={handleFormChange}
                    placeholder="Enter address"
                    type="text"
                    value={formValues.address}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Country</span>
                  <select
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none"
                    name="country"
                    onChange={handleFormChange}
                    value={formValues.country}
                  >
                    <option value="">Select country</option>
                    {countryOptions.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] text-[#d7deea]">Status *</span>
                  <select
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none"
                    name="status"
                    onChange={handleFormChange}
                    required
                    value={formValues.status}
                  >
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#314058] pt-4">
                <button
                  className="inline-flex h-10 items-center rounded-md px-4 text-[14px] font-medium text-[#d7deea] transition hover:text-white"
                  onClick={closeAddBuyerModal}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex h-10 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Saving..." : editingBuyerId ? "Save Buyer" : "Add Buyer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
