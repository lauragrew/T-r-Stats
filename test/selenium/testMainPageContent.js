// checks if the specified web page loads correctly and if the designated elements (image, h2, and h4) exist and contain the expected content. It's a basic example of how you can use Selenium WebDriver to validate the presence and content of specific elements on a web page.

const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function runTest() {
  const options = new chrome.Options();
  const driver = new webdriver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    await driver.get("http://localhost:3000"); // Change the URL as needed

    // Find and interact with the elements
    const imageElement = await driver.findElement(webdriver.By.id("image"));
    const h2Element = await driver.findElement(webdriver.By.css("#content h2"));
    const h4Element = await driver.findElement(webdriver.By.css("#content h4"));

    // Get text content from elements
    const h2Text = await h2Element.getText();
    const h4Text = await h4Element.getText();

    // Print the text content
    console.log("Image element found:", imageElement);
    console.log("h2 content:", h2Text);
    console.log("h4 content:", h4Text);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await driver.quit();
  }
}

runTest();
