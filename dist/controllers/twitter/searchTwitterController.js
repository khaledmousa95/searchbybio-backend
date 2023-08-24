// making a search controller to handle the search requests using prisma client
import puppeteer from 'puppeteer';
export const getSearchTwitterDatabase = async (req, res) => {
    try {
        const searchResults = async function () {
            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();
            const { search } = req.body;
            const searchWithPlusSigns = search.replace(/ /g, '+');
            console.log(search);
            console.log(searchWithPlusSigns);
            await page.goto(`https://duckduckgo.com/?q=site%3Atwitter.com+${searchWithPlusSigns}&ia=web`);
            const twitterSearchResults = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i <= 9; i++) {
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
            });
            console.log(twitterSearchResults);
            res.json(twitterSearchResults);
            await browser.close();
        };
        searchResults();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
//# sourceMappingURL=searchTwitterController.js.map