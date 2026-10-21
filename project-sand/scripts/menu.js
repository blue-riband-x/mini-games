/*
 * Code for the menu options.
 *
 * Copyright (C) 2020, Josh Don
 *
 * Project Sand is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Project Sand is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* Configuration of the menu */
const PEN_SIZES = [2, 4, 8, 16, 32, 64];
const PEN_SIZE_LABELS = ["1px", "2px", "4px", "8px", "16px", "32px"];
const DEFAULT_PEN_IDX = 1;

/* Elements listed in the menu */
// prettier-ignore
const elementMenuItems = [
  WALL, SAND, WATER, PLANT,
  FIRE, SPOUT, WELL, SALT,
  OIL, WAX, TORCH, ICE,
  GUNPOWDER, NAPALM, NITRO, C4,
  LAVA, CRYO, FUSE, MYSTERY,
  CONCRETE, METHANE, SOIL, ACID,
  THERMITE, BACKGROUND, ZOMBIE,
];

/*
 * Display names are stored as [zh, en] pairs; the visible label is resolved
 * through MG.t() so the page can switch language without rebuilding the game.
 */
const menuNames = {};
menuNames[WALL] = ["墙", "WALL"];
menuNames[SAND] = ["沙", "SAND"];
menuNames[WATER] = ["水", "WATER"];
menuNames[PLANT] = ["植物", "PLANT"];
menuNames[FIRE] = ["火", "FIRE"];
menuNames[SALT] = ["盐", "SALT"];
menuNames[OIL] = ["油", "OIL"];
menuNames[SPOUT] = ["喷口", "SPOUT"];
menuNames[WELL] = ["井", "WELL"];
menuNames[TORCH] = ["火把", "TORCH"];
menuNames[GUNPOWDER] = ["火药", "GUNPOWDER"];
menuNames[WAX] = ["蜡", "WAX"];
menuNames[NITRO] = ["硝化甘油", "NITRO"];
menuNames[NAPALM] = ["汽油弹", "NAPALM"];
menuNames[C4] = ["C-4", "C-4"];
menuNames[CONCRETE] = ["混凝土", "CONCRETE"];
menuNames[BACKGROUND] = ["橡皮", "ERASER"];
menuNames[FUSE] = ["引信", "FUSE"];
menuNames[ICE] = ["冰", "ICE"];
menuNames[LAVA] = ["岩浆", "LAVA"];
menuNames[METHANE] = ["甲烷", "METHANE"];
menuNames[CRYO] = ["液氮", "CRYO"];
menuNames[MYSTERY] = ["???", "???"];
menuNames[SOIL] = ["土", "SOIL"];
menuNames[ACID] = ["酸", "ACID"];
menuNames[THERMITE] = ["铝热剂", "THERMITE"];
menuNames[ZOMBIE] = ["僵尸手", "HAND"];

/* Localised label for an element type. */
function menuName(type) {
  const pair = menuNames[type];
  return pair ? MG.t(pair[0], pair[1]) : "";
}

/*
 * Some element colors do not have very good contrast against
 * the menu background. For these elements, we use a replacement
 * color for the menu text.
 */
const menuAltColors = {};
menuAltColors[WATER] = "rgb(0, 130, 255)";
menuAltColors[WALL] = "rgb(160, 160, 160)";
menuAltColors[BACKGROUND] = "rgb(200, 100, 200)";
menuAltColors[WELL] = "rgb(158, 13, 33)";
menuAltColors[SOIL] = "rgb(171, 110, 53)";

function initMenu() {
  /* Set up the container that holds the element selectors */
  const elementMenu = document.getElementById("elementTable");
  var i, k;
  for (var elemIdx = 0; elemIdx < elementMenuItems.length; elemIdx++) {
    const elemType = elementMenuItems[elemIdx];
    if (!(elemType in menuNames))
      throw "element is missing a canonical name: " + elemType;

    const elemButton = document.createElement("button");
    elemButton.type = "button";
    elemButton.className = "elementMenuButton";
    elemButton.id = elemType;
    elemButton.title = menuName(elemType);

    const elemLabel = document.createElement("span");
    elemLabel.textContent = menuName(elemType);
    elemButton.appendChild(elemLabel);

    /* The element colour doubles as the chip accent; text stays readable. */
    var elemMenuColor;
    if (elemType in menuAltColors) elemMenuColor = menuAltColors[elemType];
    else
      elemMenuColor =
        "rgb(" +
        (elemType & 0xff) +
        ", " +
        ((elemType & 0xff00) >>> 8) +
        ", " +
        ((elemType & 0xff0000) >>> 16) +
        ")";
    elemButton.style.setProperty("--c", elemMenuColor);

    elemButton.addEventListener("click", function () {
      document
        .getElementById(SELECTED_ELEM.toString())
        .classList.remove("selectedElementMenuButton");
      elemButton.classList.add("selectedElementMenuButton");
      SELECTED_ELEM = parseInt(elemButton.id, 10);
    });

    elementMenu.appendChild(elemButton);
  }
  document.getElementById(SELECTED_ELEM.toString()).click();

  /* Set up pensize options */
  const pensizes = document.getElementById("pensize");
  for (i = 0; i < PEN_SIZES.length; i++) {
    const p = document.createElement("option");
    p.value = PEN_SIZES[i];
    p.text = PEN_SIZE_LABELS[i];
    if (i === DEFAULT_PEN_IDX) {
      p.selected = "selected";
      PENSIZE = parseInt(p.value, 10);
    }
    pensizes.add(p);
  }
  pensizes.addEventListener("change", function () {
    PENSIZE = parseInt(pensizes.value, 10);
  });

  /* Set up spigot size options */
  const spigotTypes = [
    document.getElementById("spigot1Type"),
    document.getElementById("spigot2Type"),
    document.getElementById("spigot3Type"),
    document.getElementById("spigot4Type"),
  ];
  const spigotSizes = [
    document.getElementById("spigot1Size"),
    document.getElementById("spigot2Size"),
    document.getElementById("spigot3Size"),
    document.getElementById("spigot4Size"),
  ];
  if (spigotTypes.length !== spigotSizes.length) throw "should be same length";
  for (i = 0; i < spigotTypes.length; i++) {
    const typeSelector = spigotTypes[i];
    const sizeSelector = spigotSizes[i];
    for (k = 0; k < SPIGOT_ELEMENT_OPTIONS.length; k++) {
      const type = SPIGOT_ELEMENT_OPTIONS[k];
      const option = document.createElement("option");
      option.value = type;
      option.text = menuName(type);
      if (i === k) {
        option.selected = "selected";
        SPIGOT_ELEMENTS[i] = type;
      }
      typeSelector.add(option);
    }
    for (k = 0; k < SPIGOT_SIZE_OPTIONS.length; k++) {
      const size = SPIGOT_SIZE_OPTIONS[k];
      const option = document.createElement("option");
      option.value = size;
      option.text = k.toString(10);
      if (k === DEFAULT_SPIGOT_SIZE_IDX) {
        option.selected = "selected";
        SPIGOT_SIZES[i] = size;
      }
      sizeSelector.add(option);
    }
  }
  spigotTypes[0].addEventListener("change", function () {
    SPIGOT_ELEMENTS[0] = parseInt(spigotTypes[0].value, 10);
  });
  spigotTypes[1].addEventListener("change", function () {
    SPIGOT_ELEMENTS[1] = parseInt(spigotTypes[1].value, 10);
  });
  spigotTypes[2].addEventListener("change", function () {
    SPIGOT_ELEMENTS[2] = parseInt(spigotTypes[2].value, 10);
  });
  spigotTypes[3].addEventListener("change", function () {
    SPIGOT_ELEMENTS[3] = parseInt(spigotTypes[3].value, 10);
  });
  spigotSizes[0].addEventListener("change", function () {
    SPIGOT_SIZES[0] = parseInt(spigotSizes[0].value, 10);
  });
  spigotSizes[1].addEventListener("change", function () {
    SPIGOT_SIZES[1] = parseInt(spigotSizes[1].value, 10);
  });
  spigotSizes[2].addEventListener("change", function () {
    SPIGOT_SIZES[2] = parseInt(spigotSizes[2].value, 10);
  });
  spigotSizes[3].addEventListener("change", function () {
    SPIGOT_SIZES[3] = parseInt(spigotSizes[3].value, 10);
  });

  /* 'overwrite' checkbox */
  const overwriteCheckbox = document.getElementById("overwriteCheckbox");
  overwriteCheckbox.checked = OVERWRITE_ENABLED;
  overwriteCheckbox.addEventListener("click", function () {
    OVERWRITE_ENABLED = overwriteCheckbox.checked;
  });

  /* speed slider */
  const speedSlider = document.getElementById("speedSlider");
  speedSlider.min = 0;
  speedSlider.max = MAX_FPS;
  speedSlider.value = DEFAULT_FPS;
  speedSlider.addEventListener("input", function () {
    const val = parseInt(speedSlider.value, 10);
    /* make 'magnetic' towards the default */
    if (Math.abs(val - DEFAULT_FPS) < 10) speedSlider.value = DEFAULT_FPS;
    setFPS(parseInt(speedSlider.value, 10));
  });

  /* zombie slider */
  const zombieSlider = document.getElementById("zombieSlider");
  zombieSlider.min = 0;
  zombieSlider.max = MAX_ZOMBIES;
  zombieSlider.value = 0;
  zombieSlider.addEventListener("input", function () {
    const val = parseInt(zombieSlider.value, 10);
    setZombieCount(parseInt(zombieSlider.value, 10));
  });

  /* clear button */
  const clearButton = document.getElementById("clearButton");
  clearButton.onclick = clearGameCanvas;

  /* save button */
  const saveButton = document.getElementById("saveButton");
  saveButton.onclick = saveGameCanvas;

  /* load button */
  const loadButton = document.getElementById("loadButton");
  loadButton.onclick = loadGameCanvas;
}

/*
 * Re-label the element chips and spigot pickers after a language switch.
 * The simulation state is untouched — only text changes.
 */
function refreshMenuLanguage() {
  const chips = document.querySelectorAll(".elementMenuButton");
  for (var i = 0; i < chips.length; i++) {
    const type = parseInt(chips[i].id, 10);
    const label = menuName(type);
    chips[i].title = label;
    const span = chips[i].firstChild;
    if (span) span.textContent = label;
    else chips[i].textContent = label;
  }

  const spigotTypes = document.querySelectorAll(".spigotType");
  for (var j = 0; j < spigotTypes.length; j++) {
    const options = spigotTypes[j].options;
    for (var k = 0; k < options.length; k++) {
      options[k].text = menuName(parseInt(options[k].value, 10));
    }
  }
}

if (window.MG) MG.onChange(refreshMenuLanguage);

function drawFPSLabel(fps) {
  document.getElementById("fps-counter").innerText = "FPS: " + fps;
}

function drawZombieCount(val) {
  document.getElementById("zombieCount").innerText = val;
}
