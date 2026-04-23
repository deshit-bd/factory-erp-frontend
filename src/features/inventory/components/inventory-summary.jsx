const items = [
  { label: "Raw materials", value: "1,240 units", status: "Healthy" },
  { label: "Packaging stock", value: "410 bundles", status: "Watchlist" },
  { label: "Finished goods", value: "960 cartons", status: "Balanced" },
];

export function InventorySummary() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-[#1d2d47]">Inventory feature</h2>
          <p className="mt-2 max-w-[320px] text-[13px] leading-6 text-[#607089]">
            Inventory-specific widgets stay grouped together under one feature folder.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#e6f1ee] px-3 py-1 text-[11px] font-bold text-[#267864]">
          Live sample
        </span>
      </div>

      {items.map((item) => (
        <article className="flex items-start justify-between gap-4" key={item.label}>
          <div>
            <strong className="text-[14px] font-bold text-[#1d2d47]">{item.label}</strong>
            <div className="mt-1 text-[13px] text-[#607089]">{item.value}</div>
          </div>
          <span className="inline-flex shrink-0 rounded-full bg-[#e6f1ee] px-3 py-1 text-[11px] font-bold text-[#267864]">
            {item.status}
          </span>
        </article>
      ))}
    </div>
  );
}
