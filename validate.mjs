const mod = await import('file:///C:/Users/Liwei/AppData/Local/Programs/DeepSeek%20Harness/resources/app/dsh/node_modules/@deepseek-ai/dsh-plugin-market-index/lib/index.js')
const { parseMarketIndex } = mod.default ?? mod
const fs = await import('node:fs')
const raw = fs.readFileSync('./plugin-index/index.json', 'utf8')
const url = 'https://raw.githubusercontent.com/LIWEI_GITHUB/dsh-plugins/main/index.json'
try {
  const parsed = parseMarketIndex(JSON.parse(raw), url)
  console.log('VALID. title =', JSON.stringify(parsed.title), 'plugins =', parsed.plugins.length)
  for (const p of parsed.plugins) {
    console.log(' -', p.name, 'versions:', p.versions.map((v) => v.version).join(','), 'source:', JSON.stringify(p.versions[0].source))
  }
} catch (e) {
  console.log('INVALID at', e.path, '->', e.reason)
}
