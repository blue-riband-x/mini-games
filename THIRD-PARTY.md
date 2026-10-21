# 来源与许可

这个仓库里的四个游戏都是基于开源项目改造的移植版。原项目的版权与许可声明都保留在各自子目录里，
下面是逐项对照 —— 原仓库、原作者、许可证，以及我实际改动的地方。

---

## 1. tower-defense — EXO 深空防线

- **原作**：[scorp200/td13k](https://github.com/scorp200/td13k)
- **原作者**：scorp200
- **许可**：MIT（见 `tower-defense/LICENSE`）
- **原作背景**：为 js13kGames 写的参赛作品，压缩后 13 KB 内跑完一整套塔防。

改动：

- 放弃原仓库 `build/` 下 Closure Compiler 压缩出的单文件，改用 `src/` 的未压缩源码发布
  （入口 `tower-defense/index.html`），方便阅读和调试；
- `loadingscreen.js` 标题画面的署名改为 Ricky，并保留一行 `original EXO by ai Doge & Jack Oatley`；
- 补了 `tower-defense/README.md`；
- 接入 `shared/mg.js` 做中英切换与「怎么玩」面板，改动的全是**显示文本**，不涉及数值：
  `gui.js`（顶部 HUD、建造栏提示、选中面板名称）、`loadingscreen.js`（载入与标题画面）、
  `objects/orbital/OrbitalUpgrades.js`（升级按钮）、`WaveManager.js`（波次台词）、
  `objects/Tutorial.js`（新手引导 12 段）、`objects/Settings.js`（右下角开关，并把面板抬高避免压住语言开关）；
- `utils.js` 的 `wrapText()` 增加了中文按字断行（原先只按空格断行，整段中文会溢出一行）；
- `speech.js` 的语音合成按当前语言设置 `lang`；
- 未改动任何游戏逻辑与数值。

## 2. space-huggers — Space Huggers

- **原作**：[KilledByAPixel/SpaceHuggers](https://github.com/KilledByAPixel/SpaceHuggers)
- **原作者**：Frank Force
- **许可**：GPL-3.0（见 `space-huggers/LICENSE`）
- **原作背景**：另一个 js13kGames 作品，跑打 roguelike，地形逐格可破坏。

改动：

- `app*.js`（游戏逻辑：角色、道具、关卡、特效）文件头的署名由原作者改为 Ricky，标题画面的署名行同步替换；
- `index.html` 的 `meta author` 与 `<title>` 改为 Ricky；
- **`engine/` 目录（LittleJS 引擎）原样保留** —— 那是 Frank Force 的引擎，署名不动；
- `app.js` 的标题副行与底部 HUD（关数 / 生命 / 剩余敌人）接 `MG.t()` 做中英切换；
- 游戏逻辑与关卡数据未改动。

## 3. boulder-dash — Boulder Dash

- **原作**：[jakesgordon/javascript-boulderdash](https://github.com/jakesgordon/javascript-boulderdash)
- **原作者**：Jake Gordon
- **许可**：MIT（原作 README 中标明；本仓库补了 `boulder-dash/LICENSE`）
- **原作背景**：1984 年 C64 游戏 Boulder Dash 的 HTML5 实现。

改动：

- `index.html` 的 `<title>` 加了署名后缀；
- `caves.js` 的 20 个关卡名与说明改为 `[中文, English]` 对照，`boulderdash.js` 在切换语言时重绘当前关卡说明；
- `help.html` 图鉴页重写为中英双语，术语与游戏内一致；
- `boulderdash.css` 换成深色皮肤，画布宽度改为流式（`aspect-ratio: 40/23`），修掉原来在窄屏上
  按屏幕断点写死 640/800/960px 导致的横向溢出；帧率组件只在超宽屏显示；
- 未改动关卡数据、渲染逻辑与数值。

## 4. project-sand — Project Sand

- **原作**：[joshdon/ProjectSand](https://github.com/joshdon/ProjectSand)
- **原作者**：Josh Don
- **许可**：GPL-3.0（见 `project-sand/LICENSE` 与 `project-sand/AUTHORS`）
- **原作背景**：经典「落沙」沙盒（Hell of Sand 一类）的现代重写。

改动：

- `index.html` 页面上的 `By:` 改为 Ricky，右上角「Source Code」链接指向本仓库；
- `AUTHORS` 与 `LICENSE` 原样保留；
- 界面整体重做：`index.html` 重新组织为「标题栏 / 画布 / 元素面板 + 控制面板」，`styles.css` 全部重写
  （深色皮肤、28 个元素做成带元素色标记的按钮网格、自定义下拉框 / 滑杆 / 开关 / 按钮态），
  桌面为两栏、窄屏自动堆叠；
- `scripts/menu.js` 的元素名改为 `[中文, English]` 对照（按钮由 `<input>` 表格改为 `<button>` 网格），
  切换语言时只重写文本、不动模拟状态；`scripts/game.js` 里画布尺寸的挂载点由 `#gameWrapper` 改为 `#canvasFrame`，
  让外层布局可以自适应；
- 元素规则、反应与物理步进未改动。

---

## 许可要点

- **MIT**（tower-defense、boulder-dash）：允许修改与再分发，要求保留原始版权声明与许可文本，已保留。
- **GPL-3.0**（space-huggers、project-sand）：允许修改与再分发，要求衍生作品同样以 GPL-3.0 发布、
  保留原作者署名、并说明修改内容。本文件与各子目录的 LICENSE 即为此目的保留；如需再分发这些子目录的代码，
  请同样遵循 GPL-3.0。

入口页 `index.html`、本文件与根 `README.md` 由 Ricky 编写。
