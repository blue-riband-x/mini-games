var Settings = (function() {

	var ul = document.createElement("UL");
	var style = ul.style;
	style.position = "absolute";
	style.right = "12px";
	style.bottom = "56px"; // clears the language / help dock in the corner
	style.color = "#FFF";
	style.margin = "0";
	style.padding = "0";
	style.listStyle = "none";
	style.fontFamily = "monospace";
	style.fontSize = "12px";
	style.lineHeight = "1.7";
	style.textAlign = "right";
	style.accentColor = "#5eead4";
	document.body.appendChild(ul);

	var rows = [];

	/***************************************************************************
	 * @param {string} key Storage key (kept in English so saves stay valid).
	 * @param {string} zh Chinese label.
	 * @param {string} en English label.
	 * @param {Function} callback
	 * @return {void}
	 */
	function addSetting(key, zh, en, callback) {

		// Create DOM elements.
		var li = document.createElement("LI");
		var label = document.createElement("LABEL");
		var input = document.createElement("INPUT");
		label.textContent = MG.t(zh, en);
		rows.push({ label: label, zh: zh, en: en });
		input.type = "checkbox";
		li.appendChild(input);
		li.appendChild(label);
		ul.appendChild(li);

		// Create callback function to change and save setting.
		input.onclick = function() {
			GameStorage.set(key, input.checked);
			callback.call(input);
		}

		// Set saved state of checkbox/setting.
		if (GameStorage.get(key, "true") === "true") {
			input.checked = true;
			callback.call(input, true);
		}

	}

	/***************************************************************************
	 * @return {void}
	 */
	function init() {

		addSetting("tutorial", "新手引导", "tutorial", function() {
			ENABLE_TUTORIAL = this.checked;
		});

		addSetting("music", "音乐", "music", function(init) {
			ENABLE_MUSIC = this.checked;
			if (!init) {
				musicLoop(currentMusic);
			}
		});

		addSetting("sfx", "音效", "sfx", function(init) {
			ENABLE_SFX = this.checked;
		});

		addSetting("voice", "语音", "voice", function() {
			ENABLE_VOICE = this.checked;
		});

	}

	// Keep the labels in sync with the language switch.
	if (window.MG) {
		MG.onChange(function() {
			rows.forEach(function(row) {
				row.label.textContent = MG.t(row.zh, row.en);
			});
		});
	}

	//**************************************************************************
	// Export.
	return {
		init: init
	}

})();
