import { useEffect, useState } from "react";

import { getDeliveryShipments } from "@/shared/lib/delivery-shipment-api";
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

export function DeliveryHistoryPage() {
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      try {
        const records = await getDeliveryShipments();

        if (isMounted) {
          setHistory(records.filter((item) => item.deliveryStatus === "Delivered"));
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

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredHistory = history.filter((item) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      item.id.toLowerCase().includes(query) ||
      item.projectId.toLowerCase().includes(query) ||
      item.buyer.toLowerCase().includes(query) ||
      item.product.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query)
    );
  });
  const paginatedHistory = getPaginatedRows(filteredHistory, currentPage, pageSize);

  function handleExport() {
    downloadCsvFile(
      "delivery-history.csv",
      ["Delivery ID", "Project", "Buyer", "Product", "Quantity", "Date", "Status"],
      filteredHistory.map((item) => [item.id, item.projectId, item.buyer, item.product, item.quantity, item.date, item.deliveryStatus]),
    );
  }

  function handleDownloadPdf() {
    openTablePdfWindow({
      title: "Delivery History",
      columns: ["Delivery ID", "Project", "Buyer", "Product", "Quantity", "Date", "Status"],
      rows: filteredHistory.map((item) => [item.id, item.projectId, item.buyer, item.product, item.quantity, item.date, item.deliveryStatus]),
    });
  }

  async function handleRefresh() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const records = await getDeliveryShipments(search);
      setHistory(records.filter((item) => item.deliveryStatus === "Delivered"));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Delivery History</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Shows only delivered products.</p>
        </div>

        <div className="flex flex-wrap gap-3">
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
          <button
            className="inline-flex h-11 items-center gap-2 rounded-md border border-[#334156] px-5 text-[14px] font-medium text-white transition hover:bg-[#334156]/40"
            onClick={handleDownloadPdf}
            type="button"
          >
            <DownloadIcon />
            Download PDF
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
            placeholder="Search delivered products..."
            type="text"
            value={search}
          />
        </label>

        <div className="mt-4 overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[17%]" />
              <col className="w-[20%]" />
              <col className="w-[11%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="pb-3 font-medium">Delivery ID</th>
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Buyer</th>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Quantity</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={7}>
                    Loading delivery history...
                  </td>
                </tr>
              ) : filteredHistory.length > 0 ? (
                paginatedHistory.rows.map((item) => (
                  <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={item.recordId}>
                    <td className="py-4 font-semibold text-[#f7a614]">{item.id}</td>
                    <td className="py-4 font-semibold text-[#d7deea]">{item.projectId}</td>
                    <td className="py-4 pr-3 break-words">{item.buyer}</td>
                    <td className="py-4 pr-3 break-words">{item.product}</td>
                    <td className="py-4">{item.quantity}</td>
                    <td className="py-4 text-[#98a5bb]">{item.date}</td>
                    <td className="py-4">
                      <span className="inline-flex rounded-sm bg-[#1f5d35] px-2 py-1 text-[11px] font-medium text-[#d8ffe7]">
                        {item.deliveryStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={7}>
                    No delivered products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading ? (
          <TablePagination
            currentPage={paginatedHistory.currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            pageSize={paginatedHistory.pageSize}
            totalItems={paginatedHistory.totalItems}
            totalPages={paginatedHistory.totalPages}
          />
        ) : null}
      </article>
    </section>
  );
}
