import { Link } from "react-router-dom";

import { PageShell } from "@/shared/ui/page-shell";

export function NotFoundPage() {
  return (
    <PageShell>
      <section className="flex flex-col gap-4 rounded-[18px] border border-[#dde4e8] bg-white px-5 py-5 shadow-[0_18px_60px_rgba(111,141,151,0.18)] sm:px-6 sm:py-6">
        <span className="inline-flex w-fit rounded-full bg-[#e8f2f5] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1f7a98]">
          404
        </span>
        <h1 className="text-4xl font-black leading-none tracking-[-0.03em] text-[#1d2d47] sm:text-5xl">
          Page not found.
        </h1>
        <p className="text-base text-[#607089]">This route has not been added yet.</p>
        <Link
          className="inline-flex w-fit rounded-full bg-[#e6f1ee] px-3 py-1 text-[12px] font-bold text-[#267864]"
          to="/"
        >
          Back to dashboard
        </Link>
      </section>
    </PageShell>
  );
}
