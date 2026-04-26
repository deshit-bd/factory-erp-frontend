import { useEffect, useState } from "react";

import { getProjectGoodsSuppliers } from "@/shared/lib/project-goods-supplier-api";
import { getProjects } from "@/shared/lib/project-api";
import { createSupplierAssignment, getSupplierAssignments, updateSupplierAssignmentStatus } from "@/shared/lib/supplier-assignment-api";

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

export function SupplierAssignmentPage() {
  const statusOptions = ["Pending", "Confirmed", "In Progress", "Completed"];
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingAssignmentId, setUpdatingAssignmentId] = useState(null);
  const [formValues, setFormValues] = useState({
    project: "",
    material: "",
    supplier: "",
    quantity: "",
    perUnitPrice: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadFormOptions() {
      try {
        const [assignmentRecords, projectRecords, supplierRecords] = await Promise.all([
          getSupplierAssignments(),
          getProjects(),
          getProjectGoodsSuppliers(),
        ]);

        if (isMounted) {
          setAssignments(assignmentRecords);
          setProjects(projectRecords);
          setSuppliers(supplierRecords);
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

    loadFormOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  function openAssignModal() {
    setErrorMessage("");
    setIsAssignModalOpen(true);
  }

  function closeAssignModal() {
    setIsAssignModalOpen(false);
    setFormValues({
      project: "",
      material: "",
      supplier: "",
      quantity: "",
      perUnitPrice: "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    if (name === "project") {
      const selectedProject = projects.find((project) => String(project.recordId) === value);
      setFormValues((current) => ({
        ...current,
        project: value,
        material: selectedProject?.name || "",
      }));
      return;
    }

    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleAssign(event) {
    event.preventDefault();
    const selectedSupplier = suppliers.find((supplier) => String(supplier.recordId) === formValues.supplier);

    setIsSubmitting(true);
    setErrorMessage("");

    createSupplierAssignment({
      projectId: formValues.project,
      product: formValues.material,
      supplier: selectedSupplier?.name || "",
      quantity: formValues.quantity,
      unitPrice: formValues.perUnitPrice,
    })
      .then((assignment) => {
        setAssignments((current) => [assignment, ...current]);
        closeAssignModal();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleStatusChange(recordId, status) {
    setUpdatingAssignmentId(recordId);
    setErrorMessage("");

    updateSupplierAssignmentStatus(recordId, status)
      .then((updatedAssignment) => {
        setAssignments((current) =>
          current.map((assignment) => (assignment.recordId === recordId ? updatedAssignment : assignment)),
        );
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setUpdatingAssignmentId(null);
      });
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Supplier Assignment</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Assign suppliers to project materials</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
            onClick={openAssignModal}
            type="button"
          >
            <PlusIcon />
            Assign Supplier
          </button>
        </div>
      </div>

      {errorMessage ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[14px] text-[#f7c8cf]">{errorMessage}</div> : null}

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[9%]" />
              <col className="w-[11%]" />
              <col className="w-[13%]" />
              <col className="w-[19%]" />
              <col className="w-[10%]" />
              <col className="w-[15%]" />
              <col className="w-[12%]" />
              <col className="w-[11%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Supplier</th>
                <th className="pb-3 font-medium">Quantity</th>
                <th className="pb-3 font-medium">Per Unit Price</th>
                <th className="pb-3 font-medium">Total Cost</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {pageLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={8}>
                    Loading assignment options...
                  </td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={8}>
                    No supplier assignments found.
                  </td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={assignment.id}>
                    <td className="truncate py-4 pr-3 font-semibold text-[#f7a614]">{assignment.id}</td>
                    <td className="truncate py-4 pr-3">{assignment.project}</td>
                    <td className="truncate py-4 pr-3">{assignment.product}</td>
                    <td className="truncate py-4 pr-3">{assignment.supplier}</td>
                    <td className="truncate py-4 pr-3">{assignment.quantity}</td>
                    <td className="truncate py-4 pr-3 font-semibold text-[#f7a614]">{assignment.perUnitPrice}</td>
                    <td className="truncate py-4 pr-3 font-semibold text-[#f7a614]">{assignment.totalCost}</td>
                    <td className="py-4">
                      <select
                        className="h-8 w-full rounded-sm border border-[#35527a] bg-[#1d3b63] px-2 text-[11px] font-medium text-[#69a7ff] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={updatingAssignmentId === assignment.recordId}
                        onChange={(event) => handleStatusChange(assignment.recordId, event.target.value)}
                        value={assignment.status}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>

      {isAssignModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[520px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">Assign Supplier</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeAssignModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleAssign}>
              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Project *</span>
                <select
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="project"
                  onChange={handleFormChange}
                  required
                  value={formValues.project}
                >
                  <option value="">Select project</option>
                  {projects.map((project) => (
                    <option key={project.recordId} value={project.recordId}>
                      {project.id} - {project.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Product *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#1e293b] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  readOnly
                  name="material"
                  required
                  type="text"
                  value={formValues.material}
                />
              </label>

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
                <span className="text-[14px] font-medium text-[#d6ddea]">Quantity *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="quantity"
                  onChange={handleFormChange}
                  required
                  type="number"
                  value={formValues.quantity}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Per Unit Price (৳) *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
                  name="perUnitPrice"
                  onChange={handleFormChange}
                  placeholder="0.00"
                  required
                  type="number"
                  value={formValues.perUnitPrice}
                />
              </label>

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeAssignModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting || pageLoading}
                  type="submit"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
