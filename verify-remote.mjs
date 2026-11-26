// 端到端校验：从 GitHub raw 拉回索引，用官方校验器解析，并与本地文件比对。
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const url = 'https://raw.githubusercontent.com/delicated-cate/dsh-plugins/main/index.json'

const res = await fetch(url)
console.log('HTTP', res.status, '|', res.headers.get('content-type'), '|', res.headers.get('content-length'), 'bytes')
if (!res.ok) process.exit(1)
const remote = await res.text()

const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16)
const local = readFileSync(join(here, 'index.json'), 'utf8')
console.log('remote sha', sha(remote), ' local sha', sha(local), sha(remote) === sha(local) ? '(一致)' : '(不一致)')

const mod = await import(
  'file:///C:/Users/Liwei/AppData/Local/Programs/DeepSeek%20Harness/resources/app/dsh/node_modules/@deepseek-ai/dsh-plugin-market-index/lib/index.js'
)
const parsed = mod.parseMarketIndex(JSON.parse(remote), url)
console.log('VALID from remote. plugins =', parsed.plugins.length)
for (const p of parsed.plugins) {
  const v = p.versions[0]
  console.log(' -', p.name, '|', v.version, '|', JSON.stringify(v.source))
}
