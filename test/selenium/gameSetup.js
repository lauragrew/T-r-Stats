const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const login = require("./login"); // Import the login function

// Define the positions and corresponding player names
const positionsAndPlayers = [
  { position: "GK", playerName: "Player Name 0" },
  { position: "LB", playerName: "Player Name 1" },
  { position: "FB", playerName: "Player Name 2" },
  { position: "RB", playerName: "Player Name 3" },
  { position: "LWB", playerName: "Player Name 4" },
  { position: "CHB", playerName: "Player Name 5" },
  { position: "RWB", playerName: "Player Name 6" },
  { position: "MF1", playerName: "Player Name 7" },
  { position: "MF2", playerName: "Player Name 8" },
  { position: "LHF", playerName: "Player Name 9" },
  { position: "CHF", playerName: "Player Name 10" },
  { position: "RHF", playerName: "Player Name 11" },
  { position: "LCF", playerName: "Player Name 12" },
  { position: "FF", playerName: "Player Name 13" },
  { position: "RCF", playerName: "Player Name 14" },
];

// ...

async function runGameSetupTest() {
  const options = new chrome.Options();
  const driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Use the login function to log in
    await login(driver, "test@hotmail.com", "testpassword");

    // After successful login, navigate to the dashboard page
    await driver.get("http://localhost:3000/dashboard");

    // Add a log statement to confirm that you've reached the dashboard page
    console.log("Reached the dashboard page.");

    // Click the "Game Setup" link to navigate to the "Game Setup" page
    const gameSetupLink = await driver.findElement(By.linkText("Game Setup"));
    await gameSetupLink.click();

    // Add a log statement to confirm that you've reached the "Game Setup" page
    console.log("Reached the Game Setup page.");

    // Fill out the game setup form
    const oppositionNameInput = await driver.findElement(
      By.name("oppositionName")
    );
    await oppositionNameInput.sendKeys("Test Opposition Name");

    const gameDescriptionInput = await driver.findElement(
      By.name("gameDescription")
    );
    await gameDescriptionInput.sendKeys("Game Description");

    // Select a squad from the dropdown
    const squadDropdown = await driver.findElement(By.id("selectedTeam"));
    await squadDropdown.click(); // Click on the squad dropdown

    // Now, you can find the desired squad option and click on it
    const squadOption = await driver.findElement(
      By.xpath("//option[text()='Test Team']")
    );
    await squadOption.click(); // Click on the squad option

    // Define the playerSetup array before processing positions
    const playerSetup = [];

    // Loop through positions and select players and numbers
    for (let i = 0; i < positionsAndPlayers.length; i++) {
      const { position, playerName } = positionsAndPlayers[i];
      let playerNumber = i + 1; // Start with 1 and increment

      try {
        console.log(
          `Processing position: ${position}, playerName: ${playerName}`
        );

        // Wait for the player position dropdown to be clickable
        const playerPositionDropdown = await driver.findElement(
          By.id(`selectedPlayer_${position}`)
        );
        await playerPositionDropdown.click(); // Click on the player dropdown

        // Now, you can find the desired player option and click on it
        const playerOption = await driver.findElement(
          By.xpath(
            `//select[@id='selectedPlayer_${position}']//option[text()='${playerName}']`
          )
        );
        await playerOption.click(); // Click on the player option

        const playerNumberInput = await driver.findElement(
          By.id(`playerNumber_${position}`)
        );

        // Assign the player number based on the current iteration
        await playerNumberInput.clear(); // Clear the input field
        await playerNumberInput.sendKeys(playerNumber.toString()); // Set the player number

        // Add the player to the playerSetup array
        playerSetup.push({
          position,
          playerId: "", // You can fetch and set this value if needed
          playerName,
          playerNumber: playerNumber.toString(),
        });
      } catch (error) {
        console.error(`Error for position ${position}:`, error);
      }
    }

    // Now you can use the playerSetup array as needed
    console.log("Player Setup:", playerSetup);

    // Click the "Save Game Setup" button to submit the form
    const saveButton = await driver.findElement(By.className("save-button"));
    await saveButton.click();

    // You can add assertions here to confirm that the game setup was successful

    // Add a log statement to confirm that you've completed the game setup
    console.log("Game setup completed successfully.");

    // Log the playerSetup array for verification
    console.log("Player Setup:", playerSetup);

    // ...
  } catch (error) {
    console.error("Game Setup Test: An error occurred:", error);
  } finally {
    await driver.quit();
  }
}

// Call the runGameSetupTest function to start the test
runGameSetupTest();
