# 能力映射 · 文件 → 可调用工具

> 智能体不直接「读文件写字」，而是按下面的契约调度既有资产。
> 这样 L0（纯提示词）、L1（Skill 包）、L2（HTML 工作站）共用同一套协议。
> 设计原则：**不重写、不复制算法**。

---

## 工具清单

| 工具名 | 来源文件 | 输入 → 输出 | 失败降级 |
|---|---|---|---|
| `area.resolve()` | `身体日历-县级联动.html` → `JXArea.search()` / `provinces` / `cities` / `counties` / `fmt` | `"西乡县"` → `{省, 市, 县, code, lat, lon}` | 同名给候选按钮；离线表始终可用 |
| `area.remember()` | `today-info.html` / `身体日历-县级联动.html` → `localStorage` 的 `jx_loc` / `jx_cal_loc` | 上次选过的县级位置 | 无记忆 → IP 到市级 + 追问一次区县 |
| `cal.lunar()` | `today-info.snippet.js` / `身体日历-县级联动.html` 内农历 + 太阳黄经算法 | `date` → `{农历, 干支, 节气, 第N天, 距下一节气}` | 纯离线 1900–2100，不失败 |
| `weather.now()` | Open-Meteo Forecast + Air Quality | `lat,lon,date` → `{temp,tmax,tmin,hum,wind,gust,uv,rain,aqi,sunrise,sunset,code}` | 断网 → 用区县气候画像，标注「天气缺席」 |
| `cal.build(ctx)` | `身体日历-县级联动.html` → `buildCalendar(ctx)` | `ctx{date,loc,weather,profile}` → **结构化 `cal`** | 节气基调层始终可用 |
| `cal.why()` | 同上 `weatherRules(w)` | 返回每条调整的 `why`（触发原因） | 供 `explain` 意图直接回答 |
| `render.long()` | `中医身体日历-2026-11-08-立冬-陕西汉中西乡县.md` / `.html` | `cal` → MD / HTML / **整页长图 PNG**（导出模式「长页 PNG」） | MD 永远能出 |
| `skin.pick(w)` | `国风天气模板-设计说明.md` 映射表 | `weather` → 套号 1–10 | 无匹配则随机；用户指定优先 |
| `render.card()` | `国风养生日历卡-西乡县.html` | `cal` 12 字段 + `skin` → HTML；导出模式「9:16 卡 PNG」→ 1080×1920 PNG | 卡面只留依据 |
| `safety.gate()` | `references/safety-boundary.md` | 用户输入 → `{pass / refuse / conservative}` | **前置，先于一切生成** |
| `content.adapt()`（可选） | `jingxin-gzh-content-skill/` | `cal` → 公众号稿 | 不触发即跳过 |

---

## 资产盘点（方案的地基）

| 组 | 路径 | 提供什么 |
|---|---|---|
| ① 原 Skill 骨架 | `huangdi-neijing-body-calendar/skills/huangdi-neijing-body-calendar/` | 10 字段定义、工作流 5 步、红旗清单、Gotchas G1–G5、Skill 工程化分层 |
| ② 历法 / 定位 / 天气 | `today-info.snippet.js`、`today-info.html`、`paiban-today-info/` | `JXArea`（31 省 / 341 市 / 2995 区县离线）、农历节气、`jx_loc` 记忆 |
| ③ 规则引擎 | `身体日历-县级联动.html` | `buildCalendar(ctx)` 三层叠加，每条调整带 `why` |
| ④ 长页成品 | `中医身体日历-2026-11-08-立冬-陕西汉中西乡县.md` / `.html` / `.png` | 10 字段 + 今日档案 + 个人化说明 + 四层依据 + 风险表 |
| ⑤ 卡片成品 | `国风养生日历卡-西乡县.html`、`国风养生日历卡.html` | 12 卡面字段、`SKINS` 10 套、`?skin=N&export=1`、缩放控件、复制文案 |
| ⑥ 皮肤字典 | `国风天气模板-设计说明.md` | 10 套名称 / 天气意象 / 配色 token / 印章字 |
| ⑦ 内容风格（可选） | `jingxin-gzh-content-skill/` | 六段反共识骨架，用于把日历改写成公众号稿 |
| ⑧ 参考产物 | `养生日历卡-使用流程图.html`、`学习笔记-黄帝内经身体日历.md` | 流程图版式、原始学习结论 |

---

## 三层规则引擎（`cal.build` 内部）

```
TERM_DATA[节气]   → 节气基调（宜 / 不宜 / 饮食 / 运动 / 情志）
PROFILES[省市]    → 区县气候画像（光照 / 饮食 / 运动 / 情志）
weatherRules(w)   → 当日天气增量（降水 / 低温 / 高温 / 湿度 / 风 / UV / AQI，每条带 why）
        ↓
   cal = { dateText, lunarText, termLine, place, wxLine,
           theme, yi, bu, sleep, food, move, mind, risk,
           basis, oneLine, adjustments, chips }
```

---

## L2 复用要点

`buildCalendar` / `weatherRules` / `profileOf` 都是纯函数且已挂 `module.exports`，
可整段 `<script>` 复制进单文件工作站。`JXTodayInfo.insertBlock()` 可直接插排版助手正文。
对答 UI 只需三个区：**对话区 / 槽位确认卡 / 产物预览区**。

---

## 生成链路（单一数据源）

```
area.resolve + area.remember + cal.lunar + weather.now
                    ↓ ctx = {date, loc, weather, profile}
            cal.build(ctx)
                    ↓ 【唯一数据源 cal】
            ╱                        ╲
  分叉 A：长页 10 字段全量        分叉 B：卡片 12 字段压缩
  + 今日档案 + 个人化说明          + 皮肤自动选择
  + 四层依据 / 风险表              + 卡面只留「依据」
  → .md / .html / 长图 PNG         → .html + PNG
            ╲                        ╱
                    ↓
        对话文字告知：留意 + 落款说明 + 数据行
```
