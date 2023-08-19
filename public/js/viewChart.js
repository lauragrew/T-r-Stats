// // Attach click event listeners to all "View Chart" buttons
// document.addEventListener("DOMContentLoaded", () => {
//   const viewChartButtons = document.querySelectorAll(".view-chart-btn");
//   viewChartButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//       const playerId = button.getAttribute("data-player-id");
//       displayPlayerChart(playerId);
//     });
//   });
// });

// // Function to display the player's chart
// async function displayPlayerChart(playerId) {
//   try {
//     // Fetch player's stats from the server
//     const response = await fetch(`/fetchPlayerStats/${playerId}`);
//     const data = await response.json();

//     // Extract labels and data from the fetched data
//     const labels = data.statTypes;
//     const statsData = data.statsCounts;

//     // Create the player's chart using Chart.js
//     const ctx = document
//       .getElementById(`player-chart-${playerId}`)
//       .getContext("2d");
//     new Chart(ctx, {
//       type: "bar",
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: "Stats",
//             data: statsData,
//             backgroundColor: "rgba(75, 192, 192, 0.6)",
//             borderColor: "rgba(75, 192, 192, 1)",
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true,
//           },
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching player's stats:", error);
//   }
// }
