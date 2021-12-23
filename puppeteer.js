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
		await page.type('input[name=q]', 'สวัสดี');
		await page.screenshot({
			path: `screenshot/screen-${vw}.png`,
			fullPage: true
		});

		await page.keyboard.press('Enter');
		await page.waitForNavigation();  // defaults to 30 seconds
		await page.screenshot({
			path: `screenshot/screen-${vw}-result.png`,
			fullPage: true
		});

		// await page.pdf({ path: 'google.pdf', format: 'a4' });
		// https://github.com/puppeteer/puppeteer/blob/v13.0.0/docs/api.md#pagepdfoptions

	}

	await browser.close();
};

scrape().then((value) => {
  console.log('Success', value); // Success!
});



