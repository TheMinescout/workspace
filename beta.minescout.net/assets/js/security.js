/* Minescout Beta client hardening. This is defense-in-depth, not a substitute for server rules. */
(() => {
  'use strict';
  const KEY = 'ms_form_rate';
  const WINDOW = 30 * 1000;
  const MAX = 3;
  const now = Date.now();
  let attempts = [];
  try { attempts = JSON.parse(sessionStorage.getItem(KEY) || '[]').filter(t => now - t < WINDOW); } catch {}
  window.MS_SECURITY = {
    canSubmit() {
      const t = Date.now();
      attempts = attempts.filter(x => t - x < WINDOW);
      if (attempts.length >= MAX) return false;
      attempts.push(t);
      try { sessionStorage.setItem(KEY, JSON.stringify(attempts)); } catch {}
      return true;
    },
    cleanText(value, max = 4000) {
      return String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
    }
  };

  document.querySelectorAll('input, textarea').forEach(el => {
    if (!el.getAttribute('maxlength')) {
      el.setAttribute('maxlength', el.tagName === 'TEXTAREA' ? '5000' : '300');
    }
    el.setAttribute('spellcheck', el.type === 'password' ? 'false' : 'true');
  });
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    const rel = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener'); rel.add('noreferrer'); a.setAttribute('rel', [...rel].join(' '));
  });
})();
