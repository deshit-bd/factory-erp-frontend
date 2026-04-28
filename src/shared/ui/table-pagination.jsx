export function TablePagination({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-[#314058] pt-4 md:flex-row md:items-center md:justify-between">
      <div className="text-[12px] text-[#98a5bb]">
        Showing {startItem}-{endItem} of {totalItems}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-[12px] text-[#98a5bb]">
          Rows
          <select
            className="h-9 rounded-md border border-[#334156] bg-[#243045] px-3 text-[12px] text-[#e6ebf4] outline-none"
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            value={pageSize}
          >
            {[10, 20, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-9 min-w-[76px] items-center justify-center rounded-md border border-[#334156] bg-[#243045] px-3 text-[12px] font-medium text-[#e6ebf4] transition hover:bg-[#2d3a50] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            type="button"
          >
            Previous
          </button>
          <div className="text-[12px] text-[#e6ebf4]">
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </div>
          <button
            className="inline-flex h-9 min-w-[76px] items-center justify-center rounded-md border border-[#334156] bg-[#243045] px-3 text-[12px] font-medium text-[#e6ebf4] transition hover:bg-[#2d3a50] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
