// Js function to update stat cell content
function updateStatCell(playerId, statType, count) {
  const cell = document.getElementById(`${playerId}-${statType}`);
  if (cell) {
    cell.textContent = count;
  }
}

// rcord a new stat and update the table cell
function recordStat(playerId, statType) {
  // recording a new stat and getting an updated count from the server
  const updatedCount = Math.floor(Math.random() * 10);
  updateStatCell(playerId, statType, updatedCount);
}

// attach click event listeners to all stat cells
document.addEventListener("DOMContentLoaded", () => {
  const statCells = document.querySelectorAll(".stats-table td[id]");
  statCells.forEach((cell) => {
    const [playerId, statType] = cell.id.split("-");
    cell.addEventListener("click", () => recordStat(playerId, statType));
  });
});
