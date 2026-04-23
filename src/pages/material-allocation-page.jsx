import { useState } from "react";

const initialAllocations = [
  {
    id: "ALL-001",
    project: "PRJ-001",
    material: "Steel Rods",
    quantity: "200",
    date: "2026-04-12",
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

export function MaterialAllocationPage() {
  const [allocations, setAllocations] = useState(initialAllocations);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    project: "",
    material: "",
    quantity: "",
    date: "",
  });

  function openAllocateModal() {
    setIsAllocateModalOpen(true);
  }

  function closeAllocateModal() {
    setIsAllocateModalOpen(false);
    setFormValues({
      project: "",
      material: "",
      quantity: "",
      date: "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleAllocate(event) {
    event.preventDefault();
    const nextNumber = allocations.length + 1;
    const padded = String(nextNumber).padStart(3, "0");

    setAllocations((current) => [
      ...current,
      {
        id: `ALL-${padded}`,
        project: formValues.project,
        material: formValues.material,
        quantity: formValues.quantity,
        date: formValues.date,
      },
    ]);

    closeAllocateModal();
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
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
            onClick={openAllocateModal}
            type="button"
          >
            <PlusIcon />
            Allocate Material
          </button>
        </div>
      </div>

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
              {allocations.map((allocation) => (
                <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={allocation.id}>
                  <td className="py-4 font-semibold text-[#f7a614]">{allocation.id}</td>
                  <td className="py-4">{allocation.project}</td>
                  <td className="py-4">{allocation.material}</td>
                  <td className="py-4">{allocation.quantity}</td>
                  <td className="py-4 text-[#98a5bb]">{allocation.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                <span className="text-[14px] font-medium text-[#d6ddea]">Material *</span>
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
                <span className="text-[14px] font-medium text-[#d6ddea]">Date *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="date"
                  onChange={handleFormChange}
                  required
                  type="text"
                  value={formValues.date}
                />
              </label>

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeAllocateModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  type="submit"
                >
                  Allocate
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
