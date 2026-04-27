import { useEffect, useState } from "react";

import {
  createFactoryProductEntry,
  getFactoryProductEntries,
  updateFactoryProductEntry,
} from "@/shared/lib/factory-product-tracking-api";
import { getProjects } from "@/shared/lib/project-api";
import { getRawMaterialAllocations } from "@/shared/lib/raw-material-allocation-api";
import { getSupplierAssignments } from "@/shared/lib/supplier-assignment-api";

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

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
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

function toQuantity(value) {
  const quantity = Number(value);
  return Number.isFinite(quantity) ? quantity : 0;
}

export function FactoryProductTrackingPage() {
  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [projectOptions, setProjectOptions] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [supplierAssignments, setSupplierAssignments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({
    project: "",
    productName: "",
    quantityProduced: "",
    qualityStatus: "",
    remarks: "",
    date: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadEntries() {
      try {
        const records = await getFactoryProductEntries();

        if (isMounted) {
          setEntries(records);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setEntriesLoading(false);
        }
      }
    }

    async function loadProjects() {
      try {
        const [projects, allocations, assignmentRecords] = await Promise.all([
          getProjects(),
          getRawMaterialAllocations(),
          getSupplierAssignments(),
        ]);
        const allocatedProjectIds = new Set(allocations.map((allocation) => String(allocation.projectId)));
        const allocatedProjects = projects.filter((project) => allocatedProjectIds.has(String(project.recordId)));

        if (isMounted) {
          setProjectOptions(allocatedProjects);
          setSupplierAssignments(assignmentRecords);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
          setProjectOptions([]);
          setSupplierAssignments([]);
        }
      } finally {
        if (isMounted) {
          setProjectsLoading(false);
        }
      }
    }

    loadEntries();
    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProject = projectOptions.find((project) => String(project.recordId) === formValues.project);
  const enteredQuantity = toQuantity(formValues.quantityProduced);
  const totalOrderQuantity = toQuantity(selectedProject?.totalOrderQuantity);
  const totalSupplierAssigned = selectedProject
    ? supplierAssignments
        .filter((assignment) => assignment.projectId === selectedProject.recordId)
        .reduce((total, assignment) => total + toQuantity(assignment.quantity), 0)
    : 0;
  const factoryProducedExcludingCurrent = selectedProject
    ? entries
        .filter((entry) => entry.projectRecordId === selectedProject.recordId && entry.recordId !== editingId)
        .reduce((total, entry) => total + toQuantity(entry.quantityProduced), 0)
    : 0;
  const remainingBeforeEntry = Math.max(totalOrderQuantity - totalSupplierAssigned - factoryProducedExcludingCurrent, 0);
  const remainingAfterEntry = Math.max(remainingBeforeEntry - enteredQuantity, 0);
  const hasProductionLimit = Boolean(selectedProject) && totalOrderQuantity > 0;
  const isQuantityUnavailable = Boolean(selectedProject) && totalOrderQuantity <= 0;
  const isQuantityOverLimit = hasProductionLimit && enteredQuantity > remainingBeforeEntry;

  function handleExport() {
    const header = ["ID", "Date", "Project ID", "Product Name", "Quantity Produced", "Quality Status", "Remarks"];
    const rows = entries.map((entry) => [
      entry.id,
      entry.date,
      entry.projectId,
      entry.productName,
      entry.quantityProduced,
      entry.qualityStatus,
      entry.remarks,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "factory-product-tracking.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openAddModal() {
    setErrorMessage("");
    setEditingId(null);
    setFormValues({
      project: "",
      productName: "",
      quantityProduced: "",
      qualityStatus: "",
      remarks: "",
      date: "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(entry) {
    setErrorMessage("");
    setEditingId(entry.recordId);
    setFormValues({
      project: String(entry.projectRecordId),
      productName: entry.productName,
      quantityProduced: entry.quantityProduced,
      qualityStatus: entry.qualityStatus,
      remarks: entry.remarks,
      date: entry.date,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setFormValues({
      project: "",
      productName: "",
      quantityProduced: "",
      qualityStatus: "",
      remarks: "",
      date: "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    if (name === "project") {
      const selectedProject = projectOptions.find((project) => String(project.recordId) === value);

      setFormValues((current) => ({
        ...current,
        project: value,
        productName: selectedProject?.name || "",
      }));
      return;
    }

    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isQuantityUnavailable) {
      setErrorMessage("No ordered quantity found for this project.");
      return;
    }

    if (isQuantityOverLimit) {
      setErrorMessage(`Quantity produced cannot exceed remaining quantity (${remainingBeforeEntry}).`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      date: formValues.date,
      projectId: formValues.project,
      quantityProduced: formValues.quantityProduced,
      qualityStatus: formValues.qualityStatus,
      remarks: formValues.remarks,
    };

    try {
      if (editingId) {
        const updatedEntry = await updateFactoryProductEntry(editingId, payload);
        setEntries((current) => current.map((entry) => (entry.recordId === editingId ? updatedEntry : entry)));
      } else {
        const newEntry = await createFactoryProductEntry(payload);
        setEntries((current) => [newEntry, ...current]);
      }

      closeModal();
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
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Factory Product Tracking</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Track factory-level production output with quality control</p>
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

      {errorMessage ? (
        <div className="rounded-md border border-[#7f3a3a] bg-[#3a2227] px-4 py-3 text-[14px] text-[#ffd7d7]">{errorMessage}</div>
      ) : null}

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[7%] pb-3 font-medium">ID</th>
                <th className="w-[11%] pb-3 font-medium">Date</th>
                <th className="w-[11%] pb-3 font-medium">Project ID</th>
                <th className="w-[16%] pb-3 font-medium">Product Name</th>
                <th className="w-[20%] pb-3 font-medium">Quantity Produced</th>
                <th className="w-[15%] pb-3 font-medium">Quality Status</th>
                <th className="w-[18%] pb-3 font-medium">Remarks</th>
                <th className="w-[8%] pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entriesLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={8}>
                    Loading factory product entries...
                  </td>
                </tr>
              ) : entries.length > 0 ? (
                entries.map((entry) => (
                  <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={entry.recordId}>
                    <td className="py-4 font-semibold text-[#f7a614]">{entry.id}</td>
                    <td className="py-4 text-[#98a5bb]">{entry.date}</td>
                    <td className="py-4">{entry.projectId}</td>
                    <td className="py-4 pr-3">{entry.productName}</td>
                    <td className="py-4">{entry.quantityProduced}</td>
                    <td className="py-4">
                      <span className="inline-flex rounded-sm bg-[#57411f] px-2 py-1 text-[11px] font-medium text-[#f5b14e]">
                        {entry.qualityStatus}
                      </span>
                    </td>
                    <td className="py-4 pr-3 text-[#aeb8c9]">{entry.remarks}</td>
                    <td className="py-4">
                      <div className="flex justify-end">
                        <button className="text-[#d7deea] transition hover:text-white" onClick={() => openEditModal(entry)} type="button">
                          <EditIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={8}>
                    No factory product entries found.
                  </td>
                </tr>
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
                {editingId ? "Edit Factory Product Entry" : "Add Factory Product Entry"}
              </h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Project *</span>
                  <div className="relative">
                    <select
                      className="h-11 w-full appearance-none rounded-md border border-[#334156] bg-[#243045] px-4 pr-11 text-[14px] text-[#e6ebf4] outline-none"
                      disabled={projectsLoading}
                      name="project"
                      onChange={handleFormChange}
                      required
                      value={formValues.project}
                    >
                      <option disabled value="">
                        {projectsLoading ? "Loading projects..." : "Select project"}
                      </option>
                      {projectOptions.map((project) => (
                        <option key={project.recordId} value={project.recordId}>
                          {project.id} - {project.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#97a5bc]">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Product Name *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="productName"
                    onChange={handleFormChange}
                    placeholder="Enter product name"
                    required
                    type="text"
                    value={formValues.productName}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Quantity Produced *</span>
                  <input
                    className={[
                      "h-11 w-full rounded-md border bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]",
                      isQuantityOverLimit ? "border-[#b94a4a]" : "border-[#334156]",
                    ].join(" ")}
                    max={hasProductionLimit ? remainingBeforeEntry : undefined}
                    min="1"
                    name="quantityProduced"
                    onChange={handleFormChange}
                    placeholder="Enter quantity"
                    required
                    type="number"
                    value={formValues.quantityProduced}
                  />
                  <span className={["block text-[12px]", isQuantityOverLimit ? "text-[#ffb4b4]" : "text-[#9aa6bb]"].join(" ")}>
                    {selectedProject
                      ? isQuantityOverLimit
                        ? `Only ${remainingBeforeEntry} remaining for this project.`
                        : isQuantityUnavailable
                          ? "No ordered quantity found for this project."
                          : formValues.quantityProduced
                            ? `${remainingAfterEntry} remaining after this entry.`
                            : `${remainingBeforeEntry} remaining for this project.`
                      : "Select a project to see remaining quantity."}
                  </span>
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Quality Status *</span>
                  <div className="relative">
                    <select
                      className="h-11 w-full appearance-none rounded-md border border-[#334156] bg-[#243045] px-4 pr-11 text-[14px] text-[#e6ebf4] outline-none"
                      name="qualityStatus"
                      onChange={handleFormChange}
                      required
                      value={formValues.qualityStatus}
                    >
                      <option disabled value="">
                        Select status
                      </option>
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#97a5bc]">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Remarks</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                    name="remarks"
                    onChange={handleFormChange}
                    placeholder="Optional remarks"
                    type="text"
                    value={formValues.remarks}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[#d6ddea]">Date</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                    name="date"
                    onChange={handleFormChange}
                    type="date"
                    value={formValues.date}
                  />
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
                  disabled={isSubmitting || isQuantityUnavailable || isQuantityOverLimit}
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733] disabled:cursor-not-allowed disabled:opacity-70"
                  type="submit"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Save Entry" : "Add Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
