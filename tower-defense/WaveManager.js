//
var WaveManager = (function() {

	// Vars.
	var currentWave;
	var cooldown;
	var timer;
	var spawnCount;

	// Speech flavor.
	var speechFlavor = [
		["敌军正在接近", "enemies, approaching"],
		["我们遭到攻击", "we are under attack"],
		["敌舰进入射程", "enemy, in-bound"],
		["检测到敌对目标", "hostiles detected"]
	];

	/***************************************************************************
	 * Inits/resets manager.
	 * @return {void}
	 */
	function init() {
		currentWave = 0;
		spawnCount = 30;
		cooldown = 60;
		timer = cooldown * 60;
	}

	/***************************************************************************
	 * Counts down the timer and spawns waves.
	 * @return {void}
	 */
	function update() {

		// Disable countdown if tutorial is still running.
		if (!Tutorial.end) {
			return;
		}

		if (!timer--) {
			spawn();
			currentWave++;
			cooldown = Math.max(cooldown-2, 2);
			spawnCount += 30;
			timer = cooldown * 60;

			var i = ~~(Math.random()*speechFlavor.length);
			speak(MG.t(speechFlavor[i][0], speechFlavor[i][1]));
		}
	}

	/***************************************************************************
	 * Spawn ships.
	 * @return {void}
	 */
	function spawn() {
		var dis = starSystem.size;
		var n = spawnCount;
		while (n--) {
			var a = Math.random() * TAU;
			var x = Math.cos(a) * dis;
			var y = Math.sin(a) * dis;
			var ship = EnemyShip.create(x, y, a);
		}
	}

	//**************************************************************************
	// Export.
	return {
		init: init,
		update: update,
		get timer() { return timer; },
		get currentWave() { return currentWave; }
	}

})();
