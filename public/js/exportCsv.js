// export csv JS to handle when a user wantsa to export the stats table toa csv file

document.addEventListener("DOMContentLoaded", function () {
  const exportBtn = document.getElementById("export-csv-btn");
  // if export button is clicked trigger exportToCSV
  if (exportBtn) {
    exportBtn.addEventListener("click", exportToCsv);
  }
});
// extract text from the game-info table and generates a csv file using generateCSVContent function (creates a Blob (binary large object) from the csv content with specified charcter encoding - text/csv;charset=utf-8;)
function exportToCsv() {
  const gameInfo = document.querySelector(".game-info").textContent;
  const csvContent = generateCsvContent();

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  // set download link and name of the download file
  link.download = `${gameInfo}_stats.csv`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// extracts data from the pug table with the ID "player-stats-table" and converts to CSV
// GETS TABLE ROWS AND HEADERS AND CONVERTS THEM TO ARRAYS AND CREATES THE CSV
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
// not used
function getFilenameFromGameInfo(gameInfo) {
  const [selectedTeamVsOpposition, gameDescription] = gameInfo.split("\n");
  const [selectedTeamName, oppositionTeamName] =
    selectedTeamVsOpposition.split(" vs ");

  return `${selectedTeamName}_${oppositionTeamName}_${gameDescription}_stats.csv`;
}
