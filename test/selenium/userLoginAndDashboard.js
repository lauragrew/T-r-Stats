const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const login = require("./login"); // Import the login function

async function runLoginAndDashboardTest() {
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

    // Find and click all dashboard links
    const dashboardLinks = await driver.findElements(
      webdriver.By.css(".dashboard-box a")
    );

    for (const link of dashboardLinks) {
      const linkText = await link.getText();
      console.log(`Testing link: ${linkText}`);
      await link.click();

      // Wait for the page to load or for a specific element on the page
      await driver.wait(
        webdriver.until.elementLocated(webdriver.By.css("h1")),
        20000
      );

      // Print a success message to confirm you're on the page
      console.log(`Successfully navigated to ${linkText} page.`);

      // Now, go back to the dashboard
      await driver.navigate().back();

      // Add a log statement to confirm that you're back on the dashboard
      console.log("Back on the dashboard page.");
    }

    // Print a success message to confirm you're back on the dashboard
    console.log("Back on the dashboard page.");
  } catch (error) {
    console.error(
      "Login, Dashboard, and Navigation Test: An error occurred:",
      error
    );
  } finally {
    await driver.quit();
  }
}

runLoginAndDashboardTest();
