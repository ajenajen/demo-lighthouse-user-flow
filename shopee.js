const puppeteer = require('puppeteer');

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://shopee.com/', { waitUntil: 'networkidle2' });
  
  await page.waitForSelector('#modal', { visible: true });
  await page.click('#modal > div._2IJN-0 > div._1lzg0h > div > div.language-selection__list > div:nth-child(1) > button');

  await Promise.all([
    page.waitForTimeout(2000),
    page.click('.home-page'),
  ]);

  await page.waitForTimeout(2000);
  await page.type('.shopee-searchbar-input__input', 'machanical keyboard');
  await page.keyboard.press('Enter');

  await page.waitForTimeout(2000);
  await page.waitForSelector('.shopee-search-item-result__item:first-child');
  await page.screenshot({ path: 'screenshot/shopee-list.png' });
  
  // Generating a pdf is currently only supported in Chrome headless.
  // await Promise.all([
  //   page.waitForTimeout(2000),
  //   page.click('.shopee-search-item-result__item:first-child > a'),
  // ]);

  
  await page.emulateMediaType('screen');
  await page.pdf({ path: 'screenshot/shopee-cart.pdf', format: 'A4', printBackground: true });
  await page.waitForTimeout(2000);

  await browser.close();

};

scrape().then((value) => {
  console.log('Success', value); // Success!
});