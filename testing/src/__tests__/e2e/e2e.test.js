import puppeteer from 'puppeteer';
import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, './e2e.server.js');

jest.setTimeout(300000);

describe('Credit Card Validator form', () => {
  let browser;
  let page;
  let server;
  const baseUrl = 'http://localhost:9000';

  // Запускаем сервер один раз перед всеми тестами
  beforeAll(async () => {
    // Убеждаемся, что порт свободен
    try {
      const killPort = async (port) => {
        const cmd = process.platform === 'win32' 
          ? `netstat -ano | findstr :${port}`
          : `lsof -i:${port}`;
        
        const { exec } = require('child_process');
        await new Promise((resolve, reject) => {
          exec(cmd, (error, stdout, stderr) => {
            if (stdout) {
              const pid = process.platform === 'win32'
                ? stdout.split('\n')[0].split(' ').filter(Boolean).pop()
                : stdout.split('\n')[0].split(' ')[1];
              
              const killCmd = process.platform === 'win32'
                ? `taskkill /F /PID ${pid}`
                : `kill -9 ${pid}`;
              
              exec(killCmd);
            }
            resolve();
          });
        });
      };

      await killPort(9000);
    } catch (error) {
      console.error('Error killing port:', error);
    }

    console.log('Starting server...');
    server = fork(serverPath);

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server start timeout'));
      }, 30000);

      server.on('message', (message) => {
        if (message === 'ok') {
          clearTimeout(timeout);
          resolve();
        }
      });

      server.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });

    console.log('Starting browser...');
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 250,
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setDefaultTimeout(30000);
    
    try {
      await page.goto(baseUrl, { 
        waitUntil: 'networkidle0',
        timeout: 30000 ,
      });
      await page.waitForSelector('.card-validator', { timeout: 10000 });
    } catch (error) {
      console.error('Page load error:', error);
      throw error;
    }
  });

  afterEach(async () => {
    // Закрываем страницу после каждого теста
    if (page) {
      await page.close();
    }
  });

  afterAll(async () => {
    // Останавливаем сервер после всех тестов
    if (browser) {
      await browser.close();
    }
    if (server) {
      server.kill();
    }
  });

  test('should validate correct VISA card number', async () => {
    // const input = await page.$('.card-input');
    // await input.type('4532015112830366');

    // const validateButton = await page.$('.validate-btn');
    // await validateButton.click();

    // page.on('dialog', async (dialog) => {
    //   expect(dialog.message()).toBe('Номер карты валиден');
    //   await dialog.accept();
    // });
    await page.waitForSelector('.card-input', { visible: true });
    const input = await page.$('.card-input');
    await input.type('4532015112830366');

    const validateButton = await page.$('.validate-btn');
    
    // Настраиваем обработчик диалога перед кликом
    const dialogPromise = new Promise(resolve => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Номер карты валиден');
        await dialog.accept();
        resolve();
      });
    });

    await validateButton.click();
    await dialogPromise;
  });

  test('should show invalid for incorrect card number', async () => {
    const input = await page.$('.card-input');
    await input.type('4532015112830367');

    const validateButton = await page.$('.validate-btn');
    
    const dialogPromise = new Promise(resolve => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Неверный номер карты');
        await dialog.accept();
        resolve();
      });
    });

    await validateButton.click();
    await dialogPromise;
  });

  test('should correctly handle VISA card validation', async () => {
    // Ждем загрузки формы
    await page.waitForSelector('.card-input', { visible: true });
    
    // Вводим номер VISA карты
    const input = await page.$('.card-input');
    await input.type('4532015112830366');
  
    // Проверяем, что изображение VISA стало активным
    const visaImage = await page.$('img[data-type="visa"]');
    const isVisaActive = await page.evaluate(
      element => element.classList.contains('active'),
      visaImage,
    );
    expect(isVisaActive).toBeTruthy();
  
    // Нажимаем кнопку валидации
    const validateButton = await page.$('.validate-btn');
    
    // Ждем и проверяем диалоговое окно
    const dialogPromise = new Promise(resolve => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Номер карты валиден');
        await dialog.accept();
        resolve();
      });
    });
  
    await validateButton.click();
    await dialogPromise;
  });
  
  test('should show error for empty input', async () => {
    // Ждем появления кнопки
    await page.waitForSelector('.validate-btn', { visible: true });
    const validateButton = await page.$('.validate-btn');
    
    // Проверяем кнопку перед нажатием
    const buttonDebug = await page.evaluate(() => {
      const btn = document.querySelector('.validate-btn');
      return {
        exists: !!btn,
        visible: btn ? window.getComputedStyle(btn).display !== 'none' : false,
        disabled: btn ? btn.disabled : true,
      };
    });
    console.log('Button debug:', buttonDebug);
  
    // Нажимаем кнопку с дополнительными параметрами
    const dialogPromise = new Promise(resolve => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Неверный номер карты');
        await dialog.accept();
        resolve();
      });
    });
  
    await validateButton.click({ 
      delay: 100,
      button: 'left',
      clickCount: 1,
    });
    
    await dialogPromise;
  });

  test('should show error for empty input', async () => {
    const validateButton = await page.$('.validate-btn');
    const dialogPromise = new Promise(resolve => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Неверный номер карты');
        await dialog.accept();
        resolve();
      });
    });
  
    await validateButton.click();
    await dialogPromise;
  });

  test('should format card number with spaces', async () => {
    const input = await page.$('.card-input');
    await input.type('4532015112830366');

    const inputValue = await page.evaluate(element => element.value, input);
    expect(inputValue).toBe('4532 0151 1283 0366');
  });

  test('should handle empty input', async () => {
    const validateButton = await page.$('.validate-btn');
    
    const dialogPromise = new Promise(resolve => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Неверный номер карты');
        await dialog.accept();
        resolve();
      });
    });

    await validateButton.click();
    await dialogPromise;
  });

  test('should apply valid class for correct number', async () => {
    const input = await page.$('.card-input');
    await input.type('4532015112830366');
    
    const validateButton = await page.$('.validate-btn');
    await validateButton.click();

    const hasValidClass = await page.evaluate(
      element => element.classList.contains('valid'),
      input,
    );

    expect(hasValidClass).toBeTruthy();
  });

  test('should apply invalid class for incorrect number', async () => {
    const input = await page.$('.card-input');
    await input.type('4532015112830367');
    
    const validateButton = await page.$('.validate-btn');
    await validateButton.click();

    const hasInvalidClass = await page.evaluate(
      element => element.classList.contains('invalid'),
      input,
    );

    expect(hasInvalidClass).toBeTruthy();
  });
});
