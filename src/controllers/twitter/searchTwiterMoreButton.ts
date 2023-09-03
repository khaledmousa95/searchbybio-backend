import puppeteer from "puppeteer"

export const moreResultsButton = async(req,res)=>{
    try{
        let minRange,maxRange
 

       const searchResults = async function(){

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage()
        console.log("fire0")
         const {searchValue}  = await req.body;
          minRange  = await req.body.minRange;
          maxRange  = await req.body.maxRange;



        console.log(searchValue,"search from button component")
        const searchWithPlusSigns =   "search" || searchValue.replace(/ /g, '+');            
        await page.goto(`https://duckduckgo.com/?q=site%3Atwitter.com+${searchWithPlusSigns}&ia=web`)
        const buttonSelector = '#react-layout #more-results';   
        await page.waitForSelector(buttonSelector);
        console.log("fire1")
        console.log(minRange,maxRange ,"first function")
        
    // Click the button
        const buttonClick = await page.click(buttonSelector);
  
       console.log("fire2")

    // Wait for some time to let the page update
       await page.waitForTimeout(3000);
    
       console.log(minRange,maxRange ,"middle")

const twitterSearchResults = await page.evaluate((minRange, maxRange) => {
    console.log(minRange,maxRange ,"second function1")
const results = [];
console.log(minRange,maxRange ,"second function2")

for (let i = Number(minRange); i <= Number(maxRange); i++) {
    const resultElement = document.querySelector(`#react-layout .react-results--main #r1-${i}`);
    if (resultElement) {
        const titleElement = resultElement.querySelector('.Rn_JXVtoPVAFyGkcaXyK .Wo6ZAEmESLNUuWBkbMxx ') as HTMLElement;
        const usernameElement = resultElement.querySelector('.Rn_JXVtoPVAFyGkcaXyK .oaxCunrdbQs3WQDCq3Ls ')as HTMLElement;
        const descriptionElement = resultElement.querySelector('.OgdwYG6KE2qthn9XQWFC span')as HTMLElement;
        const username = "@" + (usernameElement?.innerText.replace(/\s*›\s*/g, '') || '').replace(/status\d+/i, '');
        const usernameFiltered = (usernameElement?.innerText.replace(/\s*›\s*/g, '') || '').replace(/status\d+/i, '');
        const link = titleElement?.innerText + "/" + usernameFiltered;
        const bio = descriptionElement?.innerText;
        results.push({ username, bio, link });
    }
}

return results;
},minRange, maxRange);

console.log(twitterSearchResults);
res.json(twitterSearchResults);
        await browser.close()
    }
    searchResults()

}catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
}
}