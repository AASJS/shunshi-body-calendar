/*
 * 核心回归测试 —— 区县解析 / 生成结果 / 节气 / 医疗安全边界
 * 运行：npm test （或 node --test tests/core.test.mjs）
 * 零依赖，仅使用 Node 内置 test runner；被测对象：中医身体日历-生成脚本.js
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const BC = require('../中医身体日历-生成脚本.js');

/* ---------------- 一、区县解析 ---------------- */

test('区县解析：完整三段地址 → 命中区县', () => {
  const loc = BC.resolveLoc('陕西省汉中市西乡县');
  assert.equal(loc.province, '陕西省');
  assert.equal(loc.city, '汉中市');
  assert.equal(loc.county, '西乡县');
  assert.ok(Math.abs(loc.lat - 34.34) < 0.5, '纬度应接近 34.3');
  assert.ok(Math.abs(loc.lon - 108.94) < 0.5, '经度应接近 108.9');
});

test('区县解析：含省前缀的单字县「陕西省眉县」不被误吞', () => {
  const hits = BC.searchSmart('陕西省眉县');
  assert.ok(hits.length > 0, '应有结果');
  assert.equal(hits[0].county, '眉县');
  assert.equal(hits[0].city, '宝鸡市');
  assert.equal(hits[0].score, 100);
});

test('区县解析：短词「眉县」剥前缀后仍命中眉县', () => {
  const hits = BC.searchSmart('眉县');
  assert.equal(hits[0].county, '眉县');
});

test('区县解析：「成都市」原句优先命中市级并列出区县（不误中同名县级）', () => {
  const hits = BC.searchSmart('成都市');
  assert.equal(hits[0].kind, 'city');
  assert.equal(hits[0].city, '成都市');
  assert.ok(hits[0].counties.includes('锦江区'), '应列出下辖区县');
  const names = hits.map(h => h.county || '').join(',');
  assert.ok(!names.includes('都安瑶族自治县'), '不应误中都安瑶族自治县');
});

test('区县解析：区级「广东省深圳市南山区」命中', () => {
  const loc = BC.resolveLoc('广东省深圳市南山区');
  assert.equal(loc.county, '南山区');
  assert.equal(loc.city, '深圳市');
});

test('区县解析：直辖市「北京市」直接可用', () => {
  const loc = BC.resolveLoc('北京市');
  assert.equal(loc.province, '北京市');
  assert.ok(Number.isFinite(loc.lat) && Number.isFinite(loc.lon));
});

test('区县解析：乱输入不抛异常，仍能产出可用的定位兜底', () => {
  const loc = BC.resolveLoc('不存在的州县');
  assert.ok(loc && Number.isFinite(loc.lat) && Number.isFinite(loc.lon));
});

/* ---------------- 二、生成结果（2026-11-08 立冬 · 西乡县） ---------------- */

const CAL = await BC.generateCalendar({
  date: '2026-11-08', place: '陕西省汉中市西乡县', withWeather: false
});

test('生成结果：主题与节气定位正确', () => {
  assert.equal(CAL.place, '陕西省汉中市西乡县');
  assert.equal(CAL.theme.title, '冬三月之始，宜收不宜泄');
  assert.match(CAL.termLine, /立冬/);
  assert.match(CAL.termLine, /小雪/);
  assert.match(CAL.termLine, /14/, '立冬距小雪应为 14 天');
});

test('生成结果：农历干支正确', () => {
  assert.match(CAL.lunarText, /九月三十/);
  assert.match(CAL.lunarText, /丙午/);
});

test('生成结果：气候画像与完整分区', () => {
  assert.match(CAL.profileLabel, /北方干冷/);
  for (const k of ['yi', 'bu', 'sleep', 'food', 'move', 'mind', 'risk']) {
    assert.ok(Array.isArray(CAL[k]) && CAL[k].length > 0, `分区 ${k} 不应为空`);
  }
  assert.ok(CAL.basis && CAL.basis.length > 0, '内容依据不应为空');
});

/* ---------------- 三、节气推算 ---------------- */

test('节气：2026-02-04 立春，距雨水 14 天', () => {
  const t = BC.solarTermInfo(new Date(2026, 1, 4));
  assert.equal(t.name, '立春');
  assert.equal(t.next, '雨水');
  assert.equal(t.toNext, 14);
});

test('节气：2026-11-08 立冬，距小雪 14 天', () => {
  const t = BC.solarTermInfo(new Date(2026, 10, 8));
  assert.equal(t.name, '立冬');
  assert.equal(t.next, '小雪');
  assert.equal(t.toNext, 14);
});

/* ---------------- 四、医疗安全边界 ---------------- */

test('安全边界：红旗症状必须提示立即停止并就医', () => {
  const risk = CAL.risk.join(' ');
  assert.match(risk, /立即停止并就医/);
  assert.match(risk, /胸痛|胸闷|头晕/, '红旗清单应包含典型红旗症状');
});

test('安全边界：运动默认中低强度并守住微汗边界', () => {
  const move = CAL.move.join(' ');
  assert.match(move, /中低强度/);
  assert.match(move, /微汗即止/);
  assert.match(move, /热身/, '应包含热身要求');
});

test('安全边界：宜忌双侧齐备，忌侧给出明确禁区', () => {
  assert.ok(CAL.yi.length > 0 && CAL.bu.length > 0, '宜 / 忌都不应为空');
});

test('安全边界：生成产物不出现诊疗性断言词汇', () => {
  const text = JSON.stringify(CAL);
  for (const bad of ['确诊', '处方：', '服药', '治愈', '包治']) {
    assert.ok(!text.includes(bad), `产物不应包含「${bad}」`);
  }
});

/* ---------------- 五、可复现性 ---------------- */

test('可复现：同日期同地点两次生成，主题与分区一致', async () => {
  const again = await BC.generateCalendar({
    date: '2026-11-08', place: '陕西省汉中市西乡县', withWeather: false
  });
  assert.equal(again.theme.title, CAL.theme.title);
  assert.deepEqual(again.yi, CAL.yi);
  assert.deepEqual(again.risk, CAL.risk);
});
