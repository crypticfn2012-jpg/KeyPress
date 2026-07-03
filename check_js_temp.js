let filters = {
  rarity: null,
  origin: null,
  equipped: null
};

function addPoint() {
  score++;
  document.getElementById("score").textContent = score;
}
function getFilteredInventory() {
  return inventory.filter(item => {
    if (filters.rarity && item.rarity !== filters.rarity) return false;
    if (filters.origin && item.origin !== filters.origin) return false;
    if (filters.equipped !== null && item.equipped !== filters.equipped) return false;
    return true;
  });
}
function displayInventory() {
  const container = document.getElementById("inventory");
  container.innerHTML = "";

  let items = getFilteredInventory();

  items.forEach(item => {
    let div = document.createElement("div");
    div.textContent = `${item.id} (${item.rarity}) x${item.count}`;
    container.appendChild(div);
  });
}
function setFilter(type, value) {
  filters[type] = value;
  displayInventory();
}

function clearFilters() {
  filters.rarity = null;
  filters.origin = null;
  filters.equipped = null;
  displayInventory();
}
  async function submitScore(score) {
    const player = Gamplo.getPlayer();

    if (!player) return;

    await fetch("https://your-server.com/leaderboard/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            playerId: player.id,
            name: player.displayName,
            avatar: player.image,
            score: score
        })
    });
}
async function loadLeaderboard() {
    try {
        const res = await fetch("https://your-server.com/leaderboard/top");
        const data = await res.json();
        renderLeaderboard(data);
    } catch (err) {
        console.warn("Unable to load leaderboard", err);
    }
}
function renderLeaderboard(data) {
    const box = document.getElementById("leaderboard");
    if (!box) return;
    box.innerHTML = "";

    data.forEach((p, i) => {
        const el = document.createElement("div");
        el.className = "lb-row";
        el.innerHTML = `
            <span>#${i + 1}</span>
            <img src="${p.avatar || ''}" width="24"/>
            <b>${p.name}</b>
            <span>${p.score}</span>
        `;
        box.appendChild(el);
    });
}
/* =========================================================
   KEYBOARD LAYOUT
========================================================= */
const layout = [
  ["ESC","1","2","3","4","5","6","7","8","9","0","-","=","BACK"],
  ["TAB","Q","W","E","R","T","Y","U","I","O","P","[","]"],
  ["CAPS","A","S","D","F","G","H","J","K","L",";","'","ENTER"],
  ["SHIFT","Z","X","C","V","B","N","M",",",".","/","SHIFT"],
  ["SPACE"]
];
const keyEventMap = {
  "Escape":"ESC","Backspace":"BACK","Tab":"TAB","CapsLock":"CAPS",
  "Enter":"ENTER","Shift":"SHIFT"," ":"SPACE"
};

/* =========================================================
   KEYCAP COSMETICS & BOARD THEMES
========================================================= */
const cosmetics = [
  {id:"glass",   name:"Glass",   cost:100,  cls:"glass"},
  {id:"neon",    name:"Neon",    cost:200,  cls:"neon"},
  {id:"metal",   name:"Metal",   cost:300,  cls:"metal"},
  {id:"rune",    name:"Rune",    cost:500,  cls:"rune"},
  {id:"pixel",   name:"Pixel",   cost:700,  cls:"pixel"},
  {id:"wood",    name:"Wood",    cost:900,  cls:"wood"},
  {id:"gold",    name:"Gold",    cost:1200, cls:"gold"},
  {id:"slime",   name:"Slime",   cost:1400, cls:"slime"},
  {id:"camo",    name:"Camo",    cost:1300, cls:"camo"},
  {id:"denim",   name:"Denim",   cost:1200, cls:"denim"},
  {id:"candy",   name:"Candy",   cost:1500, cls:"candy"},
  {id:"ice",     name:"Ice",     cost:1600, cls:"ice"},
  {id:"lava",    name:"Lava",    cost:1800, cls:"lava"},
  {id:"marble",  name:"Marble",  cost:1900, cls:"marble"},
  {id:"circuit", name:"Circuit", cost:2100, cls:"circuit"},
  {id:"holo",    name:"Holographic", cost:2800, cls:"holo"},
  {id:"cosmic",  name:"Cosmic",  cost:3400, cls:"cosmic"}
];

const boardThemes = [
  {id:"default",     name:"Default",          cost:0,   frame:"#12151c", glow:"transparent", blur:"0px"},
  {id:"rgb",          name:"RGB Backlight",   cost:800, frame:"#141414", glow:"conic-gradient(red,yellow,lime,cyan,blue,magenta,red)", blur:"26px"},
  {id:"underblue",    name:"Blue Underglow",  cost:400, frame:"#0c1420", glow:"#2a6bff", blur:"30px"},
  {id:"underpurple",  name:"Purple Underglow",cost:400, frame:"#170c26", glow:"#8a2aff", blur:"30px"},
  {id:"chrome",       name:"Chrome Frame",    cost:600, frame:"linear-gradient(160deg,#e8ecf2,#8b93a0)", glow:"transparent", blur:"0px"},
  {id:"woodframe",    name:"Wood Frame",      cost:600, frame:"linear-gradient(160deg,#7a4b28,#3a2412)", glow:"transparent", blur:"0px"}
];


const RARITY_BASE_PRICE = {common:20, rare:60, epic:150, legendary:400};
const RARITY_BOOST      = {common:1,  rare:2,  epic:4,   legendary:8};

function shuffleArr(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}
function checkTiming() {
    const now = Date.now();

    if (lastClickTime && now - lastClickTime < 15) {
        triggerVerification();
    }

    lastClickTime = now;
}
function rollRarityFromWeights(w){
  const total = w.common + w.rare + w.epic + w.legendary;
  let r = Math.random()*total;
  if(r < w.common) return "common";
  r -= w.common;
  if(r < w.rare) return "rare";
  r -= w.rare;
  if(r < w.epic) return "epic";
  return "legendary";
}

function buildCatalog(prefix, adjectives, nouns, emojis, count, weights){
  const combos = [];
  adjectives.forEach(a => nouns.forEach(n => combos.push(a+" "+n)));
  shuffleArr(combos);
  const catalog = [];
  for(let i=0;i<count;i++){
    let name = combos[i % combos.length];
    if(i >= combos.length) name += " " + (Math.floor(i/combos.length)+1);
    const rarity = rollRarityFromWeights(weights);
    const icon = emojis[i % emojis.length];
    const priceJitter = 0.8 + Math.random()*0.4;
    const boostJitter = 0.85 + Math.random()*0.3;
    catalog.push({
      templateKey: prefix + "_" + i,
      name, icon, rarity,
      basePrice: Math.max(5, Math.round(RARITY_BASE_PRICE[rarity]*priceJitter)),
      boost: parseFloat((RARITY_BOOST[rarity]*boostJitter).toFixed(2))
    });
  }
  return catalog;
}

const STARTER_ADJ = ["Little","Shiny","Lucky","Bright","Twinkly","Simple","Happy","Round"];
const STARTER_NOUN = ["Star","Droplet","Clover","Orb","Spark","Pebble","Leaf","Bead"];
const STARTER_EMOJI = ["⭐","💧","🍀","🔵","✨","🪨","🍃","🔴"];

const ELEMENTAL_ADJ = ["Blazing","Frozen","Storming","Rooted","Charged","Radiant","Shadowed","Lunar","Solar","Molten","Crystalline","Windswept","Volcanic","Glacial","Thundering"];
const ELEMENTAL_NOUN = ["Ember","Droplet","Gust","Boulder","Spark","Sprout","Shard","Eclipse","Flare","Cinder","Frost","Gale","Quake","Tide","Bolt"];
const ELEMENTAL_EMOJI = ["🔥","💧","🌪️","🪨","⚡","🌿","❄️","☀️","🌑","🌋","🧊","🍂","🌊","🌈","🌤️"];

const MYSTIC_ADJ = ["Arcane","Enchanted","Ancient","Cursed","Blessed","Ethereal","Runic","Celestial","Forbidden","Sacred","Whispering","Hidden","Astral","Ghostly","Timeworn"];
const MYSTIC_NOUN = ["Orb","Ward","Rune","Sigil","Relic","Talisman","Charm","Amulet","Grimoire","Idol","Totem","Vial","Scroll","Crystal","Seal"];
const MYSTIC_EMOJI = ["🔮","💫","✨","🌟","🪄","🧿","🕯️","📿","⚱️","🪬","📜","🔯","🧪","🗝️","💠"];

const VAULT_ADJ = ["Eternal","Divine","Forbidden","Radiant","Voidborn","Immortal","Sovereign","Primal","Infinite","Hallowed"];
const VAULT_NOUN = ["Core","Crown","Seal","Heart","Throne","Codex","Aegis","Nexus","Beacon","Vault"];
const VAULT_EMOJI = ["👑","🏆","🌌","⚜️","💎","🔱","🪙","🛡️","🌠","🔆"];

const Nebula_ADJ = ["Astral","Ethereal","Celestial","Void-Touched","Stellar","Cosmic","Nova-Forged","Galactic","Radiant","Eclipsebound"];
const Nebula_NOUN = ["Nebula","Supercluster","Singularity","Cosmos","Starforge","Event Horizon","Darkrift","Starlight","Galaxy Core","Astral Nexus"];
const Nebula_EMOJI = ["🌌","✨","🌠","🪐","🌑","💫","🔮","⚡","🛸","👁️"];

const MONSTER_ADJ = ["Tiny","Grumpy","Bouncy","Sneaky","Sparkly","Rusty","Fuzzy","Wobbly","Zappy","Gloopy","Spiky","Shiny","Sleepy","Feisty","Chunky","Glowing","Squishy","Cheeky","Mossy","Frosty","Slimey","Cursed","Wild","Brave","Soggy","Electric","Toothy","Dizzy","Burly","Hexed"];

const MONSTER_NOUN = ["Blob","Sprite","Imp","Gremlin","Critter","Beastie","Wisp","Goblin","Sprocket","Muncher","Nibbler","Snapper","Hopper","Glimmer","Grub","Fang","Whisker","Scamp","Puff","Gloop","Drifter","Chomper","Howler","Biter","Spore","Crawler","Slither","Maw","Tick","Rumbler"];

const MONSTER_EMOJI = ["👾","🐲","🐙","🦑","🐌","🐛","🦎","🐸","🦖","🦕","👹","👺","🤖","🎃","🦠","🐺","🦇","🐍","🦂","🦥","💥","⚡","🌪️","🔥","❄️","🌿","☠️","💀","👁️","🧿"];

const BOXES = [
  {id:"starter",   name:"Starter Box",   cost:100,  catalog:"starter",   desc:"Basic charms to get you going.",           weights:{common:65,rare:25,epic:8, legendary:2}},
  {id:"elemental", name:"Elemental Box", cost:250,  catalog:"elemental", desc:"Charms infused with fire, ice & storm.",   weights:{common:55,rare:28,epic:13,legendary:4}},
  {id:"mystic",    name:"Mystic Box",    cost:500,  catalog:"mystic",    desc:"Arcane relics and enchanted trinkets.",    weights:{common:45,rare:30,epic:18,legendary:7}},
  {id:"monster",   name:"Monster Box",   cost:400,  catalog:"monster",   desc:"200 cartoony critters to collect.",        weights:{common:55,rare:27,epic:14,legendary:4}},
  {id:"vault",     name:"Vault Box",     cost:1000, catalog:"vault",     desc:"The rarest treasures in the game.",        weights:{common:30,rare:30,epic:28,legendary:12}},
  {id:"nebula",    name:"Nebula Box",    cost:5000, catalog:"nebula",    desc:"The best of the best.",                    weights:{common:50,rare:30,epic:25,legendary:14}},

];

const CATALOGS = {
  starter:   buildCatalog("starter",   STARTER_ADJ,   STARTER_NOUN,   STARTER_EMOJI,   40,  BOXES[0].weights),
  elemental: buildCatalog("elemental", ELEMENTAL_ADJ, ELEMENTAL_NOUN, ELEMENTAL_EMOJI, 100, BOXES[1].weights),
  mystic:    buildCatalog("mystic",    MYSTIC_ADJ,    MYSTIC_NOUN,    MYSTIC_EMOJI,    100, BOXES[2].weights),
  monster:   buildCatalog("monster",   MONSTER_ADJ,   MONSTER_NOUN,   MONSTER_EMOJI,   200, BOXES[3].weights),
  vault:     buildCatalog("vault",     VAULT_ADJ,     VAULT_NOUN,     VAULT_EMOJI,     60,  BOXES[4].weights),
  nebula:    buildCatalog("nebula",    Nebula_ADJ,    Nebula_NOUN,    Nebula_EMOJI,    70,  BOXES[5].weights)
};

function openBoxRoll(box){
  const rarity = rollRarityFromWeights(box.weights);
  const catalog = CATALOGS[box.catalog];
  let candidates = catalog.filter(c => c.rarity === rarity);
  if(candidates.length === 0) candidates = catalog; // safety fallback
  const template = candidates[Math.floor(Math.random()*candidates.length)];
  return {
    instanceId: "i" + Date.now() + Math.floor(Math.random()*1000000),
    templateKey: template.templateKey,
    name: template.name,
    icon: template.icon,
    rarity: template.rarity,
    basePrice: template.basePrice,
    boost: template.boost,
    condition: 100,
    boxId: box.id
  };
}

/* =========================================================
   CONDITION / MARKETPLACE VALUE
========================================================= */
function conditionLabel(cond){
  if(cond >= 99) return "Pristine";
  if(cond >= 85) return "Good";
  if(cond >= 60) return "Worn";
  if(cond >= 30) return "Damaged";
  return "Ruined";
}
function conditionMultiplier(cond){
  if(cond >= 99) return 1.0;
  if(cond >= 85) return 0.8;
  if(cond >= 60) return 0.55;
  if(cond >= 30) return 0.3;
  return 0.12;
}
function sellValue(charm){
  return Math.max(1, Math.round(charm.basePrice * conditionMultiplier(charm.condition)));
}

/* =========================================================
   STATE
========================================================= */
const STORAGE_KEY = "keypress_save_v4";

function defaultState(){
  return {
    clicks:0,
    totalPresses:0,
    mainKey:null,
    ownedCosmetics:["base"],
    equippedCosmetic:"base",
    ownedThemes:["default"],
    equippedTheme:"default",
    charms:[],        // {instanceId, templateKey, name, icon, rarity, basePrice, boost, condition, boxId}
    keyCharms:{},      // keyLabel -> charm instanceId
    muted:false,
    volume:0.5
  };
}

let storageAvailable = true;
let state = loadState();
let history = [];
let placingCharmId = null;
let marketSort = "value";
let clicks = [];
let flagged = false;
let lastClickTime = 0;

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return migrateOldSave();
    const parsed = JSON.parse(raw);
    const merged = Object.assign(defaultState(), parsed);
    merged.charms = (merged.charms || []).map(normalizeCharm);
    return merged;
  }catch(e){
    console.warn("KeyPress: could not load save", e);
    storageAvailable = false;
    return defaultState();
  }
}

// pulls forward a save from an earlier version of the game if present, so
// upgrading the game doesn't wipe anyone's progress
function migrateOldSave(){
  try{
    for(const key of ["keypress_save_v3","keypress_save_v2","keypress_save_v1"]){
      const raw = localStorage.getItem(key);
      if(raw){
        const parsed = JSON.parse(raw);
        const merged = Object.assign(defaultState(), parsed);
        merged.charms = (merged.charms || []).map(normalizeCharm);
        return merged;
      }
    }
  }catch(e){ /* ignore, fall through to fresh state */ }
  return defaultState();
}

function normalizeCharm(c){
  return {
    instanceId: c.instanceId || c.id || ("i"+Date.now()+Math.floor(Math.random()*1000000)),
    templateKey: c.templateKey || "",
    name: c.name || "Mystery Charm",
    icon: c.icon || "❔",
    rarity: c.rarity || "common",
    basePrice: c.basePrice || c.value || RARITY_BASE_PRICE[c.rarity] || 20,
    boost: c.boost !== undefined ? c.boost : (RARITY_BOOST[c.rarity] || 1),
    condition: c.condition !== undefined ? c.condition : 100,
    boxId: c.boxId || c.boxType || "starter"
  };
}

function saveState(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageAvailable = true;
    setSaveStatus(true);
  }catch(e){
    console.warn("KeyPress: could not save progress", e);
    storageAvailable = false;
    setSaveStatus(false);
  }
}

function setSaveStatus(ok){
  const el = document.getElementById("saveStatus");
  if(!el) return;
  if(ok){
    el.textContent = "Saved locally in this browser.";
    el.classList.remove("warn");
  }else{
    el.textContent = "⚠ Couldn't save (private browsing or local-file security may block it). Use Export to back up your progress.";
    el.classList.add("warn");
  }
}

/* =========================================================
   AUDIO — satisfying tap, not harsh noise
========================================================= */
let audioCtx = null;
function ensureAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if(audioCtx.state === "suspended") audioCtx.resume();
}

function playClickSound(){
  if(state.muted) return;
  ensureAudio();
  const ctx = audioCtx;
  const now = ctx.currentTime;
  const vol = state.volume;
  const pitchJitter = 0.94 + Math.random()*0.12;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(190 * pitchJitter, now);
  osc.frequency.exponentialRampToValueAtTime(70 * pitchJitter, now + 0.045);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.0001, now);
  oscGain.gain.linearRampToValueAtTime(vol * 0.55, now + 0.004);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  osc.connect(oscGain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);

  const tickBufferSize = Math.floor(ctx.sampleRate * 0.006);
  const tickBuffer = ctx.createBuffer(1, tickBufferSize, ctx.sampleRate);
  const tickData = tickBuffer.getChannelData(0);
  for(let i=0;i<tickBufferSize;i++){
    tickData[i] = (Math.random()*2-1) * Math.pow(1 - i/tickBufferSize, 3);
  }
  const tick = ctx.createBufferSource();
  tick.buffer = tickBuffer;

  const tickFilter = ctx.createBiquadFilter();
  tickFilter.type = "lowpass";
  tickFilter.frequency.value = 3200;

  const tickGain = ctx.createGain();
  tickGain.gain.value = vol * 0.12;

  tick.connect(tickFilter).connect(tickGain).connect(ctx.destination);
  tick.start(now);
  tick.stop(now + 0.008);
}

/* =========================================================
   DOM REFS (declared exactly once)
========================================================= */
const startScreen = document.getElementById("startScreen");
const gameWrap = document.getElementById("gameWrap");
const playBtn = document.getElementById("playBtn");
const keyboardEl = document.getElementById("keyboard");

const statClicks = document.getElementById("statClicks");
const statCps = document.getElementById("statCps");
const statTotal = document.getElementById("statTotal");
const statBoost = document.getElementById("statBoost");

const shop = document.getElementById("shop");
const shopBtn = document.getElementById("shopBtn");
const changeKeyBtn = document.getElementById("changeKeyBtn");
const muteBtn = document.getElementById("muteBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");
const volumeSlider = document.getElementById("volumeSlider");

const cosmeticsList = document.getElementById("cosmeticsList");
const themesList = document.getElementById("themesList");
const boxesList = document.getElementById("boxesList");
const collectionList = document.getElementById("collectionList");
const marketList = document.getElementById("marketList");

const placeBanner = document.getElementById("placeBanner");
const revealModal = document.getElementById("revealModal");
const revealCard = document.getElementById("revealCard");
const revealIcon = document.getElementById("revealIcon");
const revealName = document.getElementById("revealName");
const revealRarity = document.getElementById("revealRarity");
const revealSub = document.getElementById("revealSub");
const closeRevealBtn = document.getElementById("closeRevealBtn");

let awaitingKeySelectMode = false;

/* =========================================================
   KEYBOARD RENDER
========================================================= */
function createKeySlot(label){
  const slot = document.createElement("div");
  slot.className = "keySlot";
  if(["SHIFT","ENTER","BACK","TAB","CAPS"].includes(label)) slot.classList.add("wide");
  if(label === "SPACE") slot.classList.add("space");

  const cap = document.createElement("div");
  cap.className = "key";
  cap.textContent = label;
  cap.dataset.key = label;
  cap.addEventListener("click", () => handleKeyClick(label));

  slot.appendChild(cap);
  return slot;
}

function renderKeyboard(){
  keyboardEl.innerHTML = "";
  layout.forEach(row => {
    const r = document.createElement("div");
    r.className = "row";
    row.forEach(k => r.appendChild(createKeySlot(k)));
    keyboardEl.appendChild(r);
  });
  applyCosmetic();
  applyTheme();
  refreshKeyVisuals();
}

function handleKeyClick(label){
  if(placingCharmId){
    state.keyCharms[label] = placingCharmId;
    placingCharmId = null;
    placeBanner.classList.remove("show");
    saveState();
    refreshKeyVisuals();
    return;
  }
  if(!state.mainKey || awaitingKeySelectMode){
    state.mainKey = label;
    awaitingKeySelectMode = false;
    saveState();
    refreshKeyVisuals();
    return;
  }
  if(label === state.mainKey){
    registerPress(label);
  }
}

function refreshKeyVisuals(){
  document.querySelectorAll(".key").forEach(el => {
    const label = el.dataset.key;
    el.classList.toggle("selected", label === state.mainKey);
    el.classList.toggle("placeTarget", !!placingCharmId);

    const existingBadge = el.querySelector(".charmBadge");
    if(existingBadge) existingBadge.remove();

    const charmId = state.keyCharms[label];
    if(charmId){
      const charm = state.charms.find(c => c.instanceId === charmId);
      if(charm){
        const badge = document.createElement("div");
        badge.className = "charmBadge " + charm.rarity;
        badge.textContent = charm.icon;
        el.appendChild(badge);
      }
    }
  });
}

/* =========================================================
   COSMETICS / THEMES APPLICATION
========================================================= */
function applyCosmetic(){
  document.querySelectorAll(".key").forEach(k => {
    cosmetics.forEach(c => k.classList.remove(c.cls));
    const c = cosmetics.find(c => c.id === state.equippedCosmetic);
    if(c) k.classList.add(c.cls);
  });
}
function applyTheme(){
  const theme = boardThemes.find(t => t.id === state.equippedTheme) || boardThemes[0];
  document.documentElement.style.setProperty("--board-frame", theme.frame);
  document.documentElement.style.setProperty("--underglow", theme.glow);
  document.documentElement.style.setProperty("--underglow-blur", theme.blur);
}

/* =========================================================
   CASH BOOST from equipped charms
========================================================= */
function getTotalBoostPercent(){
  const equippedIds = new Set(Object.values(state.keyCharms));
  let total = 0;
  equippedIds.forEach(id => {
    const c = state.charms.find(c => c.instanceId === id);
    if(c) total += c.boost;
  });
  return total;
}

/* =========================================================
   KEY PRESS HANDLING
========================================================= */
window.addEventListener("keydown", e => {
  const label = keyEventMap[e.key] || e.key.toUpperCase();

  if(label === "O" && !placingCharmId){ toggleShop(); return; }
  if(label === "ESC" && placingCharmId){
    placingCharmId = null;
    placeBanner.classList.remove("show");
    refreshKeyVisuals();
    return;
  }

  if(!state.mainKey) return;
  if(label !== state.mainKey) return;
  if(e.repeat) return;

  registerPress(label);
});

function registerPress(label) {
    state.totalPresses++;

    const boostMultiplier = 1 + getTotalBoostPercent() / 100;
    state.clicks = parseFloat((state.clicks + 1 * boostMultiplier).toFixed(2));

    const now = Date.now();

    // ---- CLICK TRACKER ----
    clicks.push(now);

    // keep only last 1 second
    clicks = clicks.filter(t => now - t < 1000);

    // detect unnatural CPS
    if (clicks.length > 22 && !flagged) {
        triggerVerification();
        flagged = true;
    }

    // timing anti-macro check
    checkTiming();

    // Gamplo Achievements
    if (window.Gamplo && typeof Gamplo.isReady === 'function' && Gamplo.isReady()) {
        if (state.totalPresses >= 100) {
            Gamplo.unlockAchievement("100_clicks").catch(() => {});
        }

        if (state.totalPresses >= 200) {
            Gamplo.unlockAchievement("200_click").catch(() => {});
        }
    }

    history.push(Date.now());
    playClickSound();

    // wear down a charm if one is equipped on the key being pressed
    const charmId = state.keyCharms[label];
    if(charmId){
      const charm = state.charms.find(c => c.instanceId === charmId);
      if(charm) charm.condition = Math.max(0, charm.condition - Math.random()*0.35);
    }

    document.querySelectorAll(".key").forEach(el => {
      if(el.dataset.key === label){
        el.classList.add("pressed");
        setTimeout(() => el.classList.remove("pressed"), 70);
      }
    });

    updateStatsDisplay();
    saveState();
}

function updateStatsDisplay(){
  statClicks.textContent = Math.floor(state.clicks);
  statTotal.textContent = state.totalPresses;
  statBoost.textContent = "+" + getTotalBoostPercent().toFixed(1) + "%";
}

setInterval(() => {
  const now = Date.now();
  history = history.filter(t => now - t < 1000);
  statCps.textContent = history.length;
}, 100);

/* =========================================================
   SHOP: COSMETICS / THEMES
========================================================= */
function renderCosmetics(){
  cosmeticsList.innerHTML = "";
  cosmetics.forEach(c => {
    const owned = state.ownedCosmetics.includes(c.id);
    const equipped = state.equippedCosmetic === c.id;
    const el = document.createElement("div");
    el.className = "item" + (owned?" owned":"") + (equipped?" equipped":"") + (!owned && state.clicks < c.cost ? " disabled":"");
    el.innerHTML = `
      <div>
        <div class="itemName">${c.name}</div>
        <div class="itemSub">${owned ? (equipped?"Equipped":"Owned") : "Locked"}</div>
      </div>
      <div class="cost">${owned ? (equipped?"✓":"Equip") : c.cost}</div>
    `;
    el.onclick = () => {
      if(owned){ state.equippedCosmetic = c.id; }
      else if(state.clicks >= c.cost){
        state.clicks -= c.cost;
        state.ownedCosmetics.push(c.id);
        state.equippedCosmetic = c.id;
      } else return;
      saveState(); applyCosmetic(); updateStatsDisplay(); renderCosmetics();
    };
    cosmeticsList.appendChild(el);
  });
}

function renderThemes(){
  themesList.innerHTML = "";
  boardThemes.forEach(t => {
    const owned = state.ownedThemes.includes(t.id);
    const equipped = state.equippedTheme === t.id;
    const el = document.createElement("div");
    el.className = "item" + (owned?" owned":"") + (equipped?" equipped":"") + (!owned && state.clicks < t.cost ? " disabled":"");
    el.innerHTML = `
      <div>
        <div class="itemName">${t.name}</div>
        <div class="itemSub">${owned ? (equipped?"Equipped":"Owned") : "Locked"}</div>
      </div>
      <div class="cost">${owned ? (equipped?"✓":"Equip") : t.cost}</div>
    `;
    el.onclick = () => {
      if(owned){ state.equippedTheme = t.id; }
      else if(state.clicks >= t.cost){
        state.clicks -= t.cost;
        state.ownedThemes.push(t.id);
        state.equippedTheme = t.id;
      } else return;
      saveState(); applyTheme(); updateStatsDisplay(); renderThemes();
    };
    themesList.appendChild(el);
  });
}

/* =========================================================
   SHOP: BOXES
========================================================= */
function renderBoxes(){
  boxesList.innerHTML = "";
  BOXES.forEach(box => {
    const el = document.createElement("div");
    el.className = "boxCard" + (state.clicks < box.cost ? " disabled" : "");
    el.innerHTML = `
      <div class="boxHeader"><span>${box.name}</span><span class="cost">${box.cost}</span></div>
      <div class="itemSub">${box.desc}</div>
      <div class="itemSub">C ${box.weights.common}% · R ${box.weights.rare}% · E ${box.weights.epic}% · L ${box.weights.legendary}%</div>
    `;
    el.onclick = () => {
      if(state.clicks < box.cost) return;
      state.clicks -= box.cost;
      const charm = openBoxRoll(box);
      state.charms.push(charm);
      saveState();
      updateStatsDisplay();
      renderBoxes();
      renderCollection();
      renderMarket();
      showReveal(charm);
    };
    boxesList.appendChild(el);
  });
}

function showReveal(charm){
  revealCard.className = "revealCard " + charm.rarity;
  revealIcon.textContent = charm.icon;
  revealName.textContent = charm.name;
  revealRarity.textContent = charm.rarity;
  revealSub.textContent = "Worth " + charm.basePrice + " clicks · +" + charm.boost + "% boost";
  revealModal.classList.add("show");
}
closeRevealBtn.onclick = () => revealModal.classList.remove("show");

/* =========================================================
   SHOP: CHARM COLLECTION (equip / unequip)
========================================================= */
function renderCollection(){
  collectionList.innerHTML = "";
  if(state.charms.length === 0){
    collectionList.innerHTML = "<div class='empty'>No charms yet — open a box!</div>";
    return;
  }
  const grid = document.createElement("div");
  grid.className = "charmGrid";

  state.charms.forEach(charm => {
    const equippedKey = Object.keys(state.keyCharms).find(k => state.keyCharms[k] === charm.instanceId);
    const cell = document.createElement("div");
    cell.className = "charmCell " + charm.rarity + (placingCharmId === charm.instanceId ? " selected" : "");
    cell.title = `${charm.name} (${charm.rarity})\nValue: ${sellValue(charm)} clicks\nBoost: +${charm.boost}%\nCondition: ${Math.round(charm.condition)}% (${conditionLabel(charm.condition)})`;
    cell.textContent = charm.icon;

    if(equippedKey){
      const tag = document.createElement("div");
      tag.className = "equippedTag";
      tag.textContent = equippedKey;
      cell.appendChild(tag);
    }
    const cond = document.createElement("div");
    cond.className = "conditionTag";
    cond.textContent = Math.round(charm.condition) + "%";
    cell.appendChild(cond);

    cell.onclick = () => {
      if(equippedKey){
        delete state.keyCharms[equippedKey];
        saveState();
        refreshKeyVisuals();
        renderCollection();
        updateStatsDisplay();
        return;
      }
      placingCharmId = charm.instanceId;
      placeBanner.classList.add("show");
      shop.classList.remove("open");
      refreshKeyVisuals();
    };
    grid.appendChild(cell);
  });

  collectionList.appendChild(grid);
  const hint = document.createElement("div");
  hint.className = "itemSub";
  hint.style.marginTop = "6px";
  hint.textContent = "Tap a charm to place it on a key (boosts your click earnings). Tap an equipped charm to remove it.";
  collectionList.appendChild(hint);
}

/* =========================================================
   SHOP: MARKETPLACE (sell)
========================================================= */
function renderMarket(){
  marketList.innerHTML = "";
  if(state.charms.length === 0){
    marketList.innerHTML = "<div class='empty'>Nothing to sell yet — open a box!</div>";
    return;
  }

  const sorted = state.charms.slice().sort((a,b) => {
    if(marketSort === "value") return sellValue(b) - sellValue(a);
    if(marketSort === "condition") return b.condition - a.condition;
    const order = {legendary:0, epic:1, rare:2, common:3};
    return order[a.rarity] - order[b.rarity];
  });

  sorted.forEach(charm => {
    const value = sellValue(charm);
    const label = conditionLabel(charm.condition);
    const equippedKey = Object.keys(state.keyCharms).find(k => state.keyCharms[k] === charm.instanceId);
    const el = document.createElement("div");
    el.className = "marketItem";
    el.innerHTML = `
      <div class="marketIcon ${charm.rarity}">${charm.icon}</div>
      <div class="marketInfo">
        <div class="itemName">${charm.name}</div>
        <div class="itemSub">${charm.rarity} · ${label} (${Math.round(charm.condition)}%) · +${charm.boost}% boost${equippedKey ? " · on "+equippedKey : ""}</div>
      </div>
      <button class="sellBtn">Sell ${value}</button>
    `;
    el.querySelector(".sellBtn").onclick = () => {
      if(!confirm(`Sell ${charm.name} for ${value} clicks?`)) return;
      sellCharm(charm.instanceId);
    };
    marketList.appendChild(el);
  });
}

function sellCharm(instanceId){
  const idx = state.charms.findIndex(c => c.instanceId === instanceId);
  if(idx === -1) return;
  const charm = state.charms[idx];
  const value = sellValue(charm);
  state.clicks += value;

  Object.keys(state.keyCharms).forEach(k => {
    if(state.keyCharms[k] === instanceId) delete state.keyCharms[k];
  });
  state.charms.splice(idx, 1);

  saveState();
  updateStatsDisplay();
  refreshKeyVisuals();
  renderMarket();
  renderCollection();
}

document.querySelectorAll(".sortRow .iconbtn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".sortRow .iconbtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    marketSort = btn.dataset.sort;
    renderMarket();
  };
});

/* =========================================================
   SHOP TABS / TOGGLES
========================================================= */
document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("section-" + tab.dataset.tab).classList.add("active");
  };
});

function toggleShop(){
  shop.classList.toggle("open");
  if(shop.classList.contains("open")){
    renderCosmetics();
    renderThemes();
    renderBoxes();
    renderCollection();
    renderMarket();
  }
}
shopBtn.onclick = toggleShop;

changeKeyBtn.onclick = () => { awaitingKeySelectMode = true; };

muteBtn.onclick = () => {
  state.muted = !state.muted;
  muteBtn.textContent = state.muted ? "🔇" : "🔊";
  saveState();
};

settingsBtn.onclick = () => {
  settingsModal.classList.add("open");
  setSaveStatus(storageAvailable);
};
closeSettingsBtn.onclick = () => settingsModal.classList.remove("open");

volumeSlider.oninput = () => {
  state.volume = volumeSlider.value / 100;
  saveState();
};

resetBtn.onclick = () => {
  if(confirm("Reset all progress? This cannot be undone.")){
    try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
    state = defaultState();
    history = [];
    placingCharmId = null;
    settingsModal.classList.remove("open");
    placeBanner.classList.remove("show");
    renderKeyboard();
    updateStatsDisplay();
    muteBtn.textContent = "🔊";
    volumeSlider.value = 50;
  }
};

exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "keypress-save.json";
  a.click();
  URL.revokeObjectURL(url);
};

importInput.onchange = (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const parsed = JSON.parse(reader.result);
      state = Object.assign(defaultState(), parsed);
      state.charms = (state.charms || []).map(normalizeCharm);
      saveState();
      renderKeyboard();
      updateStatsDisplay();
      muteBtn.textContent = state.muted ? "🔇" : "🔊";
      volumeSlider.value = Math.round(state.volume * 100);
      alert("Save restored!");
    }catch(err){
      alert("That file doesn't look like a valid KeyPress save.");
    }
  };
  reader.readAsText(file);
  importInput.value = "";
};

/* =========================================================
   START SCREEN -> GAME
========================================================= */
playBtn.onclick = () => {
  ensureAudio();
  startScreen.classList.add("hidden");
  setTimeout(() => { startScreen.style.display = "none"; }, 550);
  gameWrap.classList.add("visible");
};

/* =========================================================
   INIT
========================================================= */
function init(){
  renderKeyboard();
  updateStatsDisplay();
  muteBtn.textContent = state.muted ? "🔇" : "🔊";
  volumeSlider.value = Math.round(state.volume * 100);
  statCps.textContent = "0";

  setInterval(saveState, 5000);
  window.addEventListener("beforeunload", saveState);
}
init();
// ---------------------------
// Gamplo Integration
// ---------------------------

if (window.Gamplo && typeof Gamplo.onReady === 'function') {
    Gamplo.onReady(async () => {
        const player = Gamplo.getPlayer();

        if (player) {
            console.log("Logged in as", player.displayName);

            try {
                const save = await Gamplo.getSave();
                if (save) {
                    state = Object.assign(defaultState(), save);
                    state.charms = (state.charms || []).map(normalizeCharm);
                    renderKeyboard();
                    updateStatsDisplay();
                    muteBtn.textContent = state.muted ? "🔇" : "🔊";
                    volumeSlider.value = Math.round(state.volume * 100);
                }
            } catch (e) {
                console.log("Failed to load Gamplo save", e);
            }

            setInterval(async () => {
                try {
                    await Gamplo.setSave(state);
                } catch (e) {
                    console.log(e);
                }
            }, 30000);
        } else {
            console.log("Guest user");
        }
    });
}
function triggerVerification() {
    if (document.getElementById("verifyBox")) return;

    const box = document.createElement("div");
    box.id = "verifyBox";

    box.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            z-index: 9999;
            text-align: center;
            border-radius: 10px;
        ">
            <h3>Quick verification</h3>
            <p>Type: <b>human</b></p>
            <input id="verifyInput" autocomplete="off"/>
        </div>
    `;

    document.body.appendChild(box);

    const input = document.getElementById("verifyInput");

    input.focus();

    input.addEventListener("input", () => {
        const val = input.value.trim().toLowerCase();

        // macro-like spam inside box
        if (val.length > 30) {
            location.reload();
        }

        if (val === "human") {
            box.remove();
            flagged = false;
            clicks = [];
        }
    });
}
window.onload = function() {
  displayInventory();
};
