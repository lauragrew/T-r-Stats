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
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
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

// Inside your viewPlayerChart.js script
document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.getElementById("back-button");

  if (backButton) {
    backButton.addEventListener("click", () => {
      window.history.back(); // Navigate back to the previous page
    });
  }
});
