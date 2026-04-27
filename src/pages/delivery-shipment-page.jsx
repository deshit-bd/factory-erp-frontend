import { useEffect, useState } from "react";

import { getDeliveryShipments, updateDeliveryShipmentStatus } from "@/shared/lib/delivery-shipment-api";

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

function RefreshIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M20 12a8 8 0 10-2.34 5.66M20 12v6m0-6h-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function DeliveryShipmentPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDeliveries() {
      try {
        const records = await getDeliveryShipments();

        if (isMounted) {
          setDeliveries(records);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDeliveries();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDeliveries = deliveries.filter((item) => {
    if (item.deliveryStatus !== "Not Delivered") {
      return false;
    }

    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      item.id.toLowerCase().includes(query) ||
      item.projectId.toLowerCase().includes(query) ||
      item.buyer.toLowerCase().includes(query) ||
      item.product.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query) ||
      item.deliveryStatus.toLowerCase().includes(query)
    );
  });

  function handleExport() {
    const header = ["Delivery ID", "Project", "Buyer", "Product", "Quantity", "Delivery Date", "Status"];
    const rows = filteredDeliveries.map((item) => [
      item.id,
      item.projectId,
      item.buyer,
      item.product,
      item.quantity,
      item.date,
      item.deliveryStatus,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "delivery-shipment.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleRefresh() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const records = await getDeliveryShipments(search);
      setDeliveries(records);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeliver(recordId) {
    setUpdatingId(recordId);
    setErrorMessage("");

    try {
      const updatedDelivery = await updateDeliveryShipmentStatus(recordId, "Delivered");
      setDeliveries((current) =>
        current.map((item) => (item.recordId === recordId ? updatedDelivery : item)),
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Delivery & Shipment</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">
            Completed finished goods are automatically added here with default status Not Delivered. Delivered items move to Delivery History.
          </p>
        </div>

        <div className="flex flex-nowrap items-center gap-3 self-start lg:justify-end">
          <button
            className="inline-flex h-11 items-center gap-2 rounded-md border border-[#4a5a73] px-5 text-[14px] font-medium text-white transition hover:bg-[#4a5a73]/20"
            onClick={handleRefresh}
            type="button"
          >
            <RefreshIcon />
            Refresh
          </button>
          <button
            className="inline-flex h-11 items-center gap-2 rounded-md border border-[#f6a313] px-5 text-[14px] font-medium text-white transition hover:bg-[#f6a313]/10"
            onClick={handleExport}
            type="button"
          >
            <DownloadIcon />
            Export
          </button>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-md border border-[#7f3a3a] bg-[#3a2227] px-4 py-3 text-[14px] text-[#ffd7d7]">{errorMessage}</div>
      ) : null}

      <article className="rounded-md border border-[#314058] bg-[#222d40] px-4 py-4">
        <label className="flex h-11 items-center gap-3 rounded-md border border-[#334156] bg-[#243045] px-4 text-[#77879d]">
          <SearchIcon />
          <input
            className="w-full bg-transparent text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by delivery, project, buyer, product, date or status..."
            type="text"
            value={search}
          />
        </label>

        <div className="mt-4 overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[16%]" />
              <col className="w-[20%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="pb-3 font-medium">Delivery ID</th>
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Buyer</th>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Quantity</th>
                <th className="pb-3 font-medium">Delivery Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={8}>
                    Loading delivery shipments...
                  </td>
                </tr>
              ) : filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((item) => {
                  const isDelivered = item.deliveryStatus === "Delivered";
                  const isUpdating = updatingId === item.recordId;

                  return (
                    <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={item.recordId}>
                      <td className="py-4 font-semibold text-[#f7a614]">{item.id}</td>
                      <td className="py-4 font-semibold text-[#d7deea]">{item.projectId}</td>
                      <td className="py-4 pr-3 break-words">{item.buyer}</td>
                      <td className="py-4 pr-3 break-words">{item.product}</td>
                      <td className="py-4">{item.quantity}</td>
                      <td className="py-4 text-[#98a5bb]">{item.date}</td>
                      <td className="py-4">
                        <span
                          className={[
                            "inline-flex rounded-sm px-2 py-1 text-[11px] font-medium",
                            isDelivered ? "bg-[#1f5d35] text-[#d8ffe7]" : "bg-[#57411f] text-[#f5b14e]",
                          ].join(" ")}
                        >
                          {item.deliveryStatus}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end">
                          <button
                            className={[
                              "inline-flex min-w-[92px] items-center justify-center rounded-sm px-3 py-1.5 text-[12px] font-medium transition",
                              isDelivered
                                ? "cursor-not-allowed bg-[#1f5d35] text-[#d8ffe7]"
                                : "bg-[#f6a313] text-[#111827] hover:bg-[#ffb733]",
                            ].join(" ")}
                            disabled={isDelivered || isUpdating}
                            onClick={() => handleDeliver(item.recordId)}
                            type="button"
                          >
                            {isUpdating ? "Updating..." : isDelivered ? "Delivered" : "Deliver"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={8}>
                    No pending delivery shipments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
