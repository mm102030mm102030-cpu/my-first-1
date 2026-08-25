const fs = require('fs');

const htmlPath = 'c:\\Users\\user\\Desktop\\my farst game\\games\\wrong-answer.html';
const jsPath = 'c:\\Users\\user\\Desktop\\my farst game\\games\\wrong-answer-js-tmp.js';

let html = fs.readFileSync(htmlPath, 'utf8');
const newJs = fs.readFileSync(jsPath, 'utf8');

// Replace the JS between ALL_QUESTIONS = [ ... ]; and </script>
// We need to keep the questions array intact!
const parts = html.split('];');
if (parts.length >= 2) {
   // parts[0] + '];' is everything up to the end of ALL_QUESTIONS array.
   let before = parts[0] + '];\n';
   
   // parts[1] contains the rest of the JS and </script></body></html>
   let endParts = parts[1].split('</script>');
   let after = '\n  </script>' + endParts[1];
   
   let newHtml = before + '\n' + newJs + after;
   
   // Replace the static judging buttons with a dynamic container
   newHtml = newHtml.replace(
      /<div style="display:flex; gap:10px; margin-top:auto;">[\s\S]*?<\/div>/,
      '<div id="judging-container" style="display:flex; gap:10px; margin-top:auto;"></div>'
   );

   fs.writeFileSync(htmlPath, newHtml, 'utf8');
   console.log('Successfully injected new JS and updated HTML.');
} else {
   console.log('Failed to parse html.');
}
