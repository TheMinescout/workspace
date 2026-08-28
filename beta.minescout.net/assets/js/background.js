(() => {
  if (document.querySelector('.ms-bg')) return;
  const bg = document.createElement('div');
  bg.className = 'ms-bg';
  bg.setAttribute('aria-hidden','true');
  const glyphs = 'MINESCOUT·ATLS·PRDS·BETA·0123456789/[]{}<>+-=_';
  const rows = Math.max(8, Math.min(22, Math.ceil(innerHeight / 62)));
  for (let r = 0; r < rows; r++) {
    const row = document.createElement('div');
    row.className = 'ms-bg-row';
    row.style.setProperty('--row', r);
    row.style.setProperty('--speed', `${22 + (r % 5) * 7}s`);
    row.style.setProperty('--delay', `${-(r * 1.7)}s`);
    row.textContent = Array.from({length: 42}, (_, i) => glyphs[(i * 7 + r * 11) % glyphs.length]).join(' ');
    bg.appendChild(row);
  }
  document.body.prepend(bg);
})();
