// Function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to fetch game setups data for stat trends
async function fetchGameSetups(startDate, endDate) {
  try {
    const response = await fetch(
      `/api/v1/gameSetups/by-date?startDate=${startDate}&endDate=${endDate}`
    );

    const gameSetups = await response.json();
    return gameSetups;
  } catch (error) {
    console.error("Error fetching game setups:", error);
    return [];
  }
}

async function fetchTotalStatCounts(gameSetups, statType) {
  try {
    const totalStatCounts = [];

    gameSetups.forEach((gameSetup) => {
      let totalCount = 0;

      gameSetup.playerSetup.forEach((player) => {
        player.stats.forEach((stat) => {
          if (stat.statType === statType) {
            totalCount += stat.count;
          }
        });
      });

      totalStatCounts.push(totalCount);
    });

    return totalStatCounts;
  } catch (error) {
    console.error("Error fetching total stat counts:", error);
    return [];
  }
}

// Function to render the stat trends line chart
async function renderStatTrendsChart() {
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const selectedStat = document.getElementById("stat-select").value;

  console.log("Selected startDate:", startDate);
  console.log("Selected endDate:", endDate);
  console.log("Selected stat:", selectedStat);

  const gameSetups = await fetchGameSetups(startDate, endDate);

  console.log("Game setups within date range:", gameSetups);

  const totalStatCounts = await fetchTotalStatCounts(gameSetups, selectedStat);

  const dates = gameSetups.map((gameSetup) => new Date(gameSetup.endDate));

  const chartData = [
    {
      label: `${selectedStat} Trend`,
      data: totalStatCounts,
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
    },
  ];

  // Destroy the previous chart instance if it exists
  if (window.myChart) {
    window.myChart.destroy();
  }

  // Render the line chart using Chart.js
  const ctx = document.getElementById("stat-trends-chart").getContext("2d");
  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: chartData,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Attach event listener to the "View Trends" button
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("view-trends-btn")
    .addEventListener("click", renderStatTrendsChart);
});

document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.getElementById("back-button");

  backButton.addEventListener("click", function () {
    // Navigate back to the previous page
    history.back();
  });
});
