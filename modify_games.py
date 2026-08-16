import os
import glob
import re

games_dir = r"c:\Users\user\Desktop\my farst game\games"
files = glob.glob(os.path.join(games_dir, "*.html"))

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    original_content = content
    
    # 1. Remove Notes button
    content = re.sub(r'<button\s+onclick="openNotes\(\)"[^>]*>.*?📝 نوت.*?<\/button>', '', content, flags=re.DOTALL)
    
    # 2. Remove Notes Modal and script
    content = re.sub(r'<!-- NOTES MODAL -->.*?<\/script>\s*(<\/body>\s*<\/html>)', r'\1', content, flags=re.DOTALL)
    
    # 3. Remove max attribute from players-count input
    content = re.sub(r'(id="players-count"[^>]*)max="\d+"', r'\1', content)
    
    # 4. Remove Math.min(...) from renderPlayerInputs
    content = re.sub(r'Math\.min\(\d+\s*,\s*(parseInt\([^)]+\))\)', r'\1', content)
    content = re.sub(r'Math\.min\(\d+\s*,\s*(Number\([^)]+\))\)', r'\1', content)
    
    # Also fix labels if they say (2 - 8) or (4 - 12) to (2+)
    content = re.sub(r'\((\d+)\s*-\s*\d+\)', r'(\1+)', content)
    
    if content != original_content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Modified: {os.path.basename(file_path)}")
    else:
        print(f"No changes: {os.path.basename(file_path)}")
