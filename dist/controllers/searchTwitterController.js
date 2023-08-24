// making a search controller to handle the search requests using prisma client
import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';
const prisma = new PrismaClient();
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
            const twitterSearchResults = await page.evaluate(() => Array.from(document.querySelectorAll('#react-layout .wLL07_0Xnd1QZpzpfR4W'), (e) => {
                const titleElement = e.querySelector('.Rn_JXVtoPVAFyGkcaXyK .Wo6ZAEmESLNUuWBkbMxx ');
                const usernameElement = e.querySelector('.Rn_JXVtoPVAFyGkcaXyK .oaxCunrdbQs3WQDCq3Ls ');
                const descriptionElement = e.querySelector('.OgdwYG6KE2qthn9XQWFC span');
                const username = "@" + (usernameElement?.innerText.replace(/\s*›\s*/g, '') || '').replace(/status\d+/i, '');
                const usernameFiltered = (usernameElement?.innerText.replace(/\s*›\s*/g, '') || '').replace(/status\d+/i, '');
                const link = titleElement?.innerText + "/" + usernameFiltered;
                const bio = descriptionElement?.innerText;
                return { username, bio, link };
            }));
            console.log(twitterSearchResults);
            res.json(twitterSearchResults);
            console.log("button clicked0");
            const buttonSelector = '#react-layout #more-results';
            await page.waitForSelector(buttonSelector);
            console.log("button clicked1");
            // Click the button
            const buttonClick = await page.click(buttonSelector);
            console.log("button clicked");
            console.log(buttonClick);
            // Wait for some time to let the page update
            await page.waitForTimeout(3000);
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