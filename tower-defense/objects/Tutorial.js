// Tutorial.
var Tutorial = (function() {

	var missions = [{
		zh: "欢迎来到 EXO……你是这支远征队的指挥官。数百年前，你和族人出发去寻找可以定居的星系；抵达之后，你在附近的行星上建起了基地。没过多久，你就被不明的力量包围了 —— 他们可能是外星人，也可能是几百年后科技远超你的同族。不管是谁，这里现在就是你的家……守住它。",
		en: "Welcome to Exo... You are the commander of a long forgotten expedition to a distant star. Many hundreds of years ago you and your people set out to inhabit the galaxy. Upon reaching your destination, you were able to establish a base on a nearby planet. Not long after, you find yourself under seige from mysterious forces. Are they aliens, or maybe your own race, hundreds of years ahead of you in technology, catching up to you... Either way, this is your home now... Defend it.",
		event: TUTORIAL_EVENT.INTRO,
		lifetime: 23 * 0
	},{
		zh: "按住鼠标在屏幕任意位置拖动，就能移动你对这个星系的视野。也可以用 W、A、S、D 或方向键。",
		en: "You can move your view of the star system around by clicking and dragging anywhere on-screen. You can also use the W, A, S and D, or the arrow keys.",
		event: TUTORIAL_EVENT.MOUSE
	},{
		zh: "滚轮可以放大和缩小。",
		en: "You can also zoom in and out with your mouse wheel.",
		event: TUTORIAL_EVENT.ZOOM
	},{
		zh: "空格键可以暂停和继续游戏。现在按一下试试。",
		en: "The SPACEBAR can be used to pause and un-pause the game. Try it now.",
		event: TUTORIAL_EVENT.PAUSE
	},{
		zh: "想在这个星系里活下去，你必须建造：一边收集资源，一边保护自己。",
		en: "To survive in this star system, you will have to build to gather resources and defend yourself.",
		event: TUTORIAL_EVENT.PAUSE
	},{
		zh: "屏幕顶部是总览，从左到右依次是：基地结构值（归零就结束了）、已经撑过的波数、下一波倒计时、储存的矿物、储存的能量。",
		en: "At the top of your screen is general information. From left to right. The structural status of your base, when this hits 0 you are no more. The number of enemy waves you have survived. Seconds until the next wave. Your stored minerals. And your stored energy.",
		event: TUTORIAL_EVENT.PAUSE
	},{
		zh: "屏幕底部是建造选项。卫星从恒星汲取能量，同时把你的信号中继出去；采矿站从行星上采集矿物；其余的都是武器。",
		en: "At the bottom of your screen are your construction options. Satellites are use to generate energy from the sun and relay connection to your main base. Mining stations gather minerals from planets. The rest are just weapons of destruction.",
		event: TUTORIAL_EVENT.PAUSE
	},{
		zh: "现在试着建一个。选底部的一个图标，再选恒星或行星作为轨道中心，最后选轨道距离。",
		en: "Try constructing something now. Select one of the icons. Select the star or a planet to build station in orbit of. Then select the orbit distance.",
		event: TUTORIAL_EVENT.BUILD
	},{
		zh: "卫星和站点只有连回主基地才会工作，断开连接的算作离线、什么也不做 —— 不过离线状态下敌人也发现不了它们。",
		en: "Satellites and stations can only function with a connection to your main base. Anything not connected is considered offline, and will do nothing. However, when offline, they will be undetectable by enemy ships.",
		event: TUTORIAL_EVENT.BUILD
	},{
		zh: "想扩大有效范围，就多建几颗卫星把信号接力送出去。离基地足够近的地方本来就在线，远一点的天体得先铺一条链过去。连接关系就是基地延伸出去的绿色细线。",
		en: "To extend your functional range, you will have to build multiple satellites to relay the signal. Anything close enough to your base is already online, new satellites may have to be constructed around other celestial bodies. The connection is shown with green lines branching out from your base.",
		event: TUTORIAL_EVENT.BUILD
	},{
		zh: "我能帮你的就这些了。我的程序员认为不该把武器系统的资料给我，那部分你得自己摸索。",
		en: "That's as much as I can help you. My programmers thought it wise not to provide me with information on your weapon systems. You will have to work that out yourself.",
		event: TUTORIAL_EVENT.BUILD
	},{
		zh: "祝你好运……",
		en: "Good luck...",
		event: TUTORIAL_EVENT.BUILD,
		end: true
	}];

	// Visual styling.
	var backgroundColor = "rgba(0,0,0,0.5)";
	var borderColor = "#FFF";
	var borderWidth = 2;

	var started = false;
	var end = false;
	var timer = 60;
	var completed = [];
	var currentMission = 0;
	var text = "";
	var event;

	/***************************************************************************
	 * @return {void}
	 */
	function start() {
		if (ENABLE_TUTORIAL) {
			gameState = GAME_STATE.PAUSED;
			started = true;
			setMission();
		} else {
			end = true;
		}
	}

	/***************************************************************************
	 * @return {void}
	 */
	function setMission() {
		if (missions[currentMission]) {
			text = MG.t(missions[currentMission].zh, missions[currentMission].en);
			event = missions[currentMission].event;
			end = missions[currentMission].end === true;
			if (end) {
				GameStorage.set("tutorial", false);
			}
			speak(text, true);
		}
	}

	/***************************************************************************
	 * @param {number} tutorialEvent TUTORIAL_EVENT.
	 * @return {void}
	 */
	function complete(tutorialEvent) {
		completed[tutorialEvent] = true;
	}

	/***************************************************************************
	 * @return {void}
	 */
	function update() {

		if (text !== "") {
			var mission = missions[currentMission];
			if (mission.lifetime !== undefined && mission.lifetime-- <= 0) {
				completed[mission.event] = true;
			}
			if (completed[mission.event] === true && Mouse.clickRegion(20, Canvas.height/2-20-200/2, 500, 200)) {
				currentMission++;
				text = "";
				timer = 60;
			}
		} else {
			if (started && timer-- <= 0) {
				setMission();
			}
		}
	}

	/***************************************************************************
	 * @return {void}
	 */
	function render() {

		if (text === "") {
			return;
		}

		// Box.
		ctx.fillStyle = backgroundColor;
		ctx.strokeStyle = borderColor;
		ctx.lineWidth = borderWidth;
		ctx.beginPath();
		ctx.rect(20, Canvas.height/2-20-200/2, 500, 200);
		ctx.fill();
		ctx.stroke();

		// Text.
		ctx.fillStyle = "#FFF";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		wrapText(ctx, text, 28, Canvas.height/2-192/2-16, 500-16, 20);

		// Continue prompt.
		var mission = missions[currentMission];
		if (completed[mission.event] === true) {
			ctx.textAlign = "center";
			ctx.font = "small-caps 600 12px monospace";
			ctx.fillText(MG.t("点击继续…", "click to continue..."), 270, Canvas.height/2+55);
		}

	}

	/*
	 * Re-render the current mission in the new language.
	 */
	if (window.MG) {
		MG.onChange(function() {
			if (text !== "" && missions[currentMission]) {
				text = MG.t(missions[currentMission].zh, missions[currentMission].en);
			}
		});
	}

	//**************************************************************************
	// Export.
	return {
		get text() { return text; },
		get end() { return end; },
		start: start,
		update: update,
		render: render,
		complete: complete
	}

})();
