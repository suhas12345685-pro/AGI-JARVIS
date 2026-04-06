const axios = require('axios');
const cheerio = require('cheerio');

async function search(params) {
  const { query } = params;
  // Uses DuckDuckGo HTML search as a free fallback
  const res = await axios.get('https://html.duckduckgo.com/html/', {
    params: { q: query },
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JARVIS/1.0)' },
    timeout: 10000,
  });
  const $ = cheerio.load(res.data);
  const results = [];
  $('.result').each((i, el) => {
    if (i >= 5) return false;
    const title = $(el).find('.result__title').text().trim();
    const snippet = $(el).find('.result__snippet').text().trim();
    const url = $(el).find('.result__url').text().trim();
    if (title) results.push({ title, snippet, url });
  });
  return JSON.stringify(results);
}

async function fetch(params) {
  const { url } = params;
  const res = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JARVIS/1.0)' },
    timeout: 15000,
    maxContentLength: 1024 * 1024, // 1MB limit
  });
  const $ = cheerio.load(res.data);
  // Extract text content, removing scripts and styles
  $('script, style, nav, footer, header').remove();
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  return text.substring(0, 5000);
}

module.exports = { search, fetch };
