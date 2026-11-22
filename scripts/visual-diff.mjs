// Screenshots every story in a built Storybook and, if a baseline folder is
// given, reports the pixel difference per story.
//
//   npm run build-storybook
//   node scripts/visual-diff.mjs --static storybook-static --out shots/after --baseline shots/before
//
// The baseline can be the previous build, or exports from Penpot named by story
// id (for example picks-questioncard--open.png) to compare design against build.
import { createServer } from 'node:http'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import handler from 'serve-handler'
import puppeteer from 'puppeteer-core'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), [])
)
const staticDir = resolve(args.static ?? 'storybook-static')
const outDir = resolve(args.out ?? 'shots/current')
const baselineDir = args.baseline ? resolve(args.baseline) : null
const chrome = args.chrome ?? process.env.CHROME_PATH ?? '/usr/bin/google-chrome'
mkdirSync(outDir, { recursive: true })

const index = JSON.parse(readFileSync(resolve(staticDir, 'index.json'), 'utf8'))
const stories = Object.values(index.entries).filter((e) => e.type === 'story')

const server = createServer((req, res) => handler(req, res, { public: staticDir, cleanUrls: false }))
await new Promise((r) => server.listen(0, r))
const base = `http://localhost:${server.address().port}`

const browser = await puppeteer.launch({ executablePath: chrome, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 600, height: 500, deviceScaleFactor: 2 })

const rows = []
for (const story of stories) {
  await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {})
  await page.evaluate(() => document.fonts.ready)
  // Let the fade-up animation finish so frames are comparable.
  await new Promise((r) => setTimeout(r, 900))
  const el = await page.$('#storybook-root')
  const file = resolve(outDir, `${story.id}.png`)
  await el.screenshot({ path: file })

  let diffPct = null
  const basePng = baselineDir && resolve(baselineDir, `${story.id}.png`)
  if (basePng && existsSync(basePng)) {
    const a = PNG.sync.read(readFileSync(basePng))
    const b = PNG.sync.read(readFileSync(file))
    if (a.width !== b.width || a.height !== b.height) {
      diffPct = 100
    } else {
      const diff = new PNG({ width: a.width, height: a.height })
      const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 })
      diffPct = +((n / (a.width * a.height)) * 100).toFixed(4)
      if (n > 0) writeFileSync(resolve(outDir, `${story.id}.diff.png`), PNG.sync.write(diff))
    }
  }
  rows.push({ story: story.id, diffPct })
}
await browser.close()
server.close()

writeFileSync(resolve(outDir, 'report.json'), JSON.stringify(rows, null, 2))
console.table(rows)
