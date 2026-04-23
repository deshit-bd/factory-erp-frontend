import { useState } from "react";

const initialAssignments = [
  {
    id: "ASN-001",
    project: "PRJ-001",
    material: "Steel Rods",
    supplier: "Metal Suppliers Inc",
    quantity: "500",
    perUnitPrice: "৳12.00",
    totalCost: "৳6000.00",
    status: "In Progress",
  },
];

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
  const [assignments, setAssignments] = useState(initialAssignments);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    project: "",
    material: "",
    supplier: "",
    quantity: "",
    perUnitPrice: "",
  });

  function openAssignModal() {
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
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleAssign(event) {
    event.preventDefault();
    const nextNumber = assignments.length + 1;
    const padded = String(nextNumber).padStart(3, "0");
    const quantity = Number(formValues.quantity || 0);
    const perUnitPrice = Number(formValues.perUnitPrice || 0);
    const totalCost = quantity * perUnitPrice;

    setAssignments((current) => [
      ...current,
      {
        id: `ASN-${padded}`,
        project: formValues.project,
        material: formValues.material,
        supplier: formValues.supplier,
        quantity: String(quantity),
        perUnitPrice: `৳${perUnitPrice.toFixed(2)}`,
        totalCost: `৳${totalCost.toFixed(2)}`,
        status: "In Progress",
      },
    ]);

    closeAssignModal();
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

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[9%] pb-3 font-medium">ID</th>
                <th className="w-[11%] pb-3 font-medium">Project</th>
                <th className="w-[13%] pb-3 font-medium">Material</th>
                <th className="w-[19%] pb-3 font-medium">Supplier</th>
                <th className="w-[10%] pb-3 font-medium">Quantity</th>
                <th className="w-[15%] pb-3 font-medium">Per Unit Price</th>
                <th className="w-[12%] pb-3 font-medium">Total Cost</th>
                <th className="w-[11%] pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={assignment.id}>
                  <td className="py-4 font-semibold text-[#f7a614]">{assignment.id}</td>
                  <td className="py-4">{assignment.project}</td>
                  <td className="py-4 pr-3">{assignment.material}</td>
                  <td className="py-4 pr-3">{assignment.supplier}</td>
                  <td className="py-4">{assignment.quantity}</td>
                  <td className="py-4 font-semibold text-[#f7a614]">{assignment.perUnitPrice}</td>
                  <td className="py-4 font-semibold text-[#f7a614]">{assignment.totalCost}</td>
                  <td className="py-4">
                    <span className="inline-flex rounded-sm bg-[#1d3b63] px-2 py-1 text-[11px] font-medium text-[#69a7ff]">
                      {assignment.status}
                    </span>
                  </td>
                </tr>
              ))}
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
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="project"
                  onChange={handleFormChange}
                  required
                  type="text"
                  value={formValues.project}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Product *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="material"
                  onChange={handleFormChange}
                  required
                  type="text"
                  value={formValues.material}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[#d6ddea]">Supplier *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="supplier"
                  onChange={handleFormChange}
                  required
                  type="text"
                  value={formValues.supplier}
                />
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
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
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
