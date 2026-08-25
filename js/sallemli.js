// --- Audio System (Oscillators) ---
let audioCtx;
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTickSound(irregular = false) {
  if (!audioCtx) return;
  
  if (irregular) {
    // In Stage 2, it only plays if the number is visible. We'll handle this in the tick() function.
  }
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 600;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
  osc.stop(audioCtx.currentTime + 0.1);
}

function playHeartbeatSound() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(50, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.1);
  filter.type = 'lowpass';
  filter.frequency.value = 100;
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}

function playExplosionSound() {
  if (!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 1.5);
  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
  noise.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
  noise.start();
}


// --- Game State ---
let state = {
  playersCount: 3,
  heartsCount: 3,
  players: [], // { name, hearts, index }
  currentRound: 1, // 1 to 3
  bombTimer: 0,
  timerInterval: null,
  currentPlayerIndex: -1,
  buttonLocked: false
};

const ROUND_CONFIGS = [
  { round: 1, title: "الفتيل المشتعل", icon: "🧨", desc: "المؤقت واضح ومكشوف.. جاوب ومرر الجوال بسرعة قبل أن تنفجر القنبلة!" },
  { round: 2, title: "فخ الثواني", icon: "⚠️", desc: "العداد يظهر ويختفي، والتكتكة متقطعة لتشتيت تركيزك.. احذر!" },
  { round: 3, title: "الانفجار الصامت", icon: "💣", desc: "ظلام دامس، لا يوجد عداد ولا تكتكة، فقط نبضات قلب مضللة. مرر الجوال حالاً!" }
];

let availableQuestions = [
  "اذكر اسم ولد بحرف الميم", "اذكر شيء لونه أصفر", "اذكر اسم بنت بحرف السين", "سمِّ أكلة مشهورة",
  "اذكر اسم دولة عربية", "اذكر حيوان يعيش في الماء", "اذكر شيء موجود في المدرسة", "اذكر اسم فاكهة حمراء",
  "اذكر لون علم السعودية", "اذكر وسيلة مواصلات", "اذكر اسم كوكب", "اذكر شكل هندسي",
  "اذكر أداة نستخدمها للأكل", "اذكر اسم رياضة مشهورة", "اذكر مشروب ساخن", "اذكر جزء من جسم الإنسان",
  "اذكر مهنة", "اذكر عاصمة عربية", "اذكر حيوان مفترس", "اذكر طائر يطير",
  "اذكر شهر من شهور السنة", "اذكر يوم من أيام الأسبوع", "اذكر شيء يلبس في القدم", "اذكر شيء موجود في المطبخ",
  "اذكر اسم سيارة", "اذكر اسم حيوان بحرف الألف", "اذكر اسم لاعب كرة قدم", "اذكر شيء مصنوع من الخشب",
  "اذكر لون من ألوان قوس قزح", "اذكر شيء حار", "اذكر شيء بارد", "اذكر جهاز إلكتروني",
  "اذكر شيء لونه أخضر", "اذكر حيوان أليف", "اذكر اسم بحر أو محيط", "اذكر آلة موسيقية"
];
let originalQuestions = [...availableQuestions];


// --- UI Helpers ---
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
}

let toastTimeout;
function showToast(msg) {
  const t = document.getElementById('custom-toast');
  document.getElementById('custom-toast-msg').innerText = msg;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    t.classList.remove('show');
  }, 3000);
}


// --- Setup Logic ---
function renderNameInputs() {
  const list = document.getElementById('names-list');
  if (!list) return;
  
  // Keep existing values if any
  const existingNames = [];
  for (let i = 0; i < list.children.length; i++) {
    existingNames.push(list.children[i].value);
  }
  
  list.innerHTML = '';
  for(let i=0; i<state.playersCount; i++) {
    let val = existingNames[i] || '';
    list.innerHTML += `<input type="text" class="name-input" id="name-${i}" placeholder="اللاعب ${i+1}" value="${val}" />`;
  }
}

function adjPlayers(d) {
  state.playersCount = Math.max(3, state.playersCount + d); // Min 3 players
  document.getElementById('val-players').textContent = state.playersCount;
  renderNameInputs();
}

function adjHearts(d) {
  state.heartsCount = Math.max(1, state.heartsCount + d); // Min 1 heart
  document.getElementById('val-hearts').textContent = state.heartsCount;
}

// Initialize inputs on load
window.addEventListener('DOMContentLoaded', () => {
  renderNameInputs();
});

function startGame() {
  initAudio();
  state.players = [];
  for(let i=0; i<state.playersCount; i++) {
    let name = document.getElementById(`name-${i}`).value.trim();
    if (!name) {
      name = `اللاعب ${i+1}`; // Not mandatory
    }
    state.players.push({ name: name, hearts: state.heartsCount, index: i });
  }
  
  state.currentRound = 1;
  showTransitionScreen();
}


// --- Round Logic ---
function showTransitionScreen() {
  const conf = ROUND_CONFIGS[state.currentRound - 1];
  document.getElementById('trans-title').innerText = `الجولة ${state.currentRound}`;
  document.getElementById('trans-name').innerText = conf.title;
  document.getElementById('trans-icon').innerText = conf.icon;
  document.getElementById('trans-desc').innerText = conf.desc;
  
  showScreen('transition');
}

function startRoundLogic() {
  initAudio();
  renderPlayersStatus();
  
  const conf = ROUND_CONFIGS[state.currentRound - 1];
  document.getElementById('game-stage-title').innerText = `الجولة ${state.currentRound}: ${conf.title}`;
  
  // Timer Display Styling
  const display = document.getElementById('timer-display');
  display.classList.remove('hidden', 'dark-mode');
  display.innerText = '30';
  document.body.style.background = '#050510'; // reset bg

  if (state.currentRound === 3) {
    document.body.style.background = '#000000'; // Darker for stage 3
    display.classList.add('dark-mode');
    display.innerText = '🔥'; // Bomb fuse icon instead of numbers
  }
  
  // Random Time between 30 and 60 seconds
  state.bombTimer = Math.floor(Math.random() * (60 - 30 + 1)) + 30;
  
  pickRandomPlayer();
  pickRandomQuestion();
  
  showScreen('game');
  
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(tick, 1000);
}

function renderPlayersStatus() {
  const container = document.getElementById('players-status');
  container.innerHTML = '';
  state.players.forEach(p => {
    const badge = document.createElement('div');
    badge.className = 'status-badge ' + (p.hearts === 0 ? 'eliminated' : '');
    badge.innerText = `${p.name} ${'❤️'.repeat(p.hearts)}`;
    container.appendChild(badge);
  });
}

function getAlivePlayers() {
  return state.players.filter(p => p.hearts > 0);
}

function pickRandomPlayer() {
  const alive = getAlivePlayers();
  if (alive.length === 0) return; // shouldn't happen usually
  
  let newIndex = state.currentPlayerIndex;
  
  // Don't pick the same player twice in a row if there are more than 1 alive
  if (alive.length > 1) {
    while (newIndex === state.currentPlayerIndex) {
      newIndex = alive[Math.floor(Math.random() * alive.length)].index;
    }
  } else {
    newIndex = alive[0].index;
  }
  
  state.currentPlayerIndex = newIndex;
  const player = state.players[state.currentPlayerIndex];
  
  document.getElementById('current-player-name').innerText = player.name;
  document.getElementById('current-player-hearts').innerText = '❤️'.repeat(player.hearts);
}

function pickRandomQuestion() {
  if (availableQuestions.length === 0) {
    availableQuestions = [...originalQuestions]; // Refill if empty
  }
  const qIndex = Math.floor(Math.random() * availableQuestions.length);
  const question = availableQuestions[qIndex];
  availableQuestions.splice(qIndex, 1); // Remove so it doesn't repeat
  
  document.getElementById('question-box').innerText = question;
}

function nextTurn() {
  if (state.buttonLocked) return;
  initAudio();
  
  state.buttonLocked = true;
  const btn = document.getElementById('next-btn');
  btn.style.opacity = '0.5';
  btn.style.pointerEvents = 'none';
  
  pickRandomPlayer();
  pickRandomQuestion();
  
  setTimeout(() => {
    state.buttonLocked = false;
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
  }, 500);
}


// --- Timer & Tick ---
function tick() {
  state.bombTimer--;
  
  if (state.bombTimer <= 0) {
    explode();
    return;
  }
  
  const display = document.getElementById('timer-display');
  
  if (state.currentRound === 1) {
    // Stage 1: Visible, steady tick
    display.innerText = state.bombTimer;
    playTickSound();
  } 
  else if (state.currentRound === 2) {
    // Stage 2: Blinking, irregular tick
    // Appears for 1s, hides for 3s (modulo 4)
    if (state.bombTimer % 4 === 0) {
      display.classList.remove('hidden');
      display.innerText = state.bombTimer;
      playTickSound(); // sound only when visible
      setTimeout(() => { display.classList.add('hidden'); }, 1000);
    } else {
      display.classList.add('hidden');
    }
  } 
  else if (state.currentRound === 3) {
    // Stage 3: Hidden, heartbeat
    // No text change, stays 🔥
    if (state.bombTimer % 2 === 0) {
      playHeartbeatSound();
    }
  }
}


// --- Explosion & End ---
function explode() {
  clearInterval(state.timerInterval);
  playExplosionSound();
  
  if (navigator.vibrate) {
    navigator.vibrate([1000, 500, 1000]);
  }
  
  const player = state.players[state.currentPlayerIndex];
  if (player.hearts > 0) player.hearts--;
  
  showScreen('explosion');
  document.body.classList.add('shake-active');
  
  const bg = document.getElementById('explosion-bg');
  bg.style.opacity = '1';
  
  document.getElementById('explosion-msg').innerText = `انفجرت بيدك يا ${player.name}!`;
  if (player.hearts === 0) {
    document.getElementById('explosion-sub').innerText = `لقد خسرت جميع قلوبك 💀`;
  } else {
    document.getElementById('explosion-sub').innerText = `خسرت قلباً! المتبقي: ${player.hearts} ❤️`;
  }
  
  setTimeout(() => {
    document.body.classList.remove('shake-active');
    bg.style.opacity = '0';
  }, 2000);
}

function continueAfterExplosion() {
  initAudio();
  const alivePlayers = getAlivePlayers();
  
  if (alivePlayers.length <= 1) {
    // Only one (or zero) left, game over
    showResults();
  } else {
    // Game continues
    if (state.currentRound < 3) {
      state.currentRound++;
    } else {
      // Loop stage 3 if more than 1 player alive
      state.currentRound = 3;
    }
    showTransitionScreen();
  }
}

function showResults() {
  // Sort players by hearts descending
  let sorted = [...state.players].sort((a, b) => b.hearts - a.hearts);
  
  const container = document.getElementById('podium-container');
  container.innerHTML = '';
  
  // Create top 3 podium if available
  let top3 = sorted.slice(0, 3);
  
  // Arrange them visually: 2nd on left, 1st in center, 3rd on right
  let displayOrder = [];
  if (top3.length === 3) {
    displayOrder = [top3[1], top3[0], top3[2]];
  } else if (top3.length === 2) {
    displayOrder = [top3[1], top3[0]];
  } else {
    displayOrder = [top3[0]];
  }
  
  displayOrder.forEach(p => {
    let rank = sorted.findIndex(x => x.index === p.index) + 1;
    let rankClass = `podium-${rank}`;
    
    let el = document.createElement('div');
    el.className = `podium-item ${rankClass}`;
    
    let heartsHtml = p.hearts > 0 ? '❤️'.repeat(p.hearts) : '💀';
    
    el.innerHTML = `
      <div class="podium-name">${p.name}</div>
      <div class="podium-hearts">${heartsHtml}</div>
      <div class="rank-num">${rank}</div>
    `;
    
    container.appendChild(el);
  });
  
  showScreen('results');
}
