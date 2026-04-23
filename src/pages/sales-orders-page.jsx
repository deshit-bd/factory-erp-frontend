import { useState } from "react";

const initialOrders = [
  {
    id: "SO-001",
    date: "2026-04-10",
    buyer: "ABC Corp",
    product: "Industrial Valves",
    quantity: "500",
    unitPrice: "৳120",
    total: "৳60,000",
    status: "Confirmed",
  },
  {
    id: "SO-002",
    date: "2026-04-08",
    buyer: "XYZ Ltd",
    product: "Steel Pipes",
    quantity: "300",
    unitPrice: "৳85",
    total: "৳25,500",
    status: "Completed",
  },
];

const demoBuyers = ["ABC Corp", "XYZ Ltd", "Global Textiles", "Northern Garments", "Prime Exports"];

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

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
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

export function SalesOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("23-04-2024");
  const [dateTo, setDateTo] = useState("23-04-2024");
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    buyer: "",
    product: "",
    quantity: "",
    unitPrice: "",
    date: "",
  });

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.buyer.toLowerCase().includes(query) ||
      order.product.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
    );
  });

  function handleExport() {
    const header = ["Order ID", "Date", "Buyer", "Product", "Quantity", "Unit Price", "Total", "Status"];
    const rows = orders.map((order) => [
      order.id,
      order.date,
      order.buyer,
      order.product,
      order.quantity,
      order.unitPrice,
      order.total,
      order.status,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sales-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openCreateOrderModal() {
    setIsCreateOrderModalOpen(true);
  }

  function closeCreateOrderModal() {
    setIsCreateOrderModalOpen(false);
    setFormValues({
      buyer: "",
      product: "",
      quantity: "",
      unitPrice: "",
      date: "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleCreateOrder(event) {
    event.preventDefault();
    const nextNumber = orders.length + 1;
    const padded = String(nextNumber).padStart(3, "0");
    const quantity = Number(formValues.quantity || 0);
    const unitPrice = Number(formValues.unitPrice || 0);
    const total = quantity * unitPrice;

    setOrders((current) => [
      ...current,
      {
        id: `SO-${padded}`,
        date: formValues.date,
        buyer: formValues.buyer,
        product: formValues.product,
        quantity: String(quantity),
        unitPrice: `৳${unitPrice}`,
        total: `৳${total.toLocaleString("en-US")}`,
        status: "Confirmed",
      },
    ]);

    closeCreateOrderModal();
  }

  function handleDeleteOrder(id) {
    setOrders((current) => current.filter((order) => order.id !== id));
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Sales Orders</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Create and manage sales orders</p>
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
            onClick={openCreateOrderModal}
            type="button"
          >
            <PlusIcon />
            Create Order
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
              placeholder="Search Sellers..."
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

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[940px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[74px] pb-3 font-medium">Order ID</th>
                <th className="w-[98px] pb-3 font-medium">Date</th>
                <th className="w-[12%] pb-3 font-medium">Buyer</th>
                <th className="w-[18%] pb-3 font-medium">Product</th>
                <th className="w-[78px] pb-3 font-medium">Quantity</th>
                <th className="w-[88px] pb-3 font-medium">Unit Price</th>
                <th className="w-[98px] pb-3 font-medium">Total</th>
                <th className="w-[100px] pb-3 font-medium">Status</th>
                <th className="w-[76px] pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={order.id}>
                  <td className="py-4 font-semibold text-[#f7a614]">{order.id}</td>
                  <td className="py-4 text-[#98a5bb]">{order.date}</td>
                  <td className="py-4 pr-3">{order.buyer}</td>
                  <td className="py-4 pr-3">{order.product}</td>
                  <td className="py-4">{order.quantity}</td>
                  <td className="py-4">{order.unitPrice}</td>
                  <td className="py-4 font-semibold text-[#f7a614]">{order.total}</td>
                  <td className="py-4">
                    <span
                      className={[
                        "inline-flex rounded-sm px-2 py-1 text-[11px] font-medium",
                        order.status === "Confirmed" ? "bg-[#1d3b63] text-[#69a7ff]" : "bg-[#57411f] text-[#f5b14e]",
                      ].join(" ")}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex justify-end gap-4">
                      <button className="text-[#d7deea] transition hover:text-white" type="button">
                        <EditIcon />
                      </button>
                      <button
                        className="text-[#ef4444] transition hover:text-[#f87171]"
                        onClick={() => handleDeleteOrder(order.id)}
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

      {isCreateOrderModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[420px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[24px] font-semibold text-[#e6ebf4]">Create Sales Order</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeCreateOrderModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleCreateOrder}>
              <label className="block">
                <span className="mb-2 block text-[14px] text-[#d7deea]">Buyer *</span>
                <div className="relative">
                  <select
                    className="h-11 w-full appearance-none rounded-md border border-[#334156] bg-[#243045] px-4 pr-11 text-[14px] text-[#d6ddea] outline-none"
                    name="buyer"
                    onChange={handleFormChange}
                    required
                    value={formValues.buyer}
                  >
                    <option disabled value="">
                      Select buyer
                    </option>
                    {demoBuyers.map((buyer) => (
                      <option key={buyer} value={buyer}>
                        {buyer}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#97a5bc]">
                    <ChevronDownIcon />
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[14px] text-[#d7deea]">Product *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
                  name="product"
                  onChange={handleFormChange}
                  placeholder="Enter product name"
                  required
                  type="text"
                  value={formValues.product}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[14px] text-[#d7deea]">Quantity *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
                  name="quantity"
                  onChange={handleFormChange}
                  placeholder="Enter quantity"
                  required
                  type="number"
                  value={formValues.quantity}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[14px] text-[#d7deea]">Unit Price *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
                  name="unitPrice"
                  onChange={handleFormChange}
                  placeholder="Enter unit price"
                  required
                  type="number"
                  value={formValues.unitPrice}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[14px] text-[#d7deea]">Date *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
                  name="date"
                  onChange={handleFormChange}
                  required
                  type="date"
                  value={formValues.date}
                />
              </label>

              <div className="flex items-center justify-end gap-3 border-t border-[#314058] pt-4">
                <button
                  className="inline-flex h-10 items-center rounded-md px-4 text-[14px] font-medium text-[#d7deea] transition hover:text-white"
                  onClick={closeCreateOrderModal}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex h-10 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  type="submit"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
