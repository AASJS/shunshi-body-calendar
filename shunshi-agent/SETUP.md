# 顺时 · 对答智能体 · 安装与运行

> 两套形态，按需要选：**L1 Skill 包**（本目录，注册进 WorkBuddy / 任意对话模型）与
> **L2 单文件工作站**（`/workspace/顺时对答智能体.html`，离线可直接双击打开，无需注册）。

---

## 一、L1 Skill 包

### 注册

把本目录整体放到 skills 目录（例如 `~/.codebuddy/skills/shunshi-agent/`），
或在 WorkBuddy 里指向 `/workspace/shunshi-agent/`。`agents/openai.yaml` 提供
`display_name` / `default_prompt` / `policy`，供支持该格式的客户端读取。

### 知识源路径（全部在 `/workspace`，只读引用，不复制）

| 用途 | 路径 |
|---|---|
| System Prompt 全文 | `顺时对答智能体-方案.md` 第九节 |
| 能力层事实来源 | `顺时对答智能体-方案.md` 第三节 |
| 历法 / 定位 / 天气 | `today-info.snippet.js`、`today-info.html`、`paiban-today-info/` |
| 规则引擎 | `身体日历-县级联动.html`（`buildCalendar` / `weatherRules` / `profileOf`，已挂 `module.exports`） |
| 长页模板 | `中医身体日历-2026-11-08-立冬-陕西汉中西乡县.md` / `.html` |
| 卡片模板 | `国风养生日历卡-西乡县.html`、`国风养生日历卡.html` |
| 皮肤字典 | `国风天气模板-设计说明.md` |
| 安全边界 | `huangdi-neijing-body-calendar/skills/huangdi-neijing-body-calendar/references/safety-boundary.md` |
| 流程图 | `顺时对答智能体-流程图.html`、`顺时对答智能体-用户使用流程图.html` |

### 天气接口（可选联网）

- Forecast：`https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=Asia%2FShanghai&forecast_days=1`
- Air Quality：`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=..&longitude=..&current=us_aqi,pm2_5&timezone=Asia%2FShanghai`
- **断网处理**：不编数字，标注「天气缺席」，只用节气基调 + 区县气候画像生成。
- 取值时刻必须写进「落款说明」与卡面「依据」。

### 输出目录

默认写 `/workspace/`，命名约定：

```
中医身体日历-YYYY-MM-DD-节气-省市区县.md / .html / .png
国风养生日历卡-省市区县.html
养生日历卡-9x16-皮肤名-省市区县.png
```

### 本地记忆

| 键 | 内容 |
|---|---|
| `jx_loc` | 上次确认的县级位置（省 / 市 / 区县 / code / 坐标） |
| `jx_cal_loc` | 身体日历联动页使用的位置 |
| `shunshi_profile` | 个人情况（年龄 / 自述感受），**只存本机，不上传** |
| `shunshi_last` | 上次生成的完整 `cal` + 天气 + 皮肤 + 日期，用于刷新恢复与 `?export=1` 单开链接直接出图 |

---

## 二、L2 单文件工作站

文件：`/workspace/顺时对答智能体.html`

- **零依赖、零配图、零 SVG**，双击即可用；所有算法、区划表、皮肤、模板内嵌。
- 左侧对话区：自然语言输入 → 意图路由 → 槽位抽取 → 确认 → 生成 / 修订 / 解释 / 边界拒答。
- **第②步固定「一句话三段式」**：年龄 + 身体状况（需要照顾的情况）+ 所在城市（省 / 市 / 区县）；只写到市级会列出该市区县按钮，点一下补齐，不反复追问、不猜县。
- 右侧产物区：Tab 切换「长页」与「9:16 卡」，同一份 `cal` 派生，实时渲染。
- 工具栏：换一套皮肤（10 套）、复制文案、下载长页 MD、下载卡片 HTML、清空记忆、导出模式。
- **导出模式（本轮新增）**：右上角四个按钮 —— 「看长页 / 看 9:16 卡」切视图、「长页 PNG」「9:16 卡 PNG」一键下载、「2x」切倍率；再加「退出导出」。
  - 长页 PNG：整页长图，1080 宽 × 自适应高（本次 3470），2x 高清 2160×6940。
  - 9:16 卡 PNG：精确 1080×1920，2x 高清 2160×3840；切 1x 即 1080×1920。
  - 按 **C** 隐藏 / 显示工具条与提示（手动截图用），按 Esc 退出。
- PNG 导出是纯前端：产物 DOM + 全量内联 CSS → 一次性 foreignObject → canvas → PNG；**svg 只作为 data URL 交给 Image，从不插入页面 DOM**，页面与卡面仍零配图。
- `?export=1`（卡视图）/ `?export=long`（长页视图）/ `?export=1&skin=N`（指定套号）/ `&scale=1`（原尺寸）：单开链接直接进对应导出态，刷新恢复上次产物后即可下载。
- 建议用 `python3 -m http.server` 起本地服务，`file://` 下 IP 定位会被浏览器安全策略拦（不影响手动选区县）。

### 验证命令

```bash
# JS 语法
node --check <(sed -n '/<script>/,/<\/script>/p' 顺时对答智能体.html | sed '1d;$d')
# 无 SVG / 无 img / 无 emoji 检查
grep -c -E '<svg|<img|data:image' 顺时对答智能体.html
```

---

## 三、三档落地对照

| 档 | 形态 | 什么时候用 |
|---|---|---|
| L0 | 把方案第九节 System Prompt 贴进任意对话模型 + `/workspace` 作知识源 | 立刻试跑，0 配置 |
| **L1** | 本 Skill 包 | 想在 WorkBuddy 里当成一个「智能体」调用、可配默认 prompt |
| **L2** | 单文件 HTML 工作站 | 想要看得见、能点、能离线跑、能直接导出的成品 |

> L1 与 L2 共用同一套协议（意图 / 槽位 / `cal` / 安全闸门 / 交付契约），改规则时两边同步。
