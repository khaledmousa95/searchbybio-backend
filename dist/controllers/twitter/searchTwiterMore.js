import puppeteer from "puppeteer";
const moreResults = async (req, res) => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const buttonSelector = '#react-layout #more-results';
    await page.waitForSelector(buttonSelector);
    // Click the button
    const buttonClick = await page.click(buttonSelector);
    // Wait for some time to let the page update
    await page.waitForTimeout(3000);
    await browser.close();
};
//# sourceMappingURL=searchTwiterMore.js.map