# Mini Games

四个能直接在浏览器里玩的小游戏，纯静态页面：没有后端、没有构建步骤，克隆下来开个静态服务器就能跑。

在线：https://blue-riband-x.github.io/mini-games/

| 目录 | 玩法 | 操作 | 体积 |
|---|---|---|---|
| `tower-defense/` | 太空塔防，建塔扛波次 | 鼠标 | 156 KB 源码 |
| `space-huggers/` | 横版跑打射击，地形可破坏 | 键盘 / 手柄 | 360 KB |
| `boulder-dash/` | 挖宝石推石头，限时逃脱 | 方向键 | 141 KB |
| `project-sand/` | 落沙物理沙盒，元素互相反应 | 鼠标 | 336 KB |

## 本地运行

```bash
python -m http.server 8080
# 然后打开 http://127.0.0.1:8080/
```

不要直接双击 `index.html` —— 有几个游戏用 `fetch` 或模块加载，`file://` 协议下会被浏览器拦掉。

## 语言与操作说明

- **默认中文**。右下角有 `中文 / EN` 开关，切换结果存在 `localStorage`，四个游戏和入口页共用同一个偏好。
  游戏内的画布文字（HUD、建造栏、标题画面、关卡说明）都是按当前语言即时绘制/重绘的，不用刷新。
- **第一次进某个游戏会自动弹出「怎么玩」面板**：操作键位、规则、要点，中英各一份；关掉后点右下角 `?`
  随时再看。是否已读记在 `localStorage`，换语言不会重复弹。
- 语言表与面板实现在 `shared/mg.js` + `shared/mg.css`：

  ```js
  MG.t("中文", "English")          // 取当前语言的字符串
  MG.lang                          // "zh" | "en"
  MG.onChange(fn)                  // 切换后重绘（画布游戏靠它刷新文字）
  MG.init({ id, help: { zh: {...}, en: {...} } })
  ```

  静态 HTML 文字直接标 `data-t-zh` / `data-t-en`，页面加载与切换时自动替换。

## 结构

```
index.html          入口页，四张卡片（中英双语）
shared/             中英切换 + 「怎么玩」面板，四个游戏共用
tower-defense/      未压缩源码，入口 index.html
space-huggers/      游戏逻辑（app*.js）+ LittleJS 引擎（engine/）
boulder-dash/       关卡数据（caves.js）+ 渲染与逻辑
project-sand/       元素规则（scripts/）+ 画布渲染
THIRD-PARTY.md      每个子项目的来源、原作者与许可
```

## 关于来源

这四个游戏都是把已有的开源项目搬过来、改掉署名、修好部署后放上来的 —— 不是我从零写的。
具体每个项目的原仓库、原作者、许可证，以及我实际改了什么，都写在 [THIRD-PARTY.md](THIRD-PARTY.md) 里。
各子目录保留自己的 LICENSE，使用时请遵守对应许可。
