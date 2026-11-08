# 怎么用 · 三种方式

> 从最简单到最自动化，选适合你的。

---

## 方式1：复制粘贴（零门槛）

适合：想试试看、不想装任何东西的人。

打开 ChatGPT / Claude / 豆包 / Kimi，粘贴这段话：

```
请根据我的公众号方法论，生成一篇内容。

方法论：反共识认知 + 长期主义 + 反焦虑表达，面向30-50岁人群。
结构用「六段反共识骨架」：钩子→反共识→支撑→破局→行动→收束。
至少用金句/模型/案例/数据中的两类素材。
不制造焦虑、不承诺速效、不标题党、不编造数据。

主题：[你的选题，例如"为什么越努力越焦虑"]
产出类型：[outline / full / titles / cards]
```

每天改一下主题和产出类型即可。

追加玩法：
- "只给我标题库，分AB组"
- "把这篇改成小红书短文案"
- "围绕'长期主义'出四类素材卡"

---

## 方式2：安装到 Agent（自动化）

适合：已装 Claude Code / Codex，想让 Agent 按方法论批量产出。

**Claude Code**：
```bash
# 把 jingxin-gzh-content-skill/ 目录作为知识库加载
# Agent 会按 SKILL.md 工作流运行
```

**Codex / ChatGPT**：
```
Use $skill-installer to install jingxin-gzh-content-skill from path jingxin-gzh-content-skill.
```

**填写你的信息**：编辑 `assets/user-profile.md`（定位/受众/风格/产出格式/输出目录）。

---

## 方式3：Agent + 知识库（自动化 + 沉淀）

适合：想把生成内容沉淀进 ima / Obsidian 笔记库的人。

- 把 `references/` 作为知识库参考文件（风格边界 + 素材来源策略）
- 把每次生成的文章/素材卡写入 `user-profile.md` 里的 `output_dir`
- 积累后让 Agent：把高赞内容归入"成品库"，把踩坑记入 SKILL.md 的 Gotchas

---

## 产出格式

| 格式 | 内容 | 体量 |
|------|------|------|
| `outline` | 选题 + 六段大纲 + 素材建议 | ~400字 |
| `full` | 完整公众号长文（六段展开） | ~1500-2500字 |
| `titles` | 8-12 个标题/钩子，含 AB 分组 | ~300字 |
| `cards` | 金句/模型/案例/数据 素材卡 | 4-8张 |

---

## 风格边界（必读）

所有产出遵循 `references/style-boundary.md`：
- 不制造年龄/身份/阶层恐慌
- 不承诺速效/治愈
- 不标题党
- 不编造数据
- 不身份贬低

内容是用来"让人安心并愿意行动"的，不是用来吓人的。
