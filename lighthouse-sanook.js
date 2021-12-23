import fs from 'fs';
import open from 'open';
import puppeteer from 'puppeteer';
import { startFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api.js';

async function captureReport() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Get a session handle to be able to send protocol commands to the page.
  const session = await page.target().createCDPSession();

  const testUrl = 'https://www.sanook.com/hot/';
  const flow = await startFlow(page, {
    name: 'Sanook CLS during navigation and on scroll', 
    configContext: {
      settingsOverrides: {
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 1,
          disabled: false,
        },
        formFactor: "mobile",
      },
    },
  });

  // Regular Lighthouse navigation.
  await flow.navigate(testUrl, { stepName: 'Navigate only' });

  // Navigate and scroll timespan.
  await flow.startTimespan({ stepName: 'Navigate and scroll' });
  await page.goto(testUrl, {
    waitUntil: 'load',
    timeout: 0
  });
  await page.waitForTimeout(3000);
  await session.send('Input.synthesizeScrollGesture', {
    x: 100,
    y: 0,
    yDistance: -1000,
    speed: 2000,
    repeatCount: 2,
    repeatDelayMs: 500,
  });
  await flow.endTimespan();
  await browser.close();

  const report = flow.generateReport();
  fs.writeFileSync('report/flow.report-sanook.html', report);
  open('report/flow.report-sanook.html', { wait: false });
}

captureReport();

