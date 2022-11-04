const puppeteer = require('puppeteer');

async function clear(page, selector) {
    await page.evaluate(selector => {
        document.querySelector(selector).value = "";
    }, selector);
}
const getPrice = async (arrayOfObject) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://pangeayt2.eu/#exchange');
    await page.mouse.click(0, 0, {button: 'left'});
    const result=[]
    for await (const obj of arrayOfObject) {
        const firstUrl = page.url();
        await clear(page,'#autocomplete-ajax');
        await page.focus('#autocomplete-ajax');
        await page.type('#autocomplete-ajax', obj.itemName + '');
        await page.keyboard.press("Enter");
        const secondUrl=page.url();
        if(firstUrl===secondUrl) continue ;
        const element = await page.waitForSelector('#exchange-table > tbody > tr:nth-child(1) > td:nth-child(2)');
        const value = await element.evaluate(el => el.textContent)
        if (value === '') {
             result.push({itemName: obj.itemName, price: 0, quantity: obj.quantity});
            continue
        }
        const price = +value.trim().replace(',', '.').replace('B', '').replace(' ','');
        result.push( {
            itemName: obj.itemName,
            price,
            quantity: obj.quantity,
        })
    }
    await browser.close();
    return result
}

module.exports = {
    getPrice
}