const puppeteer = require('puppeteer');

const scrapPrice = async (item)=>{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://pangeayt2.eu/#exchange');
    await page.mouse.click(0, 0, {button: 'left'})
    await page.type('#autocomplete-ajax', item + '');
    const element = await page.waitForSelector('#exchange-table > tbody > tr:nth-child(1) > td:nth-child(2)');
    const value = await element.evaluate(el => el.textContent);
    await browser.close();
    return value;
}

const getPrice = async (arrayOfObject) => {
    return await Promise.all(arrayOfObject.map(async (obj)=>{
        const scrapedPrice = await scrapPrice(obj.itemName);
        console.log(scrapedPrice)
        if (scrapedPrice === '') return {itemName:obj.itemName,price:null, quantity:obj.quantity}
        const price = +scrapedPrice.replace(',','.').replace('B','').trim();
        return {
            itemName:obj.itemName,
            price,
            quantity:obj.quantity,
        }
    }))
}

module.exports= {
    getPrice
}