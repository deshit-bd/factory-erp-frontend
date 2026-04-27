import { useEffect, useState } from "react";

import { getFactoryProductEntries } from "@/shared/lib/factory-product-tracking-api";
import { getProjects } from "@/shared/lib/project-api";
import { getSupplierProductsTracking } from "@/shared/lib/supplier-products-tracking-api";

function toQuantity(value) {
  const quantity = Number(value);
  return Number.isFinite(quantity) ? quantity : 0;
}

function isPassed(status) {
  return String(status || "").toLowerCase() === "pass";
}

function createFinishedGoodKey(projectRecordId, projectId, product) {
  return [projectRecordId || projectId || "project", String(product || "").trim().toLowerCase()].join("::");
}

function createFinishedGoods(supplierEntries, factoryEntries, projects) {
  const goodsByKey = new Map();
  const orderQuantityByProjectId = new Map(projects.map((project) => [String(project.recordId), toQuantity(project.totalOrderQuantity)]));

  function getGood({ projectRecordId, projectId, product }) {
    const key = createFinishedGoodKey(projectRecordId, projectId, product);

    if (!goodsByKey.has(key)) {
      goodsByKey.set(key, {
        projectRecordId: projectRecordId || "",
        product: product || "Unknown Product",
        project: projectId || "Unknown Project",
        supplierProduction: 0,
        factoryProduction: 0,
      });
    }

    return goodsByKey.get(key);
  }

  supplierEntries.filter((entry) => isPassed(entry.qualityStatus)).forEach((entry) => {
    const good = getGood({
      projectRecordId: entry.projectRecordId,
      projectId: entry.projectId,
      product: entry.product,
    });

    good.supplierProduction += toQuantity(entry.quantitySupplied);
  });

  factoryEntries.filter((entry) => isPassed(entry.qualityStatus)).forEach((entry) => {
    const good = getGood({
      projectRecordId: entry.projectRecordId,
      projectId: entry.projectId,
      product: entry.productName,
    });

    good.factoryProduction += toQuantity(entry.quantityProduced);
  });

  return Array.from(goodsByKey.values()).map((item, index) => {
    const totalProduction = item.supplierProduction + item.factoryProduction;
    const orderQuantity = orderQuantityByProjectId.get(String(item.projectRecordId)) || 0;

    return {
      ...item,
      id: `FG-${String(index + 1).padStart(3, "0")}`,
      supplierProduction: String(item.supplierProduction),
      factoryProduction: String(item.factoryProduction),
      totalProduction: String(totalProduction),
      projectOrderQuantity: String(orderQuantity),
      status: orderQuantity > 0 && totalProduction === orderQuantity ? "Complete" : "In Progress",
    };
  });
}

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

export function FinishedGoodsPage() {
  const [search, setSearch] = useState("");
  const [goods, setGoods] = useState([]);
  const [goodsLoading, setGoodsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadFinishedGoods() {
      try {
        const [supplierEntries, factoryEntries, projects] = await Promise.all([
          getSupplierProductsTracking(),
          getFactoryProductEntries(),
          getProjects(),
        ]);

        if (isMounted) {
          setGoods(createFinishedGoods(supplierEntries, factoryEntries, projects));
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setGoodsLoading(false);
        }
      }
    }

    loadFinishedGoods();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredGoods = goods.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.id.toLowerCase().includes(query) ||
      item.product.toLowerCase().includes(query) ||
      item.project.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    );
  });

  const totalProjects = new Set(goods.map((item) => item.project)).size;
  const inStock = goods.filter((item) => item.status === "Complete").length;

  function handleExport() {
    const header = [
      "ID",
      "Product",
      "Project",
      "Supplier Production",
      "Factory Production",
      "Total Production",
      "Project Order Quantity",
      "Status",
    ];
    const rows = goods.map((item) => [
      item.id,
      item.product,
      item.project,
      item.supplierProduction,
      item.factoryProduction,
      item.totalProduction,
      item.projectOrderQuantity,
      item.status,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "finished-goods-inventory.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Finished Goods Inventory</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">
            Quality Passed products ready for delivery (auto-synced from Production Tracking)
          </p>
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
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[14px] text-[#f7c8cf]">{errorMessage}</div>
      ) : null}

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article className="rounded-md border border-[#314058] bg-[#222d40] px-5 py-5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Total Project</div>
          <div className="mt-2 text-[34px] font-semibold leading-none text-[#e6ebf4]">{totalProjects}</div>
        </article>

        <article className="rounded-md border border-[#314058] bg-[#222d40] px-5 py-5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">In Stock</div>
          <div className="mt-2 text-[34px] font-semibold leading-none text-[#f7a614]">{inStock}</div>
        </article>
      </section>

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
          <table className="w-full min-w-[920px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                <th className="w-[8%] pb-3 font-medium">ID</th>
                <th className="w-[20%] pb-3 font-medium">Product</th>
                <th className="w-[9%] pb-3 font-medium">Project</th>
                <th className="w-[15%] pb-3 font-medium leading-[1.35]">Supplier Production</th>
                <th className="w-[15%] pb-3 font-medium leading-[1.35]">Factory Production</th>
                <th className="w-[13%] pb-3 font-medium leading-[1.35]">Total Production</th>
                <th className="w-[12%] pb-3 font-medium leading-[1.35]">Project Order Quantity</th>
                <th className="w-[10%] pb-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {goodsLoading ? (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={8}>
                    Loading finished goods...
                  </td>
                </tr>
              ) : filteredGoods.length > 0 ? (
                filteredGoods.map((item) => (
                  <tr className="border-b border-[#2d394d] text-[13px] text-[#d7deea]" key={item.id}>
                    <td className="py-4 font-semibold text-[#f7a614]">{item.id}</td>
                    <td className="py-4 pr-3">{item.product}</td>
                    <td className="py-4">{item.project}</td>
                    <td className="py-4">{item.supplierProduction}</td>
                    <td className="py-4">{item.factoryProduction}</td>
                    <td className="py-4 font-semibold text-[#f7a614]">{item.totalProduction}</td>
                    <td className="py-4 font-semibold text-[#f7a614]">{item.projectOrderQuantity}</td>
                    <td className="py-4 text-right">
                      <span
                        className={[
                          "inline-flex rounded-sm px-2 py-1 text-[11px] font-medium",
                          item.status === "Complete" ? "bg-transparent text-[#f7a614]" : "bg-transparent text-[#d7deea]",
                        ].join(" ")}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={8}>
                    No quality passed finished goods found.
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
