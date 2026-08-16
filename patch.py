import os
import re

games_dir = r'c:\Users\user\Desktop\my farst game\games'

modal_html = """
  <!-- NOTES MODAL -->
  <div class="modal" id="notes-modal" style="z-index: 9999; display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); align-items: center; justify-content: center; padding: 20px;">
    <div class="modal-content" style="background:#1e293b; max-width:350px; width: 100%; border-radius: 24px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
      <h2 style="text-align:center; margin-bottom:15px; color:white; font-size: 24px; font-weight: 900;">📝 دفتر النقاط</h2>
      <textarea id="notes-text" style="width:100%; height:200px; border-radius:12px; padding:12px; background:rgba(0,0,0,0.3); color:white; border:1px solid rgba(255,255,255,0.2); font-family:'Tajawal',sans-serif; resize:none; font-size: 16px; outline: none; box-sizing: border-box;" placeholder="سجل نقاط اللاعبين هنا..."></textarea>
      <div style="display:flex; gap:10px; margin-top:15px;">
        <button style="flex:1; padding:12px; font-size:16px; border-radius: 12px; border:none; font-weight: bold; background: #10b981; color: white; cursor: pointer;" onclick="saveNotes()">حفظ وإغلاق</button>
        <button style="flex:1; padding:12px; font-size:16px; border-radius: 12px; border:none; font-weight: bold; background: #ef4444; color: white; cursor: pointer;" onclick="clearNotes()">مسح</button>
      </div>
    </div>
  </div>
  <script>
    function openNotes() {
      const modal = document.getElementById('notes-modal');
      const text = document.getElementById('notes-text');
      text.value = localStorage.getItem('game_notes') || '';
      modal.style.display = 'flex';
    }
    function saveNotes() {
      const text = document.getElementById('notes-text').value;
      localStorage.setItem('game_notes', text);
      document.getElementById('notes-modal').style.display = 'none';
    }
    function clearNotes() {
      if(confirm('هل أنت متأكد من مسح النوت؟')) {
        document.getElementById('notes-text').value = '';
        localStorage.removeItem('game_notes');
      }
    }
  </script>
</body>
"""

note_btn = """<button onclick="openNotes()" class="top-btn" style="background:rgba(245,158,11,0.2); border:1px solid rgba(245,158,11,0.5); color:#fcd34d; margin: 0 10px;">📝 نوت</button>"""

for f in os.listdir(games_dir):
    if not f.endswith('.html'):
        continue
    
    filepath = os.path.join(games_dir, f)
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 1. Replace Play Again
    content = re.sub(r'onclick="location\.reload\(\)"(.*?)>العب من جديد.*?<', r'onclick="window.location.href=\'../lobby.html\'"\1>الرئيسية 🏠<', content)
    content = re.sub(r'onclick="location\.reload\(\)"(.*?)>العب جيم ثاني.*?<', r'onclick="window.location.href=\'../lobby.html\'"\1>الرئيسية 🏠<', content)
    content = re.sub(r'onclick="location\.reload\(\)"(.*?)>العب.*?<', r'onclick="window.location.href=\'../lobby.html\'"\1>الرئيسية 🏠<', content)
    
    # 2. Add Note button to top-bar
    if 'openNotes()' not in content:
        # insert note_btn after the first top-btn
        content = re.sub(r'(<button onclick="confirmExit\(\)" class="top-btn">.*?</button>)', r'\1\n    ' + note_btn, content)
        
    # 3. Add Notes Modal and Script before </body>
    if 'notes-modal' not in content:
        content = content.replace('</body>', modal_html)
        
    # 4. Fix z-index of top-bar
    content = re.sub(r'\.top-bar \{ (.*?)z-index: 100;', r'.top-bar { \1z-index: 9999;', content)
    
    # For charades specifically, there's a missing home button? 
    # Actually charades already has it: `<button onclick="confirmExit()" class="top-btn">🏠 الرئيسية</button>` 
    # But it might be obscured by top-nav. We'll increase z-index anyway.
    
    with open(filepath, 'w', encoding='utf-8') as file:
        file.write(content)
        
print('Done!')
