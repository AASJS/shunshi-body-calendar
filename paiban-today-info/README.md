# 今日信息条 · 排版助手产品化模块（县级定位版）

参考「中医身体日历」HTML 的精华（自动生成 + localStorage 本地记忆 + 复制/前后日），
抽成一个**可嵌入公众号排版助手**的自包含组件。本目录两个文件已与 `/workspace/` 根目录的县级版同步。

## 文件

| 文件 | 用途 |
|------|------|
| `today-info.html` | **完整演示页**：打开即看效果，含省/市/区县三级选择、一键定位、搜索、前后日、刷新天气、复制 |
| `today-info.snippet.js` | **纯模块**：把这段整段粘贴进你的排版助手 HTML 即可用（无演示 UI） |

> 如果你之前往排版助手里粘过旧版片段，请**整段重新复制** `today-info.snippet.js` 覆盖，否则定位仍是市级。

## 功能

- **自动生成**：日期 · 星期 · 农历（干支年+月+日）· 节气（距下一节气 N 天）· **省市区县** · 实时天气
- **县级定位（已重构）**：全国 31 省 · 341 市 · 2995 个县级行政区**离线内置**；零境外依赖
- **本地记忆**：县级位置存 `localStorage`（键 `jx_loc`），选过一次后下次打开自动生效；城市键 `jx_city` 保留作手动兜底
- **离线友好**：行政区划、农历、节气纯 JS 离线计算（1900–2100）；仅天气（Open-Meteo）与自动 IP 定位需联网

## 定位链路（为什么改）

| 旧链路（不可用） | 新链路 |
|------|------|
| 浏览器 `geolocation` GPS | 国内 IP 定位（`myip.ipip.net`，带 CORS）自动到**市** |
| BigDataCloud 逆地理到区县 | **离线三级下拉 / 搜索**确认到**区县**（一次点选，永久记忆） |
| zhconvert 简繁转换 | 不再需要（数据本身就是简体） |
| Open-Meteo 中文地名检索 | `JXArea.search("双流区")` 离线模糊匹配 |

实测旧链路的失败点：Chrome 的 geolocation 走境外位置服务、`file://` 非安全上下文被拒；
BigDataCloud `-client` 端点明确禁用服务端调用并封 IP、`/data/reverse-geocode` 返回 403 限额；
Nominatim 超时；Open-Meteo 中文地名检索返回空结果。零密钥纯前端**IP 只能到市级**，
所以「区县确认一次 + 本机记忆」是唯一稳定路径。GPS 现在只用于增强天气坐标，失败不影响定位。

## 集成到排版助手（三步）

1. 把 `today-info.snippet.js` 整段复制到你的排版助手 HTML 的 `<script>` 里
2. 放一个按钮：
   ```html
   <button onclick="JXTodayInfo.insertBlock(document.getElementById('editor'))">插入今日信息</button>
   ```
   （`editor` 是你的正文编辑区，textarea 或 contenteditable 都支持）
3. 用户点一下，自动在文末插入一行「11月8日 星期日｜九月三十｜立冬（距小雪14天）｜四川省成都市双流区」

想要完整 UI，把演示页里 `provSel / citySel2 / countySel / areaInput / locBtn` 那套控件一起搬过去即可。

## 接口

```js
JXTodayInfo.getInfo(date?)        // → {dateText, lunar, solarTerm, termDay, weather, city, geo, full}
JXTodayInfo.getBlockText(date?)   // 纯文本（含县级，适合 textarea 追加）
JXTodayInfo.getBlockHTML(date?)   // HTML 片段（适合 contenteditable）
JXTodayInfo.insertBlock(el)       // 自动判断 textarea / contenteditable 并插入
JXTodayInfo.copy(date?)           // 复制到剪贴板
JXTodayInfo.locate()              // 一键定位：IP 到市 + GPS 坐标；曾选过区县则自动恢复到县级
JXTodayInfo.setArea({pc,ci,ai,county,gpsLat?,gpsLon?}) // 选定区县并写入本地记忆
JXTodayInfo.getLoc()              // 读取已记忆的县级位置
JXTodayInfo.clearLoc()            // 清除县级记忆，回退到所选城市

JXArea.provinces()                // 31 省
JXArea.cities(pc)                 // 某省的市
JXArea.counties(pc, ci)           // 某市的全部区县
JXArea.search("双流区")           // 离线智能搜索，返回县级或市级候选
JXArea.fmt({province,city,county})// 拼成「四川省成都市双流区」
```

## 已验证

- 农历/节气算法 Node 实测正确：2026 春节(2/17)=丙午年正月初一、2000=庚辰年、1984=甲子年、2033 闰冬月；今日=九月三十·立冬·距小雪14天
- 全部内嵌 JS `node --check` 通过
- Chromium 实机 13/13 通过：三级下拉数据量、搜索「双流区/海淀」直达县级、搜市名收敛到市级、一键 IP 定位、同名区县候选、刷新后自动恢复县级、身体日历联动建议随区县变化、无 JS 异常
