import { chromium } from 'playwright';

const url = process.argv[2] ?? 'https://pablogventura.github.io/algoritmos/algo/binary-search';
const errors = [];

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', (e) => errors.push(`PAGE: ${e.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`CONSOLE: ${msg.text()}`);
});

await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);

const h1 = await page.locator('h1').count();
const rootText = await page.locator('#root').innerText();
console.log('URL:', url);
console.log('H1:', h1);
console.log('ROOT:', rootText.slice(0, 300));
console.log('ERRORS:', errors.length ? errors : 'none');

await browser.close();
process.exit(errors.length || h1 === 0 ? 1 : 0);
