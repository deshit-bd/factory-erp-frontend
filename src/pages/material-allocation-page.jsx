import { useEffect, useState } from "react";

import { getProjects } from "@/shared/lib/project-api";
import { createRawMaterialAllocation, getRawMaterialAllocations } from "@/shared/lib/raw-material-allocation-api";
import { getRawMaterialStocks } from "@/shared/lib/raw-material-stock-api";
import { downloadCsvFile, getPaginatedRows, openTablePdfWindow } from "@/shared/lib/table-export";
import { TablePagination } from "@/shared/ui/table-pagination";

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

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function MaterialAllocationPage() {
  const [allocations, setAllocations] = useState([]);
  const [allocationsLoading, setAllocationsLoading] = useState(true);
  const [projectOptions, setProjectOptions] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formValues, setFormValues] = useState({
    projectId: "",
    rawMaterialId: "",
    quantity: "",
    date: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadAllocations() {
      try {
        const records = await getRawMaterialAllocations();

        if (isMounted) {
          setAllocations(records);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setAllocationsLoading(false);
        }
      }
    }

    async function loadProjects() {
      try {
        const projects = await getProjects();

        if (isMounted) {
          setProjectOptions(projects);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
          setProjectOptions([]);
        }
      } finally {
        if (isMounted) {
          setProjectsLoading(false);
        }
      }
    }

    async function loadMaterials() {
      try {
        const materials = await getRawMaterialStocks();

        if (isMounted) {
          setMaterialOptions(materials);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
          setMaterialOptions([]);
        }
      } finally {
        if (isMounted) {
          setMaterialsLoading(false);
        }
      }
    }

    loadAllocations();
    loadProjects();
    loadMaterials();

    return () => {
      isMounted = false;
    };
  }, []);

  const paginatedAllocations = getPaginatedRows(allocations, currentPage, pageSize);

  function handleExport() {
    downloadCsvFile(
      "material-allocation.csv",
      ["Allocation ID", "Project", "Project Name", "Material", "Quantity", "Date"],
      allocations.map((allocation) => [allocation.id, allocation.project, allocation.projectName, allocation.material, allocation.quantity, allocation.date]),
    );
  }

  function handleDownloadPdf() {
    openTablePdfWindow({
      title: "Material Allocation",
      columns: ["Allocation ID", "Project", "Project Name", "Material", "Quantity", "Date"],
      rows: allocations.map((allocation) => [allocation.id, allocation.project, allocation.projectName, allocation.material, allocation.quantity, allocation.date]),
    });
  }

  function openAllocateModal() {
    setErrorMessage("");
    setIsAllocateModalOpen(true);
  }

  function closeAllocateModal() {
    setIsAllocateModalOpen(false);
    setFormValues({
      projectId: "",
      rawMaterialId: "",
      quantity: "",
      date: "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function handleAllocate(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const newAllocation = await createRawMaterialAllocation({
        projectId: formValues.projectId,
        rawMaterialId: formValues.rawMaterialId,
        quantity: formValues.quantity,
        date: formValues.date,
      });

      setAllocations((current) => [newAllocation, ...current]);
      const materials = await getRawMaterialStocks();
      setMaterialOptions(materials);
      closeAllocateModal();
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
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Material Allocation</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Allocate materials to projects</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex h-11 items-center gap-2 rounded-md border border-[#f6a313] px-5 text-[14px] font-medium text-white transition hover:bg-[#f6a313]/10"
            onClick={handleExport}
            type="button"
          >
            <PlusIcon />
            Export
          </button>
          <button
            className="inline-flex h-11 items-center gap-2 rounded-md border border-[#334156] px-5 text-[14px] font-medium text-white transition hover:bg-[#334156]/40"
            onClick={handleDownloadPdf}
            type="button"
          >
            <PlusIcon />
            Download PDF
          </button>
          <button
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
            onClick={openAllocateModal}
            type="button"
          >
            <PlusIcon />
            Allocate Material
          </button>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-md border border-[#7f3a3a] bg-[#3a2227] px-4 py-3 text-[14px] text-[#ffd7d7]">{errorMessage}</div>
      ) : null}

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[26%] pb-3 font-medium">Allocation ID</th>
                <th className="w-[16%] pb-3 font-medium">Project</th>
                <th className="w-[18%] pb-3 font-medium">Material</th>
                <th className="w-[18%] pb-3 font-medium">Quantity</th>
                <th className="w-[22%] pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {allocationsLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={5}>
                    Loading allocations...
                  </td>
                </tr>
              ) : allocations.length > 0 ? (
                paginatedAllocations.rows.map((allocation) => (
                  <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={allocation.recordId}>
                    <td className="py-4 font-semibold text-[#f7a614]">{allocation.id}</td>
                    <td className="py-4">
                      <div className="font-medium text-[#e6ebf4]">{allocation.project}</div>
                      {allocation.projectName ? <div className="mt-1 text-[12px] text-[#98a5bb]">{allocation.projectName}</div> : null}
                    </td>
                    <td className="py-4">{allocation.material}</td>
                    <td className="py-4">{allocation.quantity}</td>
                    <td className="py-4 text-[#98a5bb]">{allocation.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={5}>
                    No material allocations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!allocationsLoading && allocations.length > 0 ? (
          <TablePagination
            currentPage={paginatedAllocations.currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            pageSize={paginatedAllocations.pageSize}
            totalItems={paginatedAllocations.totalItems}
            totalPages={paginatedAllocations.totalPages}
          />
        ) : null}
      </article>

      {isAllocateModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[520px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">Allocate Material</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeAllocateModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleAllocate}>
              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Project *</span>
                <div className="relative">
                  <select
                    className="h-11 w-full appearance-none rounded-md border border-[#334156] bg-[#243045] px-4 pr-11 text-[14px] text-[#e6ebf4] outline-none"
                    disabled={projectsLoading}
                    name="projectId"
                    onChange={handleFormChange}
                    required
                    value={formValues.projectId}
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
                <span className="text-[14px] font-medium text-[#d6ddea]">Material *</span>
                <div className="relative">
                  <select
                    className="h-11 w-full appearance-none rounded-md border border-[#334156] bg-[#243045] px-4 pr-11 text-[14px] text-[#e6ebf4] outline-none"
                    disabled={materialsLoading}
                    name="rawMaterialId"
                    onChange={handleFormChange}
                    required
                    value={formValues.rawMaterialId}
                  >
                    <option disabled value="">
                      {materialsLoading ? "Loading materials..." : "Select material"}
                    </option>
                    {materialOptions.map((material) => (
                      <option key={material.recordId} value={material.recordId}>
                        {material.material} - Stock: {material.currentStock}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#97a5bc]">
                    <ChevronDownIcon />
                  </span>
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Quantity *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="quantity"
                  onChange={handleFormChange}
                  required
                  min="1"
                  type="number"
                  value={formValues.quantity}
                />
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

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeAllocateModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Allocating..." : "Allocate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
