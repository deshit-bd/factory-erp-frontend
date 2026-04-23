import { formatNumber } from "@/shared/lib/format-number";

const stats = [
  { label: "Open orders", value: 128 },
  { label: "Production units", value: 4800 },
  { label: "Late deliveries", value: 6 },
];

export function DashboardOverview() {
  return (
    <div>
      <span className="inline-flex items-center rounded-full bg-[#e8f2f5] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1f7a98]">
        Factory ERP
      </span>
      <h1 className="mt-4 max-w-[640px] text-[42px] font-black leading-[0.98] tracking-[-0.03em] text-[#1d2d47] sm:text-[58px]">
        Feature-based architecture, ready for real modules.
      </h1>
      <p className="mt-4 max-w-[620px] text-[14px] leading-7 text-[#607089]">
        The app layer stays thin, business logic lives inside features, and shared code is kept generic.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((item) => (
          <article
            className="rounded-2xl border border-[#d9e2e6] bg-linear-to-b from-white to-[#edf4f1] px-4 py-3"
            key={item.label}
          >
            <span className="text-[13px] text-[#66768d]">{item.label}</span>
            <strong className="mt-1 block text-[18px] font-extrabold text-[#1d2d47]">
              {formatNumber(item.value)}
            </strong>
          </article>
        ))}
      </div>
    </div>
  );
}
