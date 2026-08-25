const fs = require('fs');
const path = require('path');
const gamesDir = path.join('c:\\Users\\user\\Desktop\\my farst game', 'games');
const files = fs.readdirSync(gamesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(gamesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Specific replacements
  content = content.replace("Math.max(3, Math.min(20, state.players + d))", "Math.max(3, state.players + d)");
  
  // mafia.html, etc.
  content = content.replace(/Math\.max\((\d+),\s*Math\.min\(\d+,\s*([^)]+)\)\)/g, "Math.max($1, $2)");
  
  // challenge-30, wrong-answer, etc.
  content = content.replace("Math.max(2, Math.min(8, parseInt(document.getElementById('players-count').value)))", "Math.max(2, parseInt(document.getElementById('players-count').value))");
  content = content.replace("Math.max(2, Math.min(8, parseInt(document.getElementById('players-count').value) || 2))", "Math.max(2, parseInt(document.getElementById('players-count').value) || 2)");
  content = content.replace("Math.max(2, Math.min(10, state.playersCount + d))", "Math.max(2, state.playersCount + d)");
  content = content.replace("Math.max(3, Math.min(10, count))", "Math.max(3, count)");
  
  fs.writeFileSync(filePath, content, 'utf8');
});
