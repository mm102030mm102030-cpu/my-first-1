const fs = require('fs');
const path = require('path');
const gamesDir = path.join('c:\\Users\\user\\Desktop\\my farst game', 'games');
const files = fs.readdirSync(gamesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(gamesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add padding-bottom to .game-container
  if (content.includes('.game-container {')) {
    // If it already has padding, let's just append padding-bottom: 100px !important; before the closing brace
    content = content.replace(/\.game-container\s*{([^}]+)}/g, (match, p1) => {
      // replace padding-bottom if exists, or append it
      if (p1.includes('padding-bottom:')) {
        return match; // don't mess if it has it, wait, let's just append
      }
      return `.game-container {${p1} padding-bottom: 100px !important; }`;
    });
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
});
