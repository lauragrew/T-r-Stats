console.log("viewPlayerChart.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content loaded");
  const playerSetupIdElement = document.getElementById("player-setup-id");

  if (playerSetupIdElement) {
    const playerSetupId = playerSetupIdElement.value;
    fetchData(playerSetupId)
      .then((chartData) => createChart(chartData))
      .catch((error) => console.error("Error:", error));
  }
});

async function fetchData(playerSetupId) {
  try {
    const response = await fetch(`/fetchPlayerStats/${playerSetupId}`);
    const data = await response.json();
    return data.chartData;
  } catch (error) {
    throw error;
  }
}

function createChart(chartData) {
  const ctx = document.getElementById("player-stats-chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartData.map((dataPoint) => dataPoint.label),
      datasets: [
        {
          label: "Stats",
          data: chartData.map((dataPoint) => dataPoint.data[0]),
          backgroundColor: "#28a745",
          borderColor: "#28a745",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1, // Set the step size to 1
            callback: function (value, index, values) {
              return Math.floor(value); // Display whole numbers only
            },
          },
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.getElementById("back-button");

  backButton.addEventListener("click", function () {
    // Navigate back to the previous page
    history.back();
  });
});
