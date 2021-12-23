import fs from 'fs';
import open from 'open';
import puppeteer from 'puppeteer';
import { startFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api.js';

async function captureReport() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const testUrl = 'https://web.dev/performance-scoring/';
  const flow = await startFlow(page, { name: 'Cold and warm navigations' });
  await flow.navigate(testUrl, {
    stepName: 'Cold navigation'
  });
  await flow.navigate(testUrl, {
    stepName: 'Warm navigation',
    configContext: {
      settingsOverrides: { disableStorageReset: true },
    },
  });

  await browser.close();

  const report = flow.generateReport();
  fs.writeFileSync('report/flow.report-2.html', report);
  open('report/flow.report-2.html', { wait: false });
}

captureReport();

