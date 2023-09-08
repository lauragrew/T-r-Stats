document.addEventListener("DOMContentLoaded", function () {
  const statTotalsDataRaw = document.getElementById("stat-totals-data").value;
  const statTypesDataRaw = document.getElementById("stat-types-data").value;

  // parse the statTotals and statTypes data from the hidden input fields
  const statTotals = JSON.parse(statTotalsDataRaw);
  const statTypes = JSON.parse(statTypesDataRaw);

  // create a chart using Chart.js
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
    options: {},
  });
});

// get back to the previous page
document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.getElementById("back-button");

  backButton.addEventListener("click", function () {
    // navigate back to the previous page
    history.back();
  });
});
