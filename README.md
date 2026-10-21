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

## 结构

```
index.html          入口页，四张卡片
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
