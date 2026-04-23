import { useState } from "react";

const initialProjects = [
  {
    id: "PRJ-001",
    name: "Industrial Valves Order",
    buyer: "ABC Corp",
    startDate: "2026-04-01",
    dueDate: "2026-05-01",
    status: "In Progress",
    progress: 65,
  },
  {
    id: "PRJ-002",
    name: "Steel Pipes Manufacturing",
    buyer: "XYZ Ltd",
    startDate: "2026-03-15",
    dueDate: "2026-04-15",
    status: "Completed",
    progress: 100,
  },
  {
    id: "PRJ-003",
    name: "Custom Fittings",
    buyer: "DEF Inc",
    startDate: "2026-04-10",
    dueDate: "2026-05-20",
    status: "Pending",
    progress: 20,
  },
];

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

export function ProjectsPage() {
  const [projects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("23-04-2024");
  const [dateTo, setDateTo] = useState("23-04-2024");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredProjects = projects.filter((project) => {
    const query = search.toLowerCase();
    return (
      project.id.toLowerCase().includes(query) ||
      project.name.toLowerCase().includes(query) ||
      project.buyer.toLowerCase().includes(query) ||
      project.status.toLowerCase().includes(query)
    );
  });

  function handleExport() {
    const header = ["Project ID", "Name", "Buyer", "Start Date", "Due Date", "Status", "Progress"];
    const rows = projects.map((project) => [
      project.id,
      project.name,
      project.buyer,
      project.startDate,
      project.dueDate,
      project.status,
      `${project.progress}%`,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "projects.csv";
    link.click();
    URL.revokeObjectURL(url);
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
        </div>
      </div>

      <div
        className={[
          "grid min-h-[560px] grid-cols-1 gap-0",
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
                  <th className="w-[90px] pb-3 font-medium">Project ID</th>
                  <th className="w-[26%] pb-3 font-medium">Name</th>
                  <th className="w-[15%] pb-3 font-medium">Buyer</th>
                  <th className="w-[14%] pb-3 font-medium">Start Date</th>
                  <th className="w-[14%] pb-3 font-medium">Due Date</th>
                  <th className="w-[14%] pb-3 font-medium">Status</th>
                  <th className="w-[120px] pb-3 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
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
                    <td className="py-4 font-semibold text-[#f7a614]">{project.id}</td>
                    <td className="py-4 pr-3">{project.name}</td>
                    <td className="py-4 pr-3">{project.buyer}</td>
                    <td className="py-4 text-[#98a5bb]">{project.startDate}</td>
                    <td className="py-4 text-[#98a5bb]">{project.dueDate}</td>
                    <td className="py-4">
                      <span
                        className={[
                          "inline-flex rounded-sm px-2 py-1 text-[11px] font-medium",
                          project.status === "In Progress" && "bg-[#1d3b63] text-[#69a7ff]",
                          project.status === "Completed" && "bg-[#57411f] text-[#f5b14e]",
                          project.status === "Pending" && "bg-[#5b3b21] text-[#f5a14e]",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-14 rounded-full bg-[#3a465b]">
                          <div className="h-1.5 rounded-full bg-[#f7a614]" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-[11px] text-[#7f8ea6]">{project.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {isDetailsOpen ? (
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
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Name</div>
                <div className="mt-2 text-[13px] text-[#d7deea]">{selectedProject.name}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Buyer</div>
                <div className="mt-2 text-[13px] text-[#d7deea]">{selectedProject.buyer}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Status</div>
                <div className="mt-2">
                  <span
                    className={[
                      "inline-flex rounded-sm px-2 py-1 text-[11px] font-medium",
                      selectedProject.status === "In Progress" && "bg-[#1d3b63] text-[#69a7ff]",
                      selectedProject.status === "Completed" && "bg-[#57411f] text-[#f5b14e]",
                      selectedProject.status === "Pending" && "bg-[#5b3b21] text-[#f5a14e]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {selectedProject.status}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Progress</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 flex-1 rounded-full bg-[#3a465b]">
                    <div className="h-1.5 rounded-full bg-[#f7a614]" style={{ width: `${selectedProject.progress}%` }} />
                  </div>
                  <span className="text-[11px] font-medium text-[#f7a614]">{selectedProject.progress}%</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8ea6]">Timeline</div>
                <div className="mt-2 text-[13px] text-[#d7deea]">
                  {selectedProject.startDate} - {selectedProject.dueDate}
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
