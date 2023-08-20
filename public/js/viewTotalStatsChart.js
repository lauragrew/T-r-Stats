document.addEventListener("DOMContentLoaded", function () {
  const statTotalsDataRaw = document.getElementById("stat-totals-data").value;
  const statTypesDataRaw = document.getElementById("stat-types-data").value;

  // Parse the statTotals and statTypes data from the hidden input fields
  const statTotals = JSON.parse(statTotalsDataRaw);
  const statTypes = JSON.parse(statTypesDataRaw);

  // Create a chart using Chart.js
  const ctx = document.getElementById("total-stats-chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: statTypes,
      datasets: [
        {
          label: "Total Stats",
          data: statTotals,
          backgroundColor: "#28a745",
          borderColor: "#28a745",
          borderWidth: 1,
        },
      ],
    },
    options: {
      // Add your chart options here
    },
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.getElementById("back-button");

  backButton.addEventListener("click", function () {
    // Navigate back to the previous page
    history.back();
  });
});
