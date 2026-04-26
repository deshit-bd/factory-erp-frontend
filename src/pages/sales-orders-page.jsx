import { useEffect, useState } from "react";

import { getBuyers } from "@/shared/lib/buyer-api";
import { createSalesOrder, deleteSalesOrder, getSalesOrders, updateSalesOrderStatus } from "@/shared/lib/sales-order-api";

const ORDER_STATUS_OPTIONS = ["Pending", "Confirmed", "In Progress", "Completed"];

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

function formatOrderDate(value) {
  if (!value) {
    return "";
  }

  return String(value).split("T")[0];
}

function isWithinDateRange(value, dateFrom, dateTo) {
  const normalizedValue = formatOrderDate(value);

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

function getStatusClasses(status) {
  if (status === "Completed") {
    return "bg-[#1f4f3c] text-[#68d8a3]";
  }

  if (status === "In Progress") {
    return "bg-[#1d3b63] text-[#69a7ff]";
  }

  if (status === "Confirmed") {
    return "bg-[#3c3158] text-[#b9a5ff]";
  }

  return "bg-[#57411f] text-[#f5b14e]";
}

export function SalesOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [buyerOptions, setBuyerOptions] = useState([]);
  const [buyersLoading, setBuyersLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updatingOrderIds, setUpdatingOrderIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    buyer: "",
    product: "",
    quantity: "",
    unitPrice: "",
    deliveryDate: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const salesOrders = await getSalesOrders();

        if (isMounted) {
          setOrders(salesOrders);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    }

    async function loadBuyers() {
      try {
        const buyers = await getBuyers();

        if (isMounted) {
          setBuyerOptions(buyers);
        }
      } catch {
        if (isMounted) {
          setBuyerOptions([]);
        }
      } finally {
        if (isMounted) {
          setBuyersLoading(false);
        }
      }
    }

    loadOrders();
    loadBuyers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(query) ||
      order.buyer.toLowerCase().includes(query) ||
      order.product.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query);

    return matchesSearch && isWithinDateRange(order.deliveryDate, dateFrom, dateTo);
  });

  function handleExport() {
    const header = ["Order ID", "Delivary Date", "Buyer", "Product", "Quantity", "Unit Price", "Total", "Status"];
    const rows = filteredOrders.map((order) => [
      order.id,
      formatOrderDate(order.deliveryDate),
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
    setErrorMessage("");
    setIsCreateOrderModalOpen(true);
  }

  function closeCreateOrderModal() {
    setIsCreateOrderModalOpen(false);
    setFormValues({
      buyer: "",
      product: "",
      quantity: "",
      unitPrice: "",
      deliveryDate: "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function handleCreateOrder(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const newOrder = await createSalesOrder({
        ...formValues,
        status: "Pending",
      });

      setOrders((current) => [newOrder, ...current]);
      closeCreateOrderModal();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteOrder(recordId) {
    try {
      setErrorMessage("");
      await deleteSalesOrder(recordId);
      setOrders((current) => current.filter((order) => order.recordId !== recordId));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleStatusChange(recordId, status) {
    try {
      setErrorMessage("");
      setUpdatingOrderIds((current) => [...current, recordId]);
      const updatedOrder = await updateSalesOrderStatus(recordId, status);
      setOrders((current) => current.map((order) => (order.recordId === recordId ? updatedOrder : order)));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setUpdatingOrderIds((current) => current.filter((id) => id !== recordId));
    }
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

      {errorMessage ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[14px] text-[#f7c8cf]">{errorMessage}</div> : null}

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

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[940px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[74px] pb-3 font-medium">Order ID</th>
                <th className="w-[98px] pb-3 font-medium">Delivary Date</th>
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
              {ordersLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={9}>
                    Loading sales orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={9}>
                    No sales orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={order.recordId}>
                  <td className="py-4 font-semibold text-[#f7a614]">{order.id}</td>
                    <td className="py-4 text-[#98a5bb]">{formatOrderDate(order.deliveryDate)}</td>
                    <td className="py-4 pr-3">{order.buyer}</td>
                    <td className="py-4 pr-3">{order.product}</td>
                    <td className="py-4">{order.quantity}</td>
                    <td className="py-4">{order.unitPrice}</td>
                    <td className="py-4 font-semibold text-[#f7a614]">{order.total}</td>
                    <td className="py-4">
                      <div className="relative">
                        <select
                          className={["h-9 w-full appearance-none rounded-md border border-transparent px-3 pr-9 text-[12px] font-medium outline-none", getStatusClasses(order.status)].join(" ")}
                          disabled={updatingOrderIds.includes(order.recordId)}
                          onChange={(event) => handleStatusChange(order.recordId, event.target.value)}
                          value={order.status}
                        >
                          {ORDER_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-current">
                          <ChevronDownIcon />
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-4">
                        <button className="text-[#d7deea] transition hover:text-white" type="button">
                          <EditIcon />
                        </button>
                        <button
                          className="text-[#ef4444] transition hover:text-[#f87171]"
                          onClick={() => handleDeleteOrder(order.recordId)}
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
                    disabled={buyersLoading}
                    name="buyer"
                    onChange={handleFormChange}
                    required
                    value={formValues.buyer}
                  >
                    <option disabled value="">
                      {buyersLoading ? "Loading buyers..." : "Select buyer"}
                    </option>
                    {buyerOptions.map((buyer) => (
                      <option key={buyer.recordId} value={buyer.company}>
                        {buyer.company}
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
                <span className="mb-2 block text-[14px] text-[#d7deea]">Delivery Date *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
                  name="deliveryDate"
                  onChange={handleFormChange}
                  required
                  type="date"
                  value={formValues.deliveryDate}
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
                  className="inline-flex h-10 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Creating..." : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
