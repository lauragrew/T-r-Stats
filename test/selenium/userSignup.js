const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");

async function runSignupTest() {
  const options = new chrome.Options();
  const driver = new webdriver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Open the signup page
    await driver.get("http://localhost:3000/statsSignup1");

    // Find and interact with the signup form elements
    const firstNameInput = await driver.findElement(
      webdriver.By.id("firstName")
    );
    const lastNameInput = await driver.findElement(webdriver.By.id("lastName"));
    const emailInput = await driver.findElement(webdriver.By.id("email"));
    const passwordInput = await driver.findElement(webdriver.By.id("password"));
    const passwordConfirmInput = await driver.findElement(
      webdriver.By.id("passwordConfirm")
    );
    const submitButton = await driver.findElement(
      webdriver.By.css(".form__button")
    );

    // Enter user information
    await firstNameInput.sendKeys("John");
    await lastNameInput.sendKeys("Smith");
    await emailInput.sendKeys("test@hotmail.com");
    await passwordInput.sendKeys("testpassword");
    await passwordConfirmInput.sendKeys("testpassword");

    // Submit the form
    await submitButton.click();

    // Introduce a delay to allow time for the alert to appear
    await driver.sleep(5000); // 5 seconds delay (adjust as needed)
    // Adjust the delay time as needed

    // Handle the alert dialog
    const alert = await driver.switchTo().alert();
    await alert.accept();

    // Wait for redirection or error message
    const currentUrl = await driver.getCurrentUrl();
    console.log("Current URL:", currentUrl);

    // Add an explicit wait for the URL to contain "/dashboard"
    await driver.wait(
      webdriver.until.urlContains("/dashboard"),
      10000, // Maximum wait time in milliseconds
      "URL did not contain '/dashboard' after signup"
    );

    // Log success
    console.log("Signup Test: Successful signup");

    // You can continue with more tests here, e.g., logout or other actions
  } catch (error) {
    // Assert that the test failed
    assert.fail("Signup Test Failed: " + error.message);

    // Log the error along with the current URL
    const currentUrl = await driver.getCurrentUrl();
    console.error("Signup Test Failed:", error, "Current URL:", currentUrl);
  } finally {
    await driver.quit();
  }
}

// Run the test
runSignupTest();
