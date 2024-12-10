import puppeteer from 'puppeteer';
import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Credit Card Validator', () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    server = fork(path.join(__dirname, '../../e2e.server.js'));
    await new Promise((resolve, reject) => {
      server.on('message', (message) => {
        if (message === 'ok') resolve();
      });
      server.on('error', reject);
    });

    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  beforeEach(async () => {
    await page.goto('http://localhost:9000');
  });

  test('should validate card number', async () => {
    await page.type('.card-input', '4532015112830366');
    await page.click('.validate-btn');
    
    const dialog = await page.waitForDialog();
    expect(dialog.message()).toBe('Номер карты валиден');
    await dialog.accept();
  });
});