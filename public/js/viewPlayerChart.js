// JS function to view a specific player chart

// wait for player chart symbol to be clicked
document.addEventListener("DOMContentLoaded", () => {
  const playerSetupIdElement = document.getElementById("player-setup-id");

  if (playerSetupIdElement) {
    const playerSetupId = playerSetupIdElement.value;
    fetchData(playerSetupId)
      .then((chartData) => createChart(chartData))
      .catch((error) => console.error("Error:", error));
  }
});

// function to get data from the fetchPlayerStats fucntion which gets the individual player stats
async function fetchData(playerSetupId) {
  try {
    const response = await fetch(`/fetchPlayerStats/${playerSetupId}`);
    const data = await response.json();
    return data.chartData;
  } catch (error) {
    throw error;
  }
}
// funciton to create the chart using chart.js. recieved chartData from above fucntion
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

// fucniton to go back to previous page
document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.getElementById("back-button");

  backButton.addEventListener("click", function () {
    history.back();
  });
});
