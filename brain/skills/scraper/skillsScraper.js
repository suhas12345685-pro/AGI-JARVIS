const axios   = require('axios');
const cheerio = require('cheerio');

async function scrapeLeaderboard() {
  const res = await axios.get('https://skills.sh', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JARVIS/1.0)' },
    timeout: 15000,
  });
  const $ = cheerio.load(res.data);
  const skills = [];

  $('a[href^="/"]').each((_, el) => {
    const href = $(el).attr('href');
    const match = href.match(/^\/([^/]+)\/([^/]+)\/([^/]+)$/);
    if (match) {
      const [, owner, repo, name] = match;
      const installs = $(el).find('[class*="install"]').text()
        .replace(/[^0-9.KM]/g, '') || '0';
      skills.push({
        owner, repo, name, installs,
        installCmd: `npx skills add ${owner}/${repo}/${name}`
      });
    }
  });

  return skills;
}

async function scrapeClawhub() {
  try {
    const { chromium } = require('playwright');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://clawhub.ai/skills?nonSuspicious=true');
    await page.waitForTimeout(4000);

    const skills = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-skill-name], [class*="skill-card"]'))
        .map(el => ({
          name: el.dataset.skillName || el.querySelector('h3')?.textContent,
          installCmd: `npx clawhub@latest install ${el.dataset.skillName}`
        })).filter(s => s.name)
    );

    await browser.close();
    console.log(`ClawhHub skills found: ${skills.length}`);
    return skills;
  } catch (err) {
    console.log(`ClawhHub scrape failed (expected if marketplace empty): ${err.message}`);
    return [];
  }
}

module.exports = { scrapeLeaderboard, scrapeClawhub };
