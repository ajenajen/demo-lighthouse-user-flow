const puppeteer = require('puppeteer');

let scrape = async () => {

  const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	const viewports = [1366, 768, 320];

	for (let i = 0; i < viewports.length; i++) {
		// Arrange
		await page.goto("http://www.google.com");
		let vw = viewports[i];
		await page.setViewport({
			width: vw,
			height: 1000
		});

		// Action
		await page.type('input[name=q]', 'สวัสดี Puppeteer');
		await page.screenshot({
			path: `screenshot/screen-${vw}.png`,
			fullPage: true
		});

		await page.keyboard.press('Enter');
		await page.waitForNavigation();
		await page.screenshot({
			path: `screenshot/screen-${vw}-result.png`,
			fullPage: true
		});

	}

	await browser.close();
};

scrape().then((value) => {
  console.log('Success', value); // Success!
});