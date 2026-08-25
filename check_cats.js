const fs = require('fs');
const text = fs.readFileSync('c:/Users/user/Desktop/my farst game/scratch_input.txt', 'utf8');

const matches = text.match(/"category"\s*:\s*".*?"/g);
if (matches) {
    console.log('Categories found:', matches.length);
    matches.forEach(m => console.log(m));
} else {
    console.log('No categories found.');
}
