// exportCsv.js
document.addEventListener("DOMContentLoaded", function () {
  const exportBtn = document.getElementById("export-csv-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportToCsv);
  }
});

function exportToCsv() {
  const csvContent = generateCsvContent();
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "player_stats.csv";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function generateCsvContent() {
  const table = document.getElementById("player-stats-table");
  const rows = table.querySelectorAll("tbody tr");
  const headerRow = table.querySelector("thead tr");
  const headers = Array.from(headerRow.children).map(
    (cell) => cell.textContent
  );

  const rowsData = Array.from(rows).map((row) => {
    const cells = row.children;
    return Array.from(cells).map((cell) => cell.textContent);
  });

  const csvRows = [headers].concat(rowsData);

  return csvRows.map((row) => row.join(",")).join("\n");
}
