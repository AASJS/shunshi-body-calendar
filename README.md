# 顺时项目 · 资产库

> 中医身体日历 / 国风养生日历卡 / 顺时对答智能体
> 离线单文件工作站 + L1 Skill 包 + 方案与索引文档
> 沉淀日期：2026-11-08

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC_BY--NC_4.0-orange)](LICENSE)
[![在线试用](https://img.shields.io/badge/在线试用-GitHub_Pages-2ea44f)](https://aasjs.github.io/shunshi-body-calendar/)
[![访问统计](https://komarev.com/ghpvc/?username=AASJS&label=%E8%AE%BF%E9%97%AE&color=a05a2c&style=flat&short=true)](https://aasjs.github.io/shunshi-body-calendar/)
[![Stars](https://img.shields.io/github/stars/AASJS/shunshi-body-calendar?style=social)](https://github.com/AASJS/shunshi-body-calendar/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/AASJS/shunshi-body-calendar/main)](https://github.com/AASJS/shunshi-body-calendar/commits/main)
[![更新日志](https://img.shields.io/badge/更新日志-CHANGELOG-blue)](CHANGELOG.md)

**👉 在线试用（GitHub Pages，免下载）：<https://aasjs.github.io/shunshi-body-calendar/>**

## 效果速览

<table>
  <tr>
    <td align="center"><img src="png/%E4%B8%AD%E5%8C%BB%E8%BA%AB%E4%BD%93%E6%97%A5%E5%8E%86-%E9%95%BF%E9%A1%B5-2026-11-08.png" width="200" alt="中医身体日历 · 长页"><br><sub><b>中医身体日历 · 长页</b><br>2026-11-08 立冬 · 陕西汉中西乡县</sub></td>
    <td align="center"><img src="png/%E5%9B%BD%E9%A3%8E%E5%85%BB%E7%94%9F%E6%97%A5%E5%8E%86%E5%8D%A1-9x16-2026-11-08.png" width="300" alt="国风养生日历卡"><br><sub><b>国风养生日历卡 · 9:16</b><br>1080×1920 · 可导出 2x 高清</sub></td>
    <td align="center"><img src="png/%E9%A1%BA%E6%97%B6%E6%99%BA%E8%83%BD%E4%BD%93-%E7%94%9F%E6%88%90%E7%A4%BA%E4%BE%8B-9x16.png" width="300" alt="顺时对答智能体 · 生成示例"><br><sub><b>顺时对答智能体</b><br>对答生成 · 对话导出 PNG</sub></td>
  </tr>
</table>

## 一句话

以《黄帝内经》四时养生为基调，结合区县气候画像与当日天气生成「中医身体日历」长页；再以长页为**单一数据源**，向下派生 3 张 9:16 竖图或一份详细文字报告。全程不诊断、不开方、不判吉凶、不承诺疗效。

## 三个入口

| 入口 | 文件 | 用途 |
|---|---|---|
| **生成** | [`顺时对答智能体.html`](%E9%A1%BA%E6%97%B6%E5%AF%B9%E7%AD%94%E6%99%BA%E8%83%BD%E4%BD%93.html)（[在线试用](https://aasjs.github.io/shunshi-body-calendar/%E9%A1%BA%E6%97%B6%E5%AF%B9%E7%AD%94%E6%99%BA%E8%83%BD%E4%BD%93.html)） | 对答式收集「年龄 + 身体状况 + 省/市/区县」，生成身体日历长页与国风养生日历卡；对话里说「导出卡片 / 导出长页 / 两份都要」直接下载 PNG |
| **派生** | [`中医身体日历-一源多出.html`](%E4%B8%AD%E5%8C%BB%E8%BA%AB%E4%BD%93%E6%97%A5%E5%8E%86-%E4%B8%80%E6%BA%90%E5%A4%9A%E5%87%BA.html) | 长图母版 → 3 张 9:16 竖图 / 详细文字报告，三视图切换，PNG、MD、HTML 导出 |
| **检索** | [`资产沉淀-资产看板.html`](%E8%B5%84%E4%BA%A7%E6%B2%89%E6%B7%80-%E8%B5%84%E4%BA%A7%E7%9C%8B%E6%9D%BF.html) | 全部资产可搜索、按层级/类型筛选、复制相对路径 |

三个入口均为单文件离线 HTML，下载后双击即用，无需联网；也可以直接点上面的「在线试用」在浏览器里跑。

## 目录导航

| 目录 / 文件 | 内容 |
|---|---|
| `shunshi-agent/` | **L1 Skill 包**：`SKILL.md`（角色边界/状态机/槽位/工作流）、`SETUP.md`、`agents/openai.yaml`、`assets/` 4 份、`references/` 4 份、`eval/` 3 份 |
| `jingxin-gzh-content-skill/` | 公众号内容 Skill 包：六段反共识骨架、素材偏好、风格边界、评估用例、示例文 |
| `paiban-today-info/` | 排版助手「自动生成 + localStorage 本地记忆」模块 |
| `顺时对答智能体.html` | L2 单文件离线对答工作站（左对答 / 右长页与卡预览 / 对话导出 PNG） |
| `中医身体日历-一源多出.html` | 一源多出工作站（三视图 / 双 PNG 导出 / 报告 / 窄屏自适应） |
| `身体日历-县级联动.html` | 能力内核：节气基调 + 2995 县级区划 + 当日天气增量 |
| `国风养生日历卡*.html` | 10 套国风皮肤与定版卡模板（宣纸底、墨色、朱砂、黛蓝、金） |
| `中医身体日历-详细文字报告.md / .html` | 18 个二级章节、10 张表、附录 A–D |
| `顺时对答智能体-方案.md` | 智能体设计方案（含 14.5 三段式槽位、14.6 双 PNG 导出） |
| `资产沉淀-顺时项目总索引.md` | 六层模型、逐层清单、依赖图、复用 SOP、ima 归档映射 |
| `资产沉淀-资产看板.html` | 可检索离线看板 |
| `*-流程图.html` / `*-使用图-9x16.html` | 系统流程图、用户使用流程图与 3 张 9:16 使用图 |
| `png/` | 16 张成品图导出备份（9:16 卡、长页、流程图、十套配色一览） |

> **路径说明**：仓库保持工作区原有平铺结构，PNG 单独归 `png/` 目录，两者互不依赖。`shunshi-agent/SETUP.md` 与方案文档里写死了相对路径，移动文件会让引用失效，请勿重组目录。

## 三层产物关系

```
中医身体日历 · 长页（母版，单一内容源）
├─ 3 张 9:16 竖图（社媒分发 1080×1920，导出 2x 2160×3840）
│   1 天时总纲   2 宜忌作息   3 运动边界
└─ 详细文字报告（公众号正文 / 存档，18 章 + 附录 A–D）
```

## 导出说明

- 工作站内的「导出」按钮直接下载 PNG：**产物 DOM + 全量内联 CSS → `foreignObject` → `canvas.toBlob`**；`svg` 仅作临时 data URL，从不插入页面 DOM。
- 倍率 2x 高清 ↔ 1x 原尺寸一键切换；长页与 9:16 卡分别导出。
- 报告可复制全文、下载 Markdown / HTML、打印存 PDF。
- 页面支持窄屏自适应（手机 390px 已实测）：预览按视口宽度等比缩放，点预览放大到 1:1 可左右滑动，再点复原。

## 安全边界

- 不诊断、不开方药 / 药膳 / 穴位、不判吉凶、不承诺疗效。
- 默认中低强度运动（RPE 9–11 / 谈话测试），红旗症状保守提示「立即停止并就医」。
- 所有产物均标注：不替代医疗建议。

## 技术约束

- 单文件离线 HTML，零外部依赖（无 CDN / 外部字体 / 网络请求）。
- 零配图：产物与工作站页面均不含 SVG、位图、emoji。
- 本地记忆键 `shunshi_last`，仅存于浏览器 localStorage，不上传任何数据。
- 参考上游仓库 `huangdi-neijing-body-calendar` 为只读学习来源，未收录本库。

## 快速上手

1. 点「[在线试用](https://aasjs.github.io/shunshi-body-calendar/)」直接开始，或下载 `顺时对答智能体.html` 双击用浏览器（推荐 Chrome/Edge）打开。
2. 按提示回答三件事：年龄、身体状况（需要照顾的情况）、所在城市（省/市/区县）。
3. 生成后右侧预览长页与 9:16 卡，说「导出卡片」即可下载 PNG；也可用「导出模式」批量出图。
4. 想从已有长页派生竖图或报告，改用 `中医身体日历-一源多出.html`。

## 许可与使用

- 本库以 **CC BY-NC 4.0**（署名—非商业性使用）许可发布，详见 [LICENSE](LICENSE)；引用请注明出处。
- 内容仅供健康生活参考，不构成医疗建议；就医请遵医嘱。
- 生成产物（日历卡、报告）可自由用于个人公众号与社媒发布（非商业用途）。

## 更新日志

- **v1.1.0（2026-11-08）**：GitHub Pages 在线试用站点、CC BY-NC 4.0 许可证、README 效果速览与徽章
- **v1.0.0（2026-11-08）**：首次发布——智能体 / 一源多出 / 县级联动内核 / 国风日历卡 / Skill 包 / 文档索引 / 16 张成品图

完整记录见 [CHANGELOG.md](CHANGELOG.md)。
