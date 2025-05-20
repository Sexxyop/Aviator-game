const socket = io();

const multiplierDisplay = document.getElementById('multiplier');
const betInput = document.getElementById('betAmount');
const cashOutBtn = document.getElementById('cashOut');
const resultDiv = document.getElementById('result');

let gameActive = false;

socket.on('start', () => {
  resultDiv.innerText = '';
  gameActive = true;
  cashOutBtn.disabled = false;
});

socket.on('multiplier', (data) => {
  multiplierDisplay.innerText = data.multiplier + 'x';
});

socket.on('crash', (data) => {
  multiplierDisplay.innerText = 'CRASHED at ' + data.crashPoint + 'x';
  gameActive = false;
  cashOutBtn.disabled = true;
});

cashOutBtn.addEventListener('click', () => {
  const bet = parseFloat(betInput.value);
  if (!bet || !gameActive) return;
  socket.emit('cashout', { bet });
});

socket.on('cashed_out', (data) => {
  resultDiv.innerText = `You cashed out at ${data.multiplier}x and won $${data.payout.toFixed(2)}!`;
  cashOutBtn.disabled = true;
  gameActive = false;
});

socket.on('crashed', (data) => {
  resultDiv.innerText = `You didn't cash out! Game crashed at ${data.multiplier}x.`;
  cashOutBtn.disabled = true;
  gameActive = false;
});