import { chromium, devices } from 'playwright'

const BASE = 'http://localhost:5174'
const browser = await chromium.launch()

async function capture(page, label, file) {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const dots = page.getByRole('button', { name: /go to slide/i })
  await dots.first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  const count = await dots.count()
  console.log(`${label}: ${count} dots`)
  await page.screenshot({ path: file })
}

const dp = await browser.newContext({ viewport: { width: 1280, height: 700 } }).then((c) => c.newPage())
await capture(dp, 'desktop', 'shots/dots-desktop.png')

const mp = await browser.newContext({ ...devices['iPhone 12'] }).then((c) => c.newPage())
await capture(mp, 'mobile', 'shots/dots-mobile.png')

await browser.close()
console.log('done')
