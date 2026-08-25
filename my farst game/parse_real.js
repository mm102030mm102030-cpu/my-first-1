const fs = require('fs');

const text = fs.readFileSync('c:/Users/user/Desktop/my farst game/scratch_input.txt', 'utf8');

let categories = [];
const catRegex = /\{\s*"category"\s*:\s*"[^"]+"[\s\S]*?(?=\s*\{\s*"category"\s*:|$)/g;
let matches = text.match(catRegex);

if (matches) {
    for(let m of matches) {
        let cleanStr = m.trim();
        // Remove trailing text that isn't part of the JSON array.
        // We expect it to end with ]} or similar. We can find the last ']' and '}'
        let lastBracket = cleanStr.lastIndexOf('}');
        if (lastBracket !== -1) {
             cleanStr = cleanStr.substring(0, lastBracket + 1);
        }
        
        // Remove trailing commas before } or ]
        cleanStr = cleanStr.replace(/,\s*\}/g, '}').replace(/,\s*\]/g, ']');
        
        // Fix bad control characters by escaping them
        cleanStr = cleanStr.replace(/[\u0000-\u0019]+/g,"");
        
        try {
            // using eval to parse as JS object
            let obj = eval('(' + cleanStr + ')');
            if(obj && obj.category && obj.questions) {
                categories.push(obj);
            }
        } catch(err) {
            console.log("Eval failed for a category block:", err.message);
            // Try to find the inner array of questions
            let startQs = cleanStr.indexOf('"questions"');
            if (startQs !== -1) {
                 let startArr = cleanStr.indexOf('[', startQs);
                 if (startArr !== -1) {
                      let arrStr = cleanStr.substring(startArr);
                      let lastClose = arrStr.lastIndexOf(']');
                      if (lastClose !== -1) {
                           arrStr = arrStr.substring(0, lastClose + 1);
                           try {
                               let qs = eval('(' + arrStr + ')');
                               let catMatch = cleanStr.match(/"category"\s*:\s*"([^"]+)"/);
                               if (catMatch && Array.isArray(qs)) {
                                    categories.push({ category: catMatch[1], questions: qs });
                               }
                           } catch(e2) {
                               console.log("Double fail", e2.message);
                           }
                      }
                 }
            }
        }
    }
    
    if (categories.length > 0) {
        console.log("Successfully extracted categories:", categories.length);
        fs.writeFileSync('c:/Users/user/Desktop/my farst game/games/truth-data.js', 'const TRUTH_DB = ' + JSON.stringify(categories, null, 2) + ';\n');
    } else {
        console.log("No valid category objects extracted.");
    }
}
