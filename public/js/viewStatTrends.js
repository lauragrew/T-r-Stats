// function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// function to fetch game setups data for stat trends using the gameSetups/by-date function
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

// function to fetch user squads using the getmySquads function
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

// function to fetch total stat counts - gets an array of gameSetups and statTypes as parameters. iterate thorugh the game setups, players and their stats to get the total and returns array of the total counts for each gamesetup
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

// function to render the stat trends line chart using chart.js usig the fetchTotalStatCount fucntion from above
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
      // get the last two digits of the year
      const year = gameDate.getFullYear().toString().slice(-2);
      // add leading zero if single-digit month
      const month = (gameDate.getMonth() + 1).toString().padStart(2, "0");
      // add leading zero if single-digit day
      const day = gameDate.getDate().toString().padStart(2, "0");

      const formattedDate = `${day}/${month}/${year}`;
      // return chart data
      return `${selectedTeamName} vs ${gameSetup.oppositionName} (${formattedDate})`;
    });
    // create chartData and game names for the chart
    const chartData = [
      {
        label: `${selectedStat} Trend`,
        data: totalStatCounts,
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
      },
    ];

    // destroy the previous chart instance if it exists
    if (window.myChart) {
      window.myChart.destroy();
    }

    // view the line chart using Chart.js
    const ctx = document.getElementById("stat-trends-chart").getContext("2d");
    window.myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: gameNames,
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
// event listeners for buttons
document.addEventListener("DOMContentLoaded", async () => {
  const backButton = document.getElementById("back-button");
  const viewTrendsButton = document.getElementById("view-trends-btn");
  const teamSelect = document.getElementById("team-select");

  // fetch user squads and populate the dropdown
  const squads = await fetchUserSquads();
  squads.forEach((squad) => {
    const option = document.createElement("option");
    option.value = squad._id;
    option.textContent = squad.name;
    teamSelect.appendChild(option);
  });

  // addd event listener to the "Back" button
  backButton.addEventListener("click", () => {
    history.back();
  });

  // add event listener to the "View Trends" button
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
