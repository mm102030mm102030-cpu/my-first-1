#!/usr/bin/env python3
# apply_theme.py — Injects the Cosmic Indigo theme override CSS into all game HTML files

import os
import re

GAMES_DIR = os.path.join(os.path.dirname(__file__), 'games')

# This CSS block will be injected just before </head> in every game file
# It overrides the old dark variables with the new Cosmic Indigo palette
THEME_CSS = """
  <!-- ===== COSMIC INDIGO THEME OVERRIDE ===== -->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');
    :root {
      --bg-color:       #05050F !important;
      --surface-color:  #0D0D1F !important;
      --bg-deep:        #05050F;
      --bg-mid:         #09091A;
      --primary-neon:   #6366F1 !important;
      --secondary-neon: #22D3EE !important;
      --danger-neon:    #F43F5E !important;
      --warning-neon:   #F59E0B !important;
      --text-main:      #FFFFFF !important;
      --text-dim:       rgba(255,255,255,0.45) !important;
      --primary:        #6366F1;
      --secondary:      #22D3EE;
      --accent:         #F59E0B;
      --success:        #10B981;
      --danger:         #F43F5E;
    }

    * { font-family: 'Tajawal', sans-serif !important; box-sizing: border-box; }

    body {
      background: #05050F !important;
      background-image:
        radial-gradient(ellipse at 80% -10%, rgba(99,102,241,0.18) 0%, transparent 55%),
        radial-gradient(ellipse at -10% 90%, rgba(34,211,238,0.12) 0%, transparent 55%) !important;
      color: #fff !important;
      min-height: 100vh;
    }

    /* ---- Header / Navbar ---- */
    header, .header, nav, .navbar {
      background: rgba(5,5,15,0.92) !important;
      backdrop-filter: blur(20px) !important;
      border-bottom: 1px solid rgba(99,102,241,0.15) !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.5) !important;
    }

    /* ---- Home / Back buttons ---- */
    .home-btn, .back-btn, [href*="lobby"], [href*="index"] {
      background: rgba(99,102,241,0.12) !important;
      border: 1px solid rgba(99,102,241,0.35) !important;
      color: #C7D2FE !important;
      border-radius: 50px !important;
      transition: all 0.3s ease !important;
    }
    .home-btn:hover, .back-btn:hover {
      background: rgba(99,102,241,0.28) !important;
      border-color: #6366F1 !important;
      color: #fff !important;
      box-shadow: 0 0 20px rgba(99,102,241,0.4) !important;
      transform: translateY(-2px) !important;
    }

    /* ---- Cards / Surfaces ---- */
    .card, .player-card, .question-card, .surface,
    [class*="card"], [class*="panel"], [class*="box"] {
      background: rgba(255,255,255,0.04) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      border-radius: 20px !important;
      backdrop-filter: blur(14px) !important;
    }

    /* ---- Primary buttons ---- */
    button:not(.home-btn):not(.back-btn):not([class*="danger"]):not([class*="wrong"]):not([class*="red"]) {
      font-family: 'Tajawal', sans-serif !important;
    }

    /* ---- Inputs ---- */
    input, textarea, select {
      background: rgba(255,255,255,0.05) !important;
      border: 1px solid rgba(99,102,241,0.25) !important;
      color: #fff !important;
      border-radius: 12px !important;
      font-family: 'Tajawal', sans-serif !important;
    }
    input:focus, textarea:focus {
      border-color: #6366F1 !important;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.2) !important;
      outline: none !important;
    }

    /* ---- Progress / Timer bars ---- */
    .timer-bar, .progress-bar, [class*="timer"], [class*="progress"] {
      background: rgba(255,255,255,0.06) !important;
      border-radius: 999px !important;
      overflow: hidden !important;
    }
    .timer-fill, .progress-fill, [class*="fill"] {
      background: linear-gradient(90deg, #6366F1, #22D3EE) !important;
      border-radius: 999px !important;
    }

    /* ---- Scrollbar ---- */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #6366F1; border-radius: 4px; }

    /* ---- Background orbs (ambient light) ---- */
    body::before {
      content: '';
      position: fixed; inset: 0; z-index: -1; pointer-events: none;
      background:
        radial-gradient(ellipse 700px 500px at 85% -5%, rgba(99,102,241,0.15) 0%, transparent 60%),
        radial-gradient(ellipse 600px 500px at -5% 95%, rgba(34,211,238,0.1) 0%, transparent 60%);
    }
  </style>
  <!-- ===== END THEME OVERRIDE ===== -->
"""

MARKER = '<!-- ===== COSMIC INDIGO THEME OVERRIDE ===== -->'

def apply_theme(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already applied
    if MARKER in content:
        print(f'  ✓ Already themed: {os.path.basename(filepath)}')
        return

    # Inject before </head>
    if '</head>' in content:
        content = content.replace('</head>', THEME_CSS + '\n</head>', 1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  ✅ Themed: {os.path.basename(filepath)}')
    else:
        print(f'  ⚠️  No </head> found: {os.path.basename(filepath)}')

def main():
    print('\n🎨 Applying Cosmic Indigo theme to all games...\n')
    html_files = [f for f in os.listdir(GAMES_DIR) if f.endswith('.html')]
    html_files.sort()
    for fname in html_files:
        apply_theme(os.path.join(GAMES_DIR, fname))
    print('\n✅ Theme applied! Starting server...\n')

if __name__ == '__main__':
    main()
