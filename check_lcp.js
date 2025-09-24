const puppeteer = require('puppeteer');

async function checkLCP() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Enable performance monitoring
  await page.setCacheEnabled(false);
  
  // Listen for LCP events
  await page.evaluateOnNewDocument(() => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime, 'ms');
      console.log('LCP Element:', lastEntry.element);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  });
  
  console.log('Loading web.dev...');
  await page.goto('https://web.dev', { waitUntil: 'networkidle0' });
  
  // Wait a bit for LCP to be measured
  await page.waitForTimeout(3000);
  
  // Get LCP from performance metrics
  const lcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve({
          lcp: lastEntry.startTime,
          element: lastEntry.element?.tagName || 'unknown'
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Fallback timeout
      setTimeout(() => resolve({ lcp: 'timeout', element: 'unknown' }), 5000);
    });
  });
  
  console.log('LCP Result:', lcp);
  
  await browser.close();
}

checkLCP().catch(console.error);
