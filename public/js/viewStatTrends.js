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
async function fetchGameSetups(startDate, endDate, selectedTeam) {
  try {
    const response = await fetch(
      `/api/v1/gameSetups/by-date?startDate=${startDate}&endDate=${endDate}&selectedTeam=${selectedTeam}`
    );

    const gameSetups = await response.json();
    return gameSetups;
  } catch (error) {
    console.error("Error fetching game setups:", error);
    return [];
  }
}

// Function to fetch user squads
async function fetchUserSquads() {
  try {
    const response = await fetch("/api/v1/squads/mySquads");
    const data = await response.json();
    return data.data.squads;
  } catch (error) {
    console.error("Error fetching user squads:", error);
    return [];
  }
}

// Function to fetch total stat counts
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
async function renderStatTrendsChart(gameSetups, squads) {
  const selectedStat = document.getElementById("stat-select").value;

  try {
    const totalStatCounts = await fetchTotalStatCounts(
      gameSetups,
      selectedStat
    );

    const selectedTeamId = document.getElementById("team-select").value;
    const selectedTeam = squads.find((squad) => squad._id === selectedTeamId);
    const selectedTeamName = selectedTeam ? selectedTeam.name : "Unknown Team";

    const gameNames = gameSetups.map((gameSetup) => {
      const gameDate = new Date(gameSetup.endDate);

      const year = gameDate.getFullYear().toString().slice(-2); // Get the last two digits of the year
      const month = (gameDate.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if single-digit month
      const day = gameDate.getDate().toString().padStart(2, "0"); // Add leading zero if single-digit day

      const formattedDate = `${day}/${month}/${year}`;
      return `${selectedTeamName} vs ${gameSetup.oppositionName} (${formattedDate})`;
    });

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
        labels: gameNames, // Use game names as labels
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
  } catch (error) {
    console.error("Error fetching total stat counts:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const backButton = document.getElementById("back-button");
  const viewTrendsButton = document.getElementById("view-trends-btn");
  const teamSelect = document.getElementById("team-select");

  // Fetch user squads and populate the dropdown
  const squads = await fetchUserSquads();
  squads.forEach((squad) => {
    const option = document.createElement("option");
    option.value = squad._id;
    option.textContent = squad.name;
    teamSelect.appendChild(option);
  });

  // Add event listener to the "Back" button
  backButton.addEventListener("click", () => {
    // Navigate back to the previous page
    history.back();
  });

  // Add event listener to the "View Trends" button
  viewTrendsButton.addEventListener("click", async () => {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    try {
      const selectedTeamId = document.getElementById("team-select").value;
      const gameSetups = await fetchGameSetups(
        startDate,
        endDate,
        selectedTeamId
      );

      console.log("Fetched gameSetups:", gameSetups);

      renderStatTrendsChart(gameSetups, squads);
    } catch (error) {
      console.error("Error fetching game setups:", error);
    }
  });
});
