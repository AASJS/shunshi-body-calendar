/*
 * 浏览器回归测试 —— PNG 导出 / 窄屏布局（Playwright + Chromium）
 * 运行：npm run test:browser （首次需 npx playwright install chromium）
 * 被测对象：中医身体日历-一源多出.html、顺时对答智能体.html
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = f => 'file://' + path.join(ROOT, f);

/* 解析 PNG 头：魔数 + IHDR 宽高（无第三方依赖） */
function pngSize(buf) {
  assert.ok(buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), '应为合法 PNG 文件');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function withPage(t, url, fn) {
  /* chromiumSandbox:false —— 本地 root 环境必须关闭浏览器沙箱，否则启动挂起；CI 非root 不受影响 */
  const browser = await chromium.launch({ chromiumSandbox: false, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  await page.waitForTimeout(600);
  try { await fn(page); } finally { await browser.close(); }
  assert.equal(errors.length, 0, '页面不应有未捕获 JS 异常: ' + errors.join(' | '));
}

/* ---------------- 一、PNG 导出 ---------------- */

test('PNG 导出：长图导出为合法 PNG，2x 倍率宽 2160、高度在长页合理范围', { timeout: 120000 }, async () => {
  await withPage(null, file('中医身体日历-一源多出.html'), async (page) => {
    const dlPromise = page.waitForEvent('download', { timeout: 60000 });
    await page.evaluate(() => exportLong());
    const dl = await dlPromise;
    const p = await dl.path();
    assert.match(dl.suggestedFilename(), /\.png$/, '导出文件应为 .png');
    const { width, height } = pngSize(fs.readFileSync(p));
    assert.equal(width, 2160, '默认 2x 高清，宽度应为 2160（1080×2）');
    assert.ok(height > 4000, '长图高度应大于 4000（实测约 9000+），当前 ' + height);
  });
});

test('PNG 导出：9:16 竖卡导出为 2x 的 2160×3840', { timeout: 120000 }, async () => {
  await withPage(null, file('中医身体日历-一源多出.html'), async (page) => {
    const dlPromise = page.waitForEvent('download', { timeout: 60000 });
    await page.evaluate(() => exportCard(0));
    const dl = await dlPromise;
    const { width, height } = pngSize(fs.readFileSync(await dl.path()));
    assert.equal(width, 2160);
    assert.equal(height, 3840);
    assert.match(dl.suggestedFilename(), /9x16|天时总纲/, '文件名应为 9:16 卡片命名');
  });
});

/* ---------------- 二、窄屏布局（320 – 1440 无横向溢出） ---------------- */

const WIDTHS = [320, 390, 768, 1024, 1440];

test('窄屏布局：一源多出各档屏宽无横向溢出', { timeout: 120000 }, async () => {
  await withPage(null, file('中医身体日历-一源多出.html'), async (page) => {
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(250);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(sw <= w + 1, `一源多出 @${w}px 出现横向溢出：scrollWidth=${sw}`);
    }
  });
});

test('窄屏布局：顺时对答智能体各档屏宽无横向溢出', { timeout: 120000 }, async () => {
  await withPage(null, file('顺时对答智能体.html'), async (page) => {
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(250);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(sw <= w + 1, `智能体 @${w}px 出现横向溢出：scrollWidth=${sw}`);
    }
  });
});

test('窄屏布局：内容依据与隐私说明页各档屏宽无横向溢出且清除按钮可用', { timeout: 120000 }, async () => {
  await withPage(null, file('内容依据与隐私说明.html'), async (page) => {
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(200);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(sw <= w + 1, `说明页 @${w}px 出现横向溢出：scrollWidth=${sw}`);
    }
    /* 清除按钮功能验证：先写入假数据，再点按钮，断言清空 */
    await page.evaluate(() => {
      localStorage.setItem('jx_loc', 'test');
      localStorage.setItem('shunshi_last', 'test');
    });
    await page.click('#btnClear');
    const msg = await page.textContent('#clearMsg');
    assert.match(msg, /已清除/);
    const left = await page.evaluate(() =>
      ['jx_loc', 'shunshi_profile', 'shunshi_skin', 'shunshi_last', 'jx_cal_loc']
        .filter(k => localStorage.getItem(k) !== null).length);
    assert.equal(left, 0, '一键清除后 5 个记忆键应全部为空');
  });
});
