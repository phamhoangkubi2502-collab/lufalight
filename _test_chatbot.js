const fs = require('fs');
const genSrc = fs.readFileSync('gen-chatbot.js', 'utf8');

// Get the constants section
const constCode = genSrc.substring(0, genSrc.indexOf('\nconst FILES'));

// Eval with a wrapper to capture the values
const wrapper = `
${constCode}
module.exports = { NEW_CSS, NEW_WIDGET, CSS_ANCHOR, HTML_START, SCRIPT_END };
`;
fs.writeFileSync('_consts.js', wrapper);
const { NEW_CSS, NEW_WIDGET, CSS_ANCHOR, HTML_START, SCRIPT_END } = require('./_consts.js');
fs.unlinkSync('_consts.js');

console.log('NEW_CSS length:', NEW_CSS.length);
console.log('NEW_WIDGET length:', NEW_WIDGET.length);

// Test the chatbot script from NEW_WIDGET
const scriptMatch = NEW_WIDGET.match(/<script>([\s\S]*?)<\/script>/);
const js = scriptMatch[1];
try { new Function(js); console.log('Standalone chatbot script: OK'); }
catch(e) { console.log('Standalone chatbot script FAIL:', e.message); }

// Test on index.html
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('.chat-msgs{flex:1')) {
  const cssIdx = html.indexOf(CSS_ANCHOR);
  html = html.slice(0, cssIdx + CSS_ANCHOR.length) + NEW_CSS + html.slice(cssIdx + CSS_ANCHOR.length);
}

const htmlStart = html.indexOf(HTML_START);
let searchFrom = htmlStart, endIdx = -1;
while (true) {
  const candidate = html.indexOf(SCRIPT_END, searchFrom);
  if (candidate === -1) break;
  const sliceBack = html.slice(Math.max(0, candidate - 600), candidate);
  if (sliceBack.includes("getElementById('chat-panel')")) { endIdx = candidate + SCRIPT_END.length; break; }
  searchFrom = candidate + 1;
}
html = html.slice(0, htmlStart) + NEW_WIDGET + html.slice(endIdx);

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
console.log('index.html after modification, scripts:', scripts.length);
scripts.forEach((m,i) => {
  try { new Function(m[1]); console.log('script', i, 'OK'); }
  catch(e) {
    console.log('script', i, 'FAIL:', e.message);
    const lines = m[1].split('\n');
    lines.slice(0, 4).forEach((l,n) => console.log('  line', n, JSON.stringify(l.substring(0,80))));
  }
});
