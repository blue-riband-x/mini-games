# Boulder Dash

1984 年那款 Boulder Dash 的网页重制：挖开泥土找钻石，攒够数量才能开出口，全程限时。
石头能被推着走，但下面一空就会砸下来 —— 砸在头上没命，砸在怪物身上帮你清场。

打开 `index.html` 即可玩。方向键移动（按住 Shift + 方向键可以「原地挖」）。

## 结构

```
index.html        入口
boulderdash.css   页面与画布样式
caves.js          所有关卡的洞穴数据
boulderdash.js    游戏循环、渲染、碰撞
stats.js          FPS 计数
images/           精灵图
help.html         操作说明
```

## 来源

原作 [jakesgordon/javascript-boulderdash](https://github.com/jakesgordon/javascript-boulderdash)，
作者 Jake Gordon，MIT 许可。本目录仅改了页面标题与这份说明，关卡与逻辑未改动。许可见 `LICENSE`。
