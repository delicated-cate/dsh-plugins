// 用官方校验器校验 index.json。改完索引先跑这个，输出 VALID 再推。
// 路径相对本文件解析，因此在任何目录下执行都一样。
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const INDEX = join(here, 'index.json')

const VALIDATOR_PATHS = [
  'file:///C:/Users/Liwei/AppData/Local/Programs/DeepSeek%20Harness/resources/app/dsh/node_modules/@deepseek-ai/dsh-plugin-market-index/lib/index.js',
]

let parseMarketIndex
for (const p of VALIDATOR_PATHS) {
  try {
    const mod = await import(p)
    parseMarketIndex = mod.parseMarketIndex ?? mod.default?.parseMarketIndex
    if (parseMarketIndex) break
  } catch {}
}
if (!parseMarketIndex) {
  console.error('找不到官方校验器，请确认 DSH 安装路径，并更新 VALIDATOR_PATHS。')
  process.exit(2)
}

const raw = readFileSync(INDEX, 'utf8')
// 市场会用真实索引地址解析相对 icon，这里用占位地址即可。
const indexUrl = process.env.INDEX_URL ?? 'https://raw.githubusercontent.com/YOUR_GH_USER/dsh-plugins/main/index.json'

try {
  const parsed = parseMarketIndex(JSON.parse(raw), indexUrl)
  console.log('VALID. title =', JSON.stringify(parsed.title), 'plugins =', parsed.plugins.length)
  for (const p of parsed.plugins) {
    console.log(' -', p.name, '| versions:', p.versions.map((v) => v.version).join(','), '| source:', JSON.stringify(p.versions[0].source))
  }
} catch (e) {
  console.error('INVALID at', e.path, '->', e.reason)
  process.exit(1)
}
