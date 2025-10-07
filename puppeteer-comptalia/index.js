const puppeteer = require('puppeteer-core');
require('dotenv').config();

const automateComptalia = async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: 'wss://production-sfo.browserless.io?token=2TBtQbpffGwwgtGc1cf4a344aad6b878f1478ddc86d2509d4',
  });

  const page = await browser.newPage();

  await page.goto('https://www.comptalia.com/connexion');

  await page.type('#email', process.env.LOGIN);
  await page.type('#password', process.env.PASSWORD);

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation()
  ]);

  const studentName = process.env.STUDENT_NAME;
  await page.goto('https://www.comptalia.com/dashboard/corrections');

  await page.waitForSelector('.student-name');
  const studentLink = await page.evaluate((studentName) => {
    const elements = [...document.querySelectorAll('.student-name')];
    const match = elements.find(el => el.innerText.includes(studentName));
    return match?.closest('a')?.href;
  }, studentName);

  if (studentLink) {
    await page.goto(studentLink);
    await page.waitForSelector('a.download-copy');
    await page.click('a.download-copy');
    console.log('Téléchargement terminé.');
  } else {
    console.log('Étudiant non trouvé.');
  }

  await browser.close();
};

automateComptalia();
