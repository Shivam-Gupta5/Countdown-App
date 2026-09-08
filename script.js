// ---- Elements ----
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const statusLabel = document.getElementById('statusLabel');

const presetButtons = document.querySelectorAll('.preset-btn');
const customHours = document.getElementById('customHours');
const customMinutes = document.getElementById('customMinutes');
const customSeconds = document.getElementById('customSeconds');
const setCustomBtn = document.getElementById('setCustom');

const startPauseBtn = document.getElementById('startPause');
const resetBtn = document.getElementById('reset');

const opacitySlider = document.getElementById('opacitySlider');
const opacityValue = document.getElementById('opacityValue');

const panel = document.querySelector('.panel');
const panelToggle = document.getElementById('panelToggle');

// ---- State ----
let totalSeconds = 10 * 3600; // default 10 hours
let remainingSeconds = totalSeconds;
let intervalId = null;
let isRunning = false;

// ---- Render ----
function render() {
  const h = Math.floor(remainingSeconds / 3600);
  const m = Math.floor((remainingSeconds % 3600) / 60);
  const s = Math.floor(remainingSeconds % 60);

  hoursEl.textContent = String(h).padStart(2, '0');
  minutesEl.textContent = String(m).padStart(2, '0');
  secondsEl.textContent = String(s).padStart(2, '0');
}

function setStatus(text, cls) {
  statusLabel.textContent = text;
  statusLabel.className = 'label' + (cls ? ' ' + cls : '');
}

// ---- Timer control ----
function tick() {
  if (remainingSeconds <= 0) {
    stopTimer();
    setStatus('time\u2019s up', 'done');
    return;
  }
  remainingSeconds -= 1;
  render();
}

function startTimer() {
  if (remainingSeconds <= 0) return;
  isRunning = true;
  intervalId = setInterval(tick, 1000);
  startPauseBtn.textContent = 'Pause';
  startPauseBtn.classList.add('running');
  setStatus('running', 'running');
}

function pauseTimer() {
  isRunning = false;
  clearInterval(intervalId);
  startPauseBtn.textContent = 'Start';
  startPauseBtn.classList.remove('running');
  setStatus('paused');
}

function stopTimer() {
  isRunning = false;
  clearInterval(intervalId);
  startPauseBtn.textContent = 'Start';
  startPauseBtn.classList.remove('running');
}

function resetTimer() {
  pauseTimer();
  remainingSeconds = totalSeconds;
  render();
  setStatus('ready');
}

// ---- Preset handling ----
function applyPreset(hoursValue) {
  totalSeconds = Math.round(hoursValue * 3600);
  remainingSeconds = totalSeconds;
  pauseTimer();
  render();
  setStatus('ready');

  presetButtons.forEach(btn => btn.classList.remove('active'));
  const match = [...presetButtons].find(
    btn => parseFloat(btn.dataset.hours) === hoursValue
  );
  if (match) match.classList.add('active');
}

presetButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    applyPreset(parseFloat(btn.dataset.hours));
  });
});

// ---- Custom time ----
setCustomBtn.addEventListener('click', () => {
  const h = Math.max(0, parseInt(customHours.value) || 0);
  const m = Math.max(0, Math.min(59, parseInt(customMinutes.value) || 0));
  const s = Math.max(0, Math.min(59, parseInt(customSeconds.value) || 0));

  totalSeconds = h * 3600 + m * 60 + s;
  if (totalSeconds <= 0) return;

  remainingSeconds = totalSeconds;
  pauseTimer();
  render();
  setStatus('ready');
  presetButtons.forEach(btn => btn.classList.remove('active'));
});

// ---- Start / Pause / Reset ----
startPauseBtn.addEventListener('click', () => {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener('click', resetTimer);

// ---- Opacity control ----
opacitySlider.addEventListener('input', () => {
  const val = opacitySlider.value;
  document.documentElement.style.setProperty('--text-opacity', val / 100);
  opacityValue.textContent = val + '%';
});

// ---- Panel show/hide ----
panelToggle.addEventListener('click', () => {
  panel.classList.toggle('hidden');
});

// ---- Keyboard shortcuts ----
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    isRunning ? pauseTimer() : startTimer();
  } else if (e.key.toLowerCase() === 'r') {
    resetTimer();
  }
});

// ---- Init ----
render();
