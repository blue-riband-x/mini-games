var LoadingScreen = (function() {

    var ready = false;
	var firstTick = false;
	var hovering = false;

	/**
	 * @return {void}
	 */
    function update() {

		// Prevent hang on first tick.
		// Then load resources.
		// Then continue with title screen tick.
		if (!firstTick) firstTick = true;
		else if (Music.loading) generateMusic();
        else if (Sound.loading) generateSound();
        else {

			// First real step. Say hi, HAL 9000!
            if (!ready) {
                ready = true;
                musicLoop(musSpace);
                speak(MG.t("欢迎来到 EXO", "Welcome to Exo"));
            }

			// Mouse click anywhere, fallback for starting music locally.
			if (Mouse.click) {
				if (musSpace.pause) {
					musicLoop(musSpace);
				}
			}

			// Hovering/clicking on the area that starts the game.
			hovering = false;
			var x = Canvas.width/2 - 200;
	        var y = Canvas.height/2+64 - 70;
            if (Mouse.overRegion(x, y, 400, 140)) {
				hovering = true;
				if (Mouse.click) {
	                gameState = GAME_STATE.RUNNING;
					Game.init();
				}
            }

        }

    }

	/**
	 * @return {void}
	 */
    function render() {
        var centerX = Canvas.width / 2;
        var centerY = Canvas.height / 2;

        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#FFF";
        ctx.shadowBlur = 50 + Math.sin(performance.now()/100)*2;
        ctx.font = "small-caps 700 256px monospace";
        ctx.fillText("X", centerX, centerY-64);
        ctx.fillText("e o", centerX, centerY-90);
        ctx.shadowBlur = 0;

        ctx.font = "small-caps 700 32px monospace";
        if (Music.loading) {
            ctx.fillText(MG.t("载入音乐…", "Loading music..."), centerX, centerY+64);
        } else if (Sound.loading) {
            ctx.fillText(MG.t("载入音效…", "Loading sounds..."), centerX, centerY+64);
        } else {
			ctx.globalAlpha = hovering ? 1 : 0.5;
            ctx.fillText(MG.t("点这里开始", "click here to play!"), centerX, centerY+64);
			ctx.globalAlpha = 1;
        }

        ctx.font = "small-caps 700 16px monospace";
        ctx.fillText(MG.t("作者", "Created by"), centerX, Canvas.height-148);
        ctx.fillText("Ricky", centerX, Canvas.height-128);
		ctx.fillText(MG.t("原作 EXO：ai Doge & Jack Oatley", "original EXO by ai Doge & Jack Oatley"), centerX, Canvas.height-108);
        ctx.fillText("for #js13k", centerX, Canvas.height-88);
		ctx.fillText(MG.t("使用 Atom 与 SoundBox 制作", "made with; Atom & SoundBox"), centerX, Canvas.height-48);
		ctx.fillText(MG.t("建议使用 Chrome，其他浏览器效果可能有差异", "works best in Chrome, quality in other browsers will vary!"), centerX, Canvas.height-28);
    }

	// Export.
	return {
		update: update,
		render: render
	}

})();
