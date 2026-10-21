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

- `game.html` 由原仓库的 `build/index.html` 迁移而来，补了 `<title>` 与作者 meta；
- 保留 `src/` 下未压缩的可读源码（原仓库的 `compile.sh` 用 Closure Compiler 打包）；
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
- 游戏逻辑与关卡数据未改动。

## 3. boulder-dash — Boulder Dash

- **原作**：[jakesgordon/javascript-boulderdash](https://github.com/jakesgordon/javascript-boulderdash)
- **原作者**：Jake Gordon
- **许可**：MIT（原作 README 中标明；本仓库补了 `boulder-dash/LICENSE`）
- **原作背景**：1984 年 C64 游戏 Boulder Dash 的 HTML5 实现。

改动：

- `index.html` 的 `<title>` 加了署名后缀；
- 未改动关卡（`caves.js`）、渲染与逻辑。

## 4. project-sand — Project Sand

- **原作**：[joshdon/ProjectSand](https://github.com/joshdon/ProjectSand)
- **原作者**：Josh Don
- **许可**：GPL-3.0（见 `project-sand/LICENSE` 与 `project-sand/AUTHORS`）
- **原作背景**：经典「落沙」沙盒（Hell of Sand 一类）的现代重写。

改动：

- `index.html` 页面上的 `By:` 改为 Ricky，右上角「Source Code」链接指向本仓库；
- `AUTHORS` 与 `LICENSE` 原样保留；
- 元素规则与物理步进未改动。

---

## 许可要点

- **MIT**（tower-defense、boulder-dash）：允许修改与再分发，要求保留原始版权声明与许可文本，已保留。
- **GPL-3.0**（space-huggers、project-sand）：允许修改与再分发，要求衍生作品同样以 GPL-3.0 发布、
  保留原作者署名、并说明修改内容。本文件与各子目录的 LICENSE 即为此目的保留；如需再分发这些子目录的代码，
  请同样遵循 GPL-3.0。

入口页 `index.html`、本文件与根 `README.md` 由 Ricky 编写。
