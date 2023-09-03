const webdriver = require("selenium-webdriver");

async function login(driver) {
  try {
    // Open the login page
    await driver.get("http://localhost:3000/statsLogin");

    // Find and interact with the login form elements
    const emailInput = await driver.findElement(webdriver.By.id("email"));
    const passwordInput = await driver.findElement(webdriver.By.id("password"));
    const submitButton = await driver.findElement(
      webdriver.By.css(".form__button")
    );

    // Enter valid login credentials
    await emailInput.sendKeys("test@hotmail.com");
    await passwordInput.sendKeys("testpassword");

    // Submit the login form
    await submitButton.click();

    // Wait for the alert to appear (adjust the timeout as needed)
    const alert = await driver.wait(webdriver.until.alertIsPresent(), 10000);

    // Handle the alert
    const alertText = await alert.getText();
    await alert.accept();

    // Check if the alert text is "Logged in successfully"
    if (alertText === "Logged in successfully") {
      console.log("Log in successful!");
    } else {
      console.error("Login Test: Unexpected alert:", alertText);
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
}

module.exports = login;
