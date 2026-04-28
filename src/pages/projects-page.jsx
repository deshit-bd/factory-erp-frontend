import { useEffect, useState } from "react";

import { getProjects } from "@/shared/lib/project-api";
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

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M10 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function formatProjectDate(value) {
  if (!value) {
    return "";
  }

  return String(value).split("T")[0];
}

function getProjectStatusClasses(status) {
  if (status === "Completed") {
    return "bg-[#1f4f3c] text-[#68d8a3]";
  }

  if (status === "Confirmed") {
    return "bg-[#57411f] text-[#f5b14e]";
  }

  return "bg-[#1d3b63] text-[#69a7ff]";
}

function getProgressValue(progress) {
  const value = Number(progress);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 100);
}

function getProgressBarClasses(status) {
  return status === "Completed" ? "bg-[#22c55e]" : "bg-[#f7a614]";
}

export function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("23-04-2024");
  const [dateTo, setDateTo] = useState("23-04-2024");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const records = await getProjects();

        if (isMounted) {
          setProjects(records);
          setSelectedProject((current) => records.find((project) => project.recordId === current?.recordId) || current);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setProjectsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = projects.filter((project) => {
    const query = search.toLowerCase();
    return (
      project.id.toLowerCase().includes(query) ||
      project.name.toLowerCase().includes(query) ||
      project.product.toLowerCase().includes(query) ||
      project.totalOrderQuantity.toLowerCase().includes(query) ||
      project.buyer.toLowerCase().includes(query) ||
      project.status.toLowerCase().includes(query)
    );
  });
  const paginatedProjects = getPaginatedRows(filteredProjects, currentPage, pageSize);

  function handleExport() {
    downloadCsvFile(
      "projects.csv",
      ["Project ID", "Product", "Quantity", "Buyer", "Start Date", "Delivery Date", "Status", "Progress"],
      filteredProjects.map((project) => [
        project.id,
        project.product,
        project.totalOrderQuantity,
        project.buyer,
        formatProjectDate(project.startDate),
        formatProjectDate(project.deliveryDate),
        project.status,
        `${project.progress}%`,
      ]),
    );
  }

  function handleDownloadPdf() {
    openTablePdfWindow({
      title: "Projects",
      columns: ["Project ID", "Product", "Quantity", "Buyer", "Start Date", "Delivery Date", "Status", "Progress"],
      rows: filteredProjects.map((project) => [
        project.id,
        project.product,
        project.totalOrderQuantity,
        project.buyer,
        formatProjectDate(project.startDate),
        formatProjectDate(project.deliveryDate),
        project.status,
        `${project.progress}%`,
      ]),
    });
  }

  return (
    <section className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[34px] font-semibold leading-none text-[#e6ebf4]">Projects</h2>
          <p className="mt-3 text-[15px] text-[#8f9cb0]">Track and manage production projects</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="flex h-11 items-center justify-between rounded-md border border-[#334156] bg-[#161f31] px-4 text-[12px] text-[#d6ddea]"
            onClick={() => setDateFrom("23-04-2024")}
            type="button"
          >
            <span>{dateFrom}</span>
            <ChevronRightIcon />
          </button>

          <div className="flex h-11 items-center justify-center px-2 text-[12px] text-[#9aa6bb]">to</div>

          <button
            className="flex h-11 items-center justify-between rounded-md border border-[#334156] bg-[#161f31] px-4 text-[12px] text-[#d6ddea]"
            onClick={() => setDateTo("23-04-2024")}
            type="button"
          >
            <span>{dateTo}</span>
            <ChevronRightIcon />
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

      {errorMessage ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[14px] text-[#f7c8cf]">{errorMessage}</div> : null}

      <div
        className={[
          "grid grid-cols-1 gap-0",
          isDetailsOpen ? "xl:grid-cols-[minmax(0,1fr)_310px]" : "xl:grid-cols-1",
        ].join(" ")}
      >
        <article className={["border border-[#314058] bg-[#222d40] px-4 py-4", isDetailsOpen ? "rounded-l-md xl:rounded-r-none" : "rounded-md"].join(" ")}>
          <label className="flex h-11 items-center gap-3 rounded-md border border-[#334156] bg-[#243045] px-4 text-[#77879d]">
            <SearchIcon />
            <input
              className="w-full bg-transparent text-[14px] text-[#d6ddea] outline-none placeholder:text-[#77879d]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search project..."
              type="text"
              value={search}
            />
          </label>

          <div className="mt-4 overflow-hidden">
            <table className="w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="border-b border-[#314058] text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">
                  <th className="w-[13%] pb-3 pr-4 font-medium">Project ID</th>
                  <th className="w-[16%] pb-3 pr-4 font-medium">Product</th>
                  <th className="w-[9%] pb-3 pr-4 font-medium">Quantity</th>
                  <th className="w-[13%] pb-3 pr-4 font-medium">Buyer</th>
                  <th className="w-[13%] pb-3 pr-4 font-medium">Start Date</th>
                  <th className="w-[14%] pb-3 pr-4 font-medium">Delivery Date</th>
                  <th className="w-[10%] pb-3 pr-4 font-medium">Status</th>
                  <th className="w-[12%] pb-3 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {projectsLoading ? (
                  <tr>
                    <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={8}>
                      Loading projects...
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td className="py-8 text-center text-[14px] text-[#93a0b4]" colSpan={8}>
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.rows.map((project) => {
                    const progress = getProgressValue(project.progress);

                    return (
                      <tr
                        className={[
                          "cursor-pointer border-b border-[#2d394d] text-[13px] text-[#d7deea] transition",
                          selectedProject?.id === project.id && isDetailsOpen ? "bg-[#1b2434]" : "hover:bg-[#263248]/35",
                        ].join(" ")}
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <td className="truncate py-4 pr-4 font-semibold text-[#f7a614]">{project.id}</td>
                        <td className="truncate py-4 pr-4">{project.product}</td>
                        <td className="py-4 pr-4">{project.totalOrderQuantity}</td>
                        <td className="truncate py-4 pr-4">{project.buyer}</td>
                        <td className="py-4 pr-4 text-[#98a5bb]">{formatProjectDate(project.startDate)}</td>
                        <td className="py-4 pr-4 text-[#98a5bb]">{formatProjectDate(project.deliveryDate)}</td>
                        <td className="py-4 pr-4">
                          <span className={["inline-flex rounded-sm px-2 py-1 text-[11px] font-medium", getProjectStatusClasses(project.status)].join(" ")}>
                            {project.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 rounded-full bg-[#3a465b]">
                              <div
                                className={["h-2 rounded-full", getProgressBarClasses(project.status)].join(" ")}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="w-8 text-right text-[11px] font-medium text-[#d7deea]">{progress}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!projectsLoading ? (
            <TablePagination
              currentPage={paginatedProjects.currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
              pageSize={paginatedProjects.pageSize}
              totalItems={paginatedProjects.totalItems}
              totalPages={paginatedProjects.totalPages}
            />
          ) : null}
        </article>

        {isDetailsOpen && selectedProject ? (
          <aside className="border border-[#314058] bg-[#263248] px-5 py-4 xl:border-l-0 xl:rounded-r-md xl:rounded-l-none">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#e6ebf4]">Project Details</h3>
              <button
                className="text-[#7f8ea6] transition hover:text-white"
                onClick={() => setIsDetailsOpen(false)}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Project ID</div>
                <div className="mt-2 text-[13px] font-semibold text-[#f7a614]">{selectedProject.id}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Product</div>
                <div className="mt-2 text-[13px] text-[#d7deea]">{selectedProject.product}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Quantity</div>
                <div className="mt-2 text-[13px] text-[#d7deea]">{selectedProject.totalOrderQuantity}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Buyer</div>
                <div className="mt-2 text-[13px] text-[#d7deea]">{selectedProject.buyer}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Status</div>
                <div className="mt-2">
                  <span className={["inline-flex rounded-sm px-2 py-1 text-[11px] font-medium", getProjectStatusClasses(selectedProject.status)].join(" ")}>
                    {selectedProject.status}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Progress</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 flex-1 rounded-full bg-[#3a465b]">
                    <div
                      className={["h-1.5 rounded-full", getProgressBarClasses(selectedProject.status)].join(" ")}
                      style={{ width: `${getProgressValue(selectedProject.progress)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#f7a614]">{getProgressValue(selectedProject.progress)}%</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Timeline</div>
                <div className="mt-2 text-[13px] text-[#d7deea]">
                  {formatProjectDate(selectedProject.startDate)} - {formatProjectDate(selectedProject.deliveryDate)}
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
