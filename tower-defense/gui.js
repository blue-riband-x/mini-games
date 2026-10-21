//
var Gui = (function() {

	var pos = Vector2D(0, 0);
	var elements = [];
	var tooltip = "";
	var selection;
	var subtitles = [];

	// Display names for the celestial bodies and structures. The simulation
	// keeps English names internally; only what the player reads is switched.
	var NAMES_ZH = {
		"The Sun": "恒星",
		"Moon": "卫星",
		"Planet": "行星",
		"Mining Station": "采矿站",
		"Satellite": "中继卫星",
		"Defense Platform": "防御平台"
	};

	/***************************************************************************
	 * Translate a world name for display.
	 * @param {string} name
	 * @return {string}
	 */
	function nm(name) {
		return MG.lang === "en" ? name : (NAMES_ZH[name] || name);
	}

	/***************************************************************************
	 * @return {void}
	 */
	function setup() {
		var center = Canvas.width/2;
		var bottom = Canvas.height;
		selection = createSelectionDisplay();

		/**
		 * Build a localised tooltip for a build button.
		 * @param {string} zh Chinese name.
		 * @param {string} en English name.
		 * @param {number} cost Mineral cost.
		 * @return {string}
		 */
		function cost(zh, en, cost) {
			return MG.t(zh + "（" + cost + " 矿物）", en + " (" + cost + " minerals)");
		}

		elements = [
			selection,
			Button(pos, center-24-180, bottom-64, 48, 48, cost("中继卫星", "Satellite", Orbital.getCost(ORBITAL_TYPE.SATELLITE, undefined)), sprSatelliteIcon, buildOrbital.bind(null, ORBITAL_TYPE.SATELLITE, undefined)),
			Button(pos, center-24-120, bottom-64, 48, 48, cost("采矿站", "Mining Station", Orbital.getCost(ORBITAL_TYPE.MINING, undefined)), sprMiningStationIcon, buildOrbital.bind(null, ORBITAL_TYPE.MINING, undefined)),
			Button(pos, center-24-60, bottom-64, 48, 48, cost("激光平台", "Laser Platform", Orbital.getCost(ORBITAL_TYPE.DEFENSE, ORBITAL_MODULE_TYPE.LASER)), sprDefensePlatformIcon, buildOrbital.bind(null, ORBITAL_TYPE.DEFENSE, ORBITAL_MODULE_TYPE.LASER)),
			Button(pos, center-24, bottom-64, 48, 48, cost("光束平台", "Beam Platform", Orbital.getCost(ORBITAL_TYPE.DEFENSE, ORBITAL_MODULE_TYPE.BEAM)), sprBeamPlatformIcon, buildOrbital.bind(null, ORBITAL_TYPE.DEFENSE, ORBITAL_MODULE_TYPE.BEAM)),
			Button(pos, center+24+12, bottom-64, 48, 48, cost("火箭平台", "Rocket Platform", Orbital.getCost(ORBITAL_TYPE.DEFENSE, ORBITAL_MODULE_TYPE.ROCKET)), sprRocketPlatformIcon, buildOrbital.bind(null, ORBITAL_TYPE.DEFENSE, ORBITAL_MODULE_TYPE.ROCKET)),
			Button(pos, center+24+72, bottom-64, 48, 48, cost("电磁平台", "EMP Platform", Orbital.getCost(ORBITAL_TYPE.DEFENSE, ORBITAL_MODULE_TYPE.EMP)), sprEmpPlatformIcon, buildOrbital.bind(null, ORBITAL_TYPE.DEFENSE, ORBITAL_MODULE_TYPE.EMP)),
			Button(pos, center+24+132, bottom-64, 48, 48, cost("闪电平台", "Lighting Platform", Orbital.getCost(ORBITAL_TYPE.DEFENSE, ORBITAL_MODULE_TYPE.LIGHTNING)), sprLightningPlatformIcon, buildOrbital.bind(null, ORBITAL_TYPE.DEFENSE, ORBITAL_MODULE_TYPE.LIGHTNING))
		];
	}

	/***************************************************************************
	 * @return {void}
	 */
	function update() {
		tooltip = "";
		elements.forEach(function(e) {
			e.update();
		});

		var n = subtitles.length;
		while (n--) {
			var sub = subtitles[n];
			if (!sub.time--) {
				subtitles.splice(n, 1);
			}
		}

	}

	/***************************************************************************
	 * @return {void}
	 */
	function render() {

		// Render attached elements.
		elements.forEach(function(e) {
			e.render();
		});

		//
		var cx = Canvas.width / 2;
		var scale = clamp(Canvas.width / 1920, 0.5, 1);

		// Wave counter.
		ctx.globalAlpha = 1;
		ctx.fillStyle = "#FFF";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		ctx.font = "700 48px monospace";
		ctx.fillText(~~(WaveManager.timer/60), Canvas.width/2, 96);

		ctx.font = "small-caps 700 24px monospace";
		ctx.fillText(MG.t("下一波倒计时", "next wave in"), cx, 48);

		// Minerals.
		ctx.fillText(MG.t("矿物", "minerals"), cx+300*scale, 48);
		ctx.fillText(~~Base.minerals, cx+300*scale, 80);

		// Energy.
		ctx.fillText(MG.t("能量", "energy"), cx+600*scale, 48);
		ctx.fillText(~~Base.energy, cx+600*scale, 80);

		// Days.
		ctx.fillText(MG.t("已撑过", "survived"), cx-300*scale, 48);
		ctx.fillText(MG.t(WaveManager.currentWave + " 波", WaveManager.currentWave + " waves"), cx-300*scale, 80);

		// Base health.
		ctx.fillText(MG.t("基地结构", "base status"), cx-600*scale, 48);
		ctx.fillText(~~Base.planet.hp + "%", cx-600*scale, 80);

		// Tooltip.
		ctx.font = "small-caps 700 16px monospace";
		ctx.fillText(tooltip, cx, Canvas.height-96);

		// Subtitles.
		ctx.textAlign = "left";
		ctx.textBaseline = "bottom";
		var dy = 20;
		subtitles.forEach(function(sub) {
			ctx.fillText('"' + sub.text + '"', 20, Canvas.height-dy);
			dy += 20;
		});

		// Tutorial
		Tutorial.render();

		// FPS.
		ctx.textAlign = "left";
		ctx.textBaseline = "bottom";
		ctx.font = "small-caps 500 12px monospace";
		ctx.fillText("FPS: " + Fps.fps, 10, 26);

		// Pause status.
		var offset = gameState === GAME_STATE.PAUSED ? 0 : 80;
		ctx.drawImage(sprPauseIcon, offset, 0, 80, 80, Canvas.width-90, 30, 60, 60);

	}

	/***************************************************************************
	 * @param {string} text
	 * @param {number} time
	 * @return {void}
	 */
	function addSubtitles(text, time) {
		subtitles.push({
			text: text,
			time: time
		});
	}

	/***************************************************************************
	 * @param {string} text
	 * @return {void}
	 */
	function setTooltip(text) {
		tooltip = text;
	}

	/***************************************************************************
	 * @param {Object} t Orbital.
	 * @param {Object=} v Vector2D.
	 * @return {void}
	 */
	function setSelectionTarget(t, v) {
		selection.target = t;
		if (typeof v !== "undefined") {
			selection.openAt(v.x, v.y);
		}
	}

	/***************************************************************************
	 * @param {number} type ORBITAL_TYPE.
	 * @param {number=} modType ORBITAL_MODULE_TYPE.
	 * @param {boolean=} check Check if affordable, or select.
	 * @return {boolean}
	 */
	function buildOrbital(type, modType, check) {
		var cost = Orbital.getCost(type, modType);
		if (check) {
			return Base.minerals >= cost;
		} else {
			var name = Orbital.getName(type, modType);
			speak(MG.t("选择建造位置：" + nm(name), "Select an area to build the " + name));
			Build.createBlueprint(type, modType, cost);
			return false;
		}
	}

	function createSelectionDisplay() {

		// Positioning.
		var w = 426;
		var h = 120;
		var x = Canvas.width/2 - w/2;
		var y = Canvas.height-128 - h;
		var elements = [];

		// Styling.
		var backgroundColor = "rgba(0,0,0,0.5)";
		var borderColor = "#FFF";
		var borderWidth = 2;

		var object = {

			x: x,
			y: y,
			target: null,

			update: function() {
				if (object.target === null) return;
				elements.forEach(function(e) {
					e.update();
				});
			},

			render: function() {
				if (object.target === null) return;

				// Background.
				ctx.fillStyle = backgroundColor;
				ctx.strokeStyle = borderColor;
				ctx.lineWidth = borderWidth;
				ctx.fillRect(x, y, w, h);
				ctx.strokeRect(x, y, w, h);

				// Name.
				ctx.fillStyle = "#fff";
				ctx.textAlign = "left";
				ctx.textBaseline = "top";
				ctx.font = "16px monospace";
				var isBase = Base.planet === object.target;
				var text = isBase ? MG.t("基地", "Base") + " · " + nm(object.target.name) : nm(object.target.name);
				ctx.fillText(text, x+h, y+16);

				// Image.
				var image = object.target.cache;
				var scale = Math.max(image.width, image.height) / (h-16);
				var imgx = x+8+(h-16)/2-image.width/scale/2;
				var imgy = y+8+(h-16)/2-image.height/scale/2;
				ctx.drawImage(image, imgx, imgy, image.width/scale, image.height/scale);

				// Buttons.
				elements.forEach(function(e) {
					e.render();
				});

			},

			// Open the panel at a particular location.
			// Currently assigns to 2 different coords, FIX.
			openAt: function(nx, ny) {
				object.x = x = nx;
				object.y = y = ny;
			},

			// Adds buttons from upgrade objects.
			addButtons: function(arr) {
				elements.length = 0;
				var xOffset = h + 8;
				arr.forEach(function(upgrade) {
					var text = upgrade.text;
					var img = upgrade.img;
					var func = upgrade.func;
					var speech = upgrade.speech;
					elements.push(Button(object, xOffset, h-60, 48, 48, text, img, func, speech));
					xOffset += 60;
				});
			}

		}

		return object;
	}

	//**************************************************************************
	// Export.
	return {
		setup: setup,
		update: update,
		render: render,
		addSubtitles: addSubtitles,
		setSelectionTarget: setSelectionTarget,
		setTooltip: setTooltip,
		nm: nm
	}

})();

// Rebuild the bottom build bar so tooltips follow the language switch.
MG.onChange(function() {
	if (typeof Gui !== "undefined" && Gui.setup) {
		try { Gui.setup(); } catch (e) {}
	}
});
