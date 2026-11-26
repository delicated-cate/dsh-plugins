# dsh-plugins

自建 DSH 插件市场索引。一个 JSON 文件，配到 Plugins → Discover 之后，`plugin_market` 工具就能搜到这里的条目。

## 目录

```
index.json     索引本体（format 1）
validate.mjs   用官方校验器校验，改完先跑这个
.gitignore     忽略 node_modules 等
```

## 改完先校验

```sh
node validate.mjs
```

它直接调用 `@deepseek-ai/dsh-plugin-market-index` 的 `parseMarketIndex`，也就是 DSH 市场读取索引时跑的同一段代码。输出 `VALID` 才推。

## 格式速查

必填：

| 位置 | 规则 |
|---|---|
| `format` | 数字 `1` |
| `title` | 字符串，或 `{语言: 文本}`——对象形式**必须含 `en`** |
| `plugins[].name` | 合法 npm 包名，同一份索引内不得重复 |
| `plugins[].versions` | 非空数组 |
| `versions[].version` | 精确 SemVer |
| `versions[].publishTimestamp` | Unix **秒**，整数 |
| `versions[].source` | `{"type":"npm"}` 或 `{"type":"git","url","commit","path"?}` |

Git 源的硬约束：`url` 必须 https 且以 `.git` 结尾、至少两段路径；`commit` 是 **40 位小写 hex**，必须是已推送的提交，不能写分支名。

可选：`description`、`icon`（https 或 `data:` base64 ≤32 KiB）、`author`、`homepage`、`repository`、`metadata.category/keywords/labels`、`versions[].engines.dsh`。

## 发布

推送后有二选一：

- **raw**：`https://raw.githubusercontent.com/<user>/<repo>/main/index.json`
- **Pages**：Settings → Pages → 分支 `main`、目录 `/` → `https://<user>.github.io/<repo>/index.json`

**不要**用 `github.com/<user>/<repo>/blob/main/index.json`：那是 HTML 页面，而且市场拒绝重定向。

## 配到 DSH

Plugins → **Discover** → 添加索引源 → 粘上面的 URL。

## 更新生效时间

索引有 10 分钟缓存（`cacheTtlMs` 默认 600000）。改完推上去，等一会儿或在 Discover 里强制刷新。

## 限制

- 索引公开可读，市场不支持凭据；别往里写内网地址或私有 token。
- 市场只负责展示与生成安装目标；包本身还在 npm 或 Git 上。
- `icon` 用相对路径会按索引的 origin 解析，跨域必须 https 或 `data:`。
