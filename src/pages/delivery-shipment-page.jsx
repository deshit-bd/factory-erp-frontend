import { useState } from "react";

const initialDeliveries = [
  {
    id: "DEL-001",
    project: "PRJ-002",
    buyer: "XYZ Ltd",
    quantity: "300",
    date: "2026-04-13",
    delivered: false,
  },
  {
    id: "DEL-002",
    project: "PRJ-002",
    buyer: "XYZ Ltd",
    quantity: "300",
    date: "2026-04-13",
    delivered: false,
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

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function DeliveryShipmentPage() {
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formValues, setFormValues] = useState({
    project: "",
    buyer: "",
    quantity: "",
    date: "",
  });

  const filteredDeliveries = deliveries.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.id.toLowerCase().includes(query) ||
      item.project.toLowerCase().includes(query) ||
      item.buyer.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query)
    );
  });

  function handleExport() {
    const header = ["Delivery ID", "Project", "Buyer", "Quantity", "Date", "Delivered"];
    const rows = deliveries.map((item) => [item.id, item.project, item.buyer, item.quantity, item.date, item.delivered ? "Yes" : "No"]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "delivery-shipment.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openCreateModal() {
    setSelectedId(null);
    setFormValues({
      project: "",
      buyer: "",
      quantity: "",
      date: "",
    });
    setIsModalOpen(true);
  }

  function openModal(delivery) {
    setSelectedId(delivery.id);
    setFormValues({
      project: delivery.project,
      buyer: delivery.buyer,
      quantity: delivery.quantity,
      date: delivery.date,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedId(null);
    setFormValues({
      project: "",
      buyer: "",
      quantity: "",
      date: "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (selectedId) {
      setDeliveries((current) =>
        current.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                project: formValues.project,
                buyer: formValues.buyer,
                quantity: formValues.quantity,
                date: formValues.date,
                delivered: true,
              }
            : item,
        ),
      );
    } else {
      const nextNumber = deliveries.length + 1;
      const padded = String(nextNumber).padStart(3, "0");

      setDeliveries((current) => [
        ...current,
        {
          id: `DEL-${padded}`,
          project: formValues.project,
          buyer: formValues.buyer,
          quantity: formValues.quantity,
          date: formValues.date,
          delivered: true,
        },
      ]);
    }

    closeModal();
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Delivery & Shipment</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Manage product deliveries and shipments</p>
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
            onClick={openCreateModal}
            type="button"
          >
            <PlusIcon />
            Create Delivery
          </button>
        </div>
      </div>

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <label className="flex h-11 items-center gap-3 rounded-md border border-[#334156] bg-[#243045] px-4 text-[#77879d]">
          <SearchIcon />
          <input
            className="w-full bg-transparent text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search..."
            type="text"
            value={search}
          />
        </label>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[14%] pb-3 font-medium">Delivery ID</th>
                <th className="w-[16%] pb-3 font-medium">Project</th>
                <th className="w-[18%] pb-3 font-medium">Buyer</th>
                <th className="w-[16%] pb-3 font-medium">Quantity</th>
                <th className="w-[16%] pb-3 font-medium">Date</th>
                <th className="w-[20%] pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((item) => (
                <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={item.id}>
                  <td className="py-4 font-semibold text-[#f7a614]">{item.id}</td>
                  <td className="py-4 font-semibold text-[#d7deea]">{item.project}</td>
                  <td className="py-4 pr-3">{item.buyer}</td>
                  <td className="py-4">{item.quantity}</td>
                  <td className="py-4 text-[#98a5bb]">{item.date}</td>
                  <td className="py-4">
                    <button
                      className={[
                        "inline-flex min-w-[68px] items-center justify-center rounded-sm px-3 py-1.5 text-[12px] font-medium transition",
                        item.delivered
                          ? "bg-[#1f5d35] text-[#d8ffe7] hover:bg-[#267043]"
                          : "bg-[#f6a313] text-[#111827] hover:bg-[#ffb733]",
                      ].join(" ")}
                      onClick={() => openModal(item)}
                      type="button"
                    >
                      {item.delivered ? "Done" : "Deliver"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[520px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">Create Delivery</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
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
                <span className="text-[14px] font-medium text-[#d6ddea]">Buyer *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
                  name="buyer"
                  onChange={handleFormChange}
                  required
                  type="text"
                  value={formValues.buyer}
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
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  type="submit"
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
