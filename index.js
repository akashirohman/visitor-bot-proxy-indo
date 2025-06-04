const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const TARGET_URL = 'https://c4up.me'; // Ganti dengan URL kamu
const TOTAL_VISITORS = 100000;
const CONCURRENCY = 5;

const userAgents = [
  // Gabungan mobile & desktop user-agent Anda
  'Mozilla/5.0 (Linux; Android 13; SM-S908E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.198 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1',
  // Tambahkan sisanya sesuai kebutuhan...
];

let active = 0;
let completed = 0;

async function visitPage(userAgent) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8' });

    await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(Math.floor(Math.random() * 3000) + 2000); // 2–5 detik
    await browser.close();

    console.log('[✓] Success:', userAgent);
  } catch (err) {
    console.log('[✗] Gagal:', err.message);
  } finally {
    active--;
    completed++;
    if (completed < TOTAL_VISITORS) next();
    else if (active === 0) console.log('Selesai semua permintaan.');
  }
}

function next() {
  while (active < CONCURRENCY && completed + active < TOTAL_VISITORS) {
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    active++;
    visitPage(userAgent);
  }
}

next();
