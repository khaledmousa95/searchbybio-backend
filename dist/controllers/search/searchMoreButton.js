import puppeteer from "puppeteer";
export const moreResultsButton = async (req, res) => {
    try {
        let minRange, maxRange;
        const searchResults = async function () {
            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();
            const { searchValue } = await req.body;
            minRange = await req.body.minRange;
            maxRange = await req.body.maxRange;
            const { chosenPlatform } = await req.body;
            const searchWithPlusSigns = searchValue.replace(/ /g, '+') || "search";
            await page.goto(`https://duckduckgo.com/?q=site%3A${chosenPlatform}+${searchWithPlusSigns}&ia=web`);
            const buttonSelector = '#react-layout #more-results';
            await page.waitForSelector(buttonSelector);
            // Click the button
            await page.click(buttonSelector);
            // Wait for some time to let the page update
            await page.waitForTimeout(3000);
            const twitterSearchResults = await page.evaluate((minRange, maxRange) => {
                const results = [];
                for (let i = Number(minRange); i <= Number(maxRange); i++) {
                    const resultElement = document.querySelector(`#react-layout .react-results--main #r1-${i}`);
                    if (resultElement) {
                        const titleElement = resultElement.querySelector('.Rn_JXVtoPVAFyGkcaXyK .Wo6ZAEmESLNUuWBkbMxx ');
                        const usernameElement = resultElement.querySelector('.Rn_JXVtoPVAFyGkcaXyK .oaxCunrdbQs3WQDCq3Ls ');
                        const descriptionElement = resultElement.querySelector('.OgdwYG6KE2qthn9XQWFC span');
                        const username = "@" + (usernameElement?.innerText.replace(/\s*›\s*/g, '') || '').replace(/status\d+/i, '');
                        const usernameFiltered = (usernameElement?.innerText.replace(/\s*›\s*/g, '') || '').replace(/status\d+/i, '');
                        const link = titleElement?.innerText + "/" + usernameFiltered;
                        const bio = descriptionElement?.innerText;
                        results.push({ username, bio, link });
                    }
                }
                return results;
            }, minRange, maxRange);
            if (twitterSearchResults) {
                res.json(twitterSearchResults);
            }
            await browser.close();
        };
        searchResults();
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "could find more results" });
    }
};
//# sourceMappingURL=searchMoreButton.js.map