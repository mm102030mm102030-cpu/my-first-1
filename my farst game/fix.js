const fs = require('fs');
const text = fs.readFileSync('c:/Users/user/Desktop/my farst game/scratch_input.txt', 'utf8');

const match = text.match(/\[\s*\{\s*"category":/);
if (match) {
    let jsonStr = text.substring(match.index);
    let count = 0;
    let endIdx = -1;
    for (let i = 0; i < jsonStr.length; i++) {
        if (jsonStr[i] === '[') count++;
        else if (jsonStr[i] === ']') {
            count--;
            if (count === 0) {
                endIdx = i;
                break;
            }
        }
    }
    
    if (endIdx !== -1) {
        jsonStr = jsonStr.substring(0, endIdx + 1);
        try {
            JSON.parse(jsonStr);
            fs.writeFileSync('c:/Users/user/Desktop/my farst game/games/truth-data.js', 'const TRUTH_DB = ' + jsonStr + ';\n');
            console.log('Successfully fixed JSON');
        } catch(e) {
            console.error('Parse error:', e.message);
            // It might be a trailing comma
        }
    } else {
        console.log('Could not find matching bracket');
    }
} else {
    console.log('Could not find start of JSON');
}
