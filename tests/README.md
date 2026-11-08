# 自动化回归测试

把项目的关键回归固化成可重复验证的测试：**生成结果、区县解析、PNG 导出、窄屏布局、医疗安全边界**。任何对规则库或页面的改动，跑一遍即可确认没有被误改。

## 运行方式

```bash
# 1. 核心回归（零依赖，Node 内置 test runner）
npm test

# 2. 浏览器回归（首次需安装 Chromium）
npm i
npx playwright install chromium
npm run test:browser
```

要求：Node ≥ 18（推荐 22）。仓库根目录的 `package.json` 已配好脚本。

## 覆盖范围

| 文件 | 覆盖内容 |
|---|---|
| `tests/core.test.mjs` | 区县解析（西乡县 / 眉县 / 成都市 / 南山区 / 直辖市 / 乱输入兜底）、生成结果（2026-11-08 立冬 · 西乡县的主题 / 农历 / 画像 / 分区完整性）、节气推算、**医疗安全边界**（红旗提示 / 中低强度 / 宜忌齐备 / 禁词）、可复现性 |
| `tests/browser.test.mjs` | **PNG 导出**（长图 1080×动态高 / 9:16 卡 1080×1920，校验 PNG 魔数与 IHDR 尺寸）、**窄屏布局**（320 / 390 / 768 / 1024 / 1440 五档无横向溢出）、说明页一键清除 localStorage 功能、页面无未捕获 JS 异常 |

## CI

`.github/workflows/test.yml` 在每次 push 时自动运行两组测试；浏览器测试在 Ubuntu runner 上安装 Chromium 后执行。
