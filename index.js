const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

// Website tujuan
const TARGET_URL = 'https://c4up.me/';

// List user agent (bisa diperbanyak)
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  'Mozilla/5.0 (Linux; Android 10)',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2)',
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64)',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
];

// Ambil proxy dari Proxyscrape (Indonesia, http)
async function fetchProxies() {
  try {
    const res = await axios.get('https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=3000&country=ID&ssl=all&anonymity=all');
    return res.data.trim().split('\n').filter(Boolean);
  } catch (err) {
    console.error('[ERROR] Gagal ambil proxy:', err.message);
    return [];
  }
}

async function sendRequest(proxy, userAgent) {
  const agent = new HttpsProxyAgent(`http://${proxy}`);
  try {
    const res = await axios.get(TARGET_URL, {
      httpsAgent: agent,
      headers: { 'User-Agent': userAgent },
      timeout: 5000,
    });
    console.log(`[✓] Success: ${proxy} - ${userAgent}`);
  } catch (err) {
    console.log(`[✗] Gagal: ${proxy} - ${err.message}`);
  }
}

async function run() {
  const proxies = await fetchProxies();
  if (proxies.length === 0) {
    console.log('Tidak ada proxy tersedia.');
    return;
  }

  for (let i = 0; i < Math.min(20, proxies.length); i++) {
    const proxy = proxies[i];
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await sendRequest(proxy, userAgent);
  }
}

run();
