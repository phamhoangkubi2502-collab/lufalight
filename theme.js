/* ── LUFALIGHT DARK MODE TOGGLE ──
   The actual dark/light values live in each page's <style> block as a
   `:root[data-theme="dark"]{...}` override of the same CSS variables used everywhere
   (--bg, --bg2, --card, --line, --muted, --white, --gold). This file only handles the
   toggle button + remembering the user's choice. A tiny inline script in <head> applies
   the saved theme before paint, so there's no flash of the wrong theme on load. */
(function () {
  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function updateButton() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var dark = isDark();
    btn.textContent = dark ? '☀️' : '🌙';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function toggleTheme() {
    if (isDark()) {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('lufa-theme', 'light'); } catch (e) {}
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('lufa-theme', 'dark'); } catch (e) {}
    }
    updateButton();
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateButton();
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggleTheme);
  });
})();
