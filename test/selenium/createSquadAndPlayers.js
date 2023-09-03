const webdriver = require("selenium-webdriver"); // Import the webdriver module
const { By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const login = require("./login"); // Import the login function

async function runCreateSquadAndPlayersTest() {
  const options = new chrome.Options();
  const driver = new webdriver.Builder()
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

    // Click the "View Squads" link to navigate to the "View Squads" page
    const viewSquadsLink = await driver.findElement(By.linkText("View Squads"));
    await viewSquadsLink.click();

    // Add a log statement to confirm that you've reached the "View Squads" page
    console.log("Reached the View Squads page.");

    // Find the "Create New Squad" button and click it
    const createSquadButton = await driver.findElement(
      By.linkText("Create New Squad")
    );
    await createSquadButton.click();

    // Add a log statement to confirm that you've reached the "Create New Squad" page
    console.log("Reached the Create New Squad page.");

    // Find the squad name input field and enter a squad name
    const squadNameInput = await driver.findElement(By.id("name"));
    const squadName = "Test Squad"; // The squad name you want to use
    await squadNameInput.sendKeys(squadName);

    // Find the "Create Squad" button and click it to submit the form
    const createSquadForm = await driver.findElement(
      By.id("create-squad-form")
    );
    await createSquadForm.submit();

    try {
      // Wait for the alert to be present (adjust the timeout as needed)
      const alert = await driver.wait(webdriver.until.alertIsPresent(), 5000);

      // Accept the alert
      await alert.accept();
    } catch (error) {
      console.error("Error handling alert:", error);
    }

    // Add a log statement to confirm that you've submitted the form
    console.log("Squad creation form submitted successfully.");

    // Use an explicit wait to wait for the squad name link to appear
    const squadNameLink = await driver.wait(
      until.elementLocated(By.linkText(squadName)),
      5000 // Adjust the timeout as needed
    );

    // Click the squad name link to navigate to the "View Players" page
    await squadNameLink.click();

    // Now, you should be on the "View Players" page

    // Call the addPlayerToSquadTest function and pass the driver object
    await addPlayerToSquadTest(driver);
  } catch (error) {
    console.error("Create Squad and Players Test: An error occurred:", error);
  } finally {
    await driver.quit();
  }
}

async function addPlayerToSquadTest(driver) {
  try {
    // Assume you are still on the "View Players" page for the squad you just created

    // Find and click the "Add Player" button on the "View Players" page
    const addPlayerButton = await driver.findElement(By.linkText("Add Player"));
    await addPlayerButton.click();

    // Add a log statement to confirm that you've reached the "Add Player" page
    console.log("Reached the Add Player page.");

    const playerNameInput = await driver.findElement(By.name("firstName"));
    const playerLastNameInput = await driver.findElement(By.name("lastName"));

    await playerNameInput.sendKeys("Test");
    await playerLastNameInput.sendKeys("Player");

    // Fill in other player details

    // Find and click the "Add Player" button to submit the form
    const addPlayerForm = await driver.findElement(By.id("add-player-form"));
    await addPlayerForm.submit();

    // Add a log statement to confirm that you've submitted the form
    console.log("Player addition form submitted successfully.");

    // Add assertions to confirm that the player was added to the squad
    const playerNameElement = await driver.findElement(
      By.className("player-name")
    );
    const playerNameText = await playerNameElement.getText();

    if (playerNameText === "Test Player") {
      console.log("Player name is correct.");
    } else {
      console.error("Player name is incorrect.");
    }

    // Now, you can add more assertions for other player details if needed
  } catch (error) {
    console.error("Add Player to Squad Test: An error occurred:", error);
  }
}

// Call the runCreateSquadAndPlayersTest function to start the test
runCreateSquadAndPlayersTest();
