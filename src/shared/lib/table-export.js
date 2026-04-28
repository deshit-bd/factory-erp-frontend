function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeCsvCell(value) {
  const text = String(value ?? "");

  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

export function downloadCsvFile(filename, header, rows) {
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell)).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function openTablePdfWindow({ title, columns, rows, autoPrint = true }) {
  const printWindow = window.open("", "_blank", "width=1120,height=800");

  if (!printWindow) {
    return false;
  }

  const tableHeader = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td>${escapeHtml(cell)}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  printWindow.document.open();
  printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 24px;
        background: #f3f4f6;
        color: #0f172a;
        font-family: Arial, Helvetica, sans-serif;
      }
      .sheet {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #cbd5e1;
        padding: 18mm 14mm;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 18px;
        border-bottom: 2px solid #0f172a;
        padding-bottom: 12px;
      }
      .brand {
        font-size: 24px;
        font-weight: 700;
        color: #d97706;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .subtitle {
        margin-top: 6px;
        font-size: 12px;
        color: #475569;
      }
      .title {
        font-size: 22px;
        font-weight: 700;
        text-align: right;
        color: #0f172a;
      }
      .meta {
        margin-top: 6px;
        font-size: 12px;
        color: #64748b;
        text-align: right;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
      }
      th {
        background: #e2e8f0;
        color: #334155;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        text-align: left;
        padding: 10px 12px;
        border: 1px solid #cbd5e1;
      }
      td {
        font-size: 12px;
        padding: 10px 12px;
        border: 1px solid #cbd5e1;
        vertical-align: top;
      }
      .empty {
        padding: 24px;
        text-align: center;
        color: #64748b;
      }
      @media print {
        body {
          padding: 0;
          background: #ffffff;
        }
        .sheet {
          border: none;
          margin: 0;
          width: auto;
          min-height: auto;
          padding: 12mm;
        }
      }
    </style>
  </head>
  <body>
    <div class="sheet">
      <div class="header">
        <div>
          <div class="brand">Factory ERP</div>
          <div class="subtitle">Exported table report</div>
        </div>
        <div>
          <div class="title">${escapeHtml(title)}</div>
          <div class="meta">Generated: ${escapeHtml(new Date().toLocaleString())}</div>
        </div>
      </div>
      ${
        rows.length > 0
          ? `<table><thead><tr>${tableHeader}</tr></thead><tbody>${tableRows}</tbody></table>`
          : `<div class="empty">No rows available for export.</div>`
      }
    </div>
  </body>
</html>`);
  printWindow.document.close();

  if (autoPrint) {
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }

  return true;
}

export function getPaginatedRows(rows, currentPage, pageSize) {
  const safePageSize = Math.max(1, Number(pageSize) || 10);
  const totalPages = Math.max(1, Math.ceil(rows.length / safePageSize));
  const safePage = Math.min(Math.max(1, Number(currentPage) || 1), totalPages);
  const startIndex = (safePage - 1) * safePageSize;

  return {
    currentPage: safePage,
    pageSize: safePageSize,
    totalPages,
    totalItems: rows.length,
    rows: rows.slice(startIndex, startIndex + safePageSize),
  };
}
