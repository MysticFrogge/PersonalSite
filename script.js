function updateClock() {
  const clockElement = document.getElementById('clock');
  if (!clockElement) return;

  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  clockElement.textContent = now.toLocaleTimeString([], options);
}

updateClock();
setInterval(updateClock, 1000);
