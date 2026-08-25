(function() {
    // Prevent Context Menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // Prevent Text Selection & Copy
    document.addEventListener('selectstart', function(e) {
        // Allow selection in inputs and textareas
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
    });
    document.addEventListener('copy', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
    });
    document.addEventListener('cut', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
    });

    // Prevent Dragging
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });

    // Prevent DevTools Keyboard Shortcuts
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I / J / C
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S
        if (e.ctrlKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
            e.preventDefault();
            return false;
        }
    });

    // Basic CSS for unselectable and custom modal
    const style = document.createElement('style');
    style.innerHTML = `
        body {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
        }
        input, textarea {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }

        /* Custom Exit Modal Styles */
        .custom-exit-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px);
            z-index: 100000; display: flex; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        }
        .custom-exit-modal-overlay.active {
            opacity: 1; pointer-events: auto;
        }
        .custom-exit-modal-box {
            background: #1e293b; padding: 30px; border-radius: 24px;
            text-align: center; max-width: 90%; width: 360px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.1);
            transform: scale(0.9) translateY(20px); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .custom-exit-modal-overlay.active .custom-exit-modal-box {
            transform: scale(1) translateY(0);
        }
        .custom-exit-icon { font-size: 50px; margin-bottom: 10px; line-height: 1; }
        .custom-exit-title { color: white; font-size: 24px; font-weight: 900; font-family: 'Tajawal', sans-serif; margin-bottom: 10px; }
        .custom-exit-text { color: #94a3b8; font-size: 16px; font-family: 'Tajawal', sans-serif; margin-bottom: 25px; line-height: 1.5; }
        .custom-exit-buttons { display: flex; gap: 12px; justify-content: center; }
        .custom-exit-btn {
            flex: 1; padding: 14px; border-radius: 16px; font-weight: 900;
            font-family: 'Tajawal', sans-serif; font-size: 16px; cursor: pointer;
            border: none; transition: all 0.2s;
        }
        .custom-exit-btn:active { transform: translateY(4px); box-shadow: none !important; }
        .custom-btn-danger { background: #ef4444; color: white; box-shadow: 0 6px 0 #b91c1c; }
        .custom-btn-cancel { background: #475569; color: white; box-shadow: 0 6px 0 #334155; }

        /* Generic Custom Modal Styles */
        .sys-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px);
            z-index: 999999; display: flex; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        }
        .sys-modal-overlay.active {
            opacity: 1; pointer-events: auto;
        }
        .sys-modal-box {
            background: #1e293b; padding: 30px; border-radius: 24px;
            text-align: center; max-width: 90%; width: 360px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.1);
            transform: scale(0.9) translateY(20px); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-family: 'Tajawal', sans-serif;
            color: white;
            direction: rtl;
        }
        .sys-modal-overlay.active .sys-modal-box {
            transform: scale(1) translateY(0);
        }
        .sys-modal-icon { font-size: 50px; margin-bottom: 10px; line-height: 1; }
        .sys-modal-title { font-size: 24px; font-weight: 900; margin-bottom: 10px; color: white; }
        .sys-modal-text { color: #94a3b8; font-size: 16px; margin-bottom: 25px; line-height: 1.5; }
        .sys-modal-input { width: 100%; padding: 12px; border-radius: 12px; background: rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.1); color: white; font-family: 'Tajawal', sans-serif; font-size: 16px; margin-bottom: 20px; text-align: center; }
        .sys-modal-input:focus { outline: none; border-color: #4f46e5; }
        .sys-modal-buttons { display: flex; gap: 12px; justify-content: center; }
        .sys-modal-btn {
            flex: 1; padding: 14px; border-radius: 16px; font-weight: 900;
            font-family: 'Tajawal', sans-serif; font-size: 16px; cursor: pointer;
            border: none; transition: all 0.2s; color: white;
        }
        .sys-modal-btn:active { transform: translateY(4px); box-shadow: none !important; }
        .sys-btn-primary { background: #4f46e5; box-shadow: 0 6px 0 #3730a3; }
        .sys-btn-danger { background: #ef4444; box-shadow: 0 6px 0 #b91c1c; }
        .sys-btn-cancel { background: #475569; box-shadow: 0 6px 0 #334155; }
    `;
    if (document.head) {
        document.head.appendChild(style);
    } else {
        window.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
    }

    // Global Custom Modal Logic
    function createSysModal() {
        let overlay = document.getElementById('sys-modal-root');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'sys-modal-root';
            overlay.className = 'sys-modal-overlay';
            overlay.dir = 'rtl';
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    window.alert = function(msg) {
        // Defer until body exists if called too early
        if (!document.body) {
            window.addEventListener('DOMContentLoaded', () => window.alert(msg));
            return;
        }
        const overlay = createSysModal();
        overlay.innerHTML = `
            <div class="sys-modal-box">
                <div class="sys-modal-icon">⚠️</div>
                <h3 class="sys-modal-title">تنبيه</h3>
                <p class="sys-modal-text">${msg}</p>
                <div class="sys-modal-buttons">
                    <button id="sys-modal-ok" class="sys-modal-btn sys-btn-primary">حسناً</button>
                </div>
            </div>
        `;
        setTimeout(() => overlay.classList.add('active'), 10);
        document.getElementById('sys-modal-ok').onclick = () => overlay.classList.remove('active');
    };

    window.customConfirm = function(msg) {
        return new Promise((resolve) => {
            const overlay = createSysModal();
            overlay.innerHTML = `
                <div class="sys-modal-box">
                    <div class="sys-modal-icon">❓</div>
                    <h3 class="sys-modal-title">تأكيد</h3>
                    <p class="sys-modal-text">${msg}</p>
                    <div class="sys-modal-buttons">
                        <button id="sys-modal-yes" class="sys-modal-btn sys-btn-danger">نعم</button>
                        <button id="sys-modal-no" class="sys-modal-btn sys-btn-cancel">إلغاء</button>
                    </div>
                </div>
            `;
            setTimeout(() => overlay.classList.add('active'), 10);
            document.getElementById('sys-modal-yes').onclick = () => { overlay.classList.remove('active'); resolve(true); };
            document.getElementById('sys-modal-no').onclick = () => { overlay.classList.remove('active'); resolve(false); };
        });
    };

    window.customPrompt = function(msg, defaultVal = '') {
        return new Promise((resolve) => {
            const overlay = createSysModal();
            overlay.innerHTML = `
                <div class="sys-modal-box">
                    <div class="sys-modal-icon">✏️</div>
                    <h3 class="sys-modal-title">إدخال</h3>
                    <p class="sys-modal-text">${msg}</p>
                    <input type="text" id="sys-modal-input" class="sys-modal-input" value="${defaultVal}">
                    <div class="sys-modal-buttons">
                        <button id="sys-modal-yes" class="sys-modal-btn sys-btn-primary">حفظ</button>
                        <button id="sys-modal-no" class="sys-modal-btn sys-btn-cancel">إلغاء</button>
                    </div>
                </div>
            `;
            setTimeout(() => overlay.classList.add('active'), 10);
            const input = document.getElementById('sys-modal-input');
            setTimeout(() => input.focus(), 100);
            document.getElementById('sys-modal-yes').onclick = () => { overlay.classList.remove('active'); resolve(input.value); };
            document.getElementById('sys-modal-no').onclick = () => { overlay.classList.remove('active'); resolve(null); };
            input.onkeydown = (e) => { if (e.key === 'Enter') document.getElementById('sys-modal-yes').click(); };
        });
    };

    // Override the native confirmExit with a custom modal
    window.addEventListener('load', () => {
        window.confirmExit = function() {
            let modal = document.getElementById('custom-exit-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'custom-exit-modal';
                modal.className = 'custom-exit-modal-overlay';
                modal.dir = 'rtl';
                modal.innerHTML = `
                    <div class="custom-exit-modal-box">
                        <div class="custom-exit-icon">🚪</div>
                        <h3 class="custom-exit-title">تأكيد الخروج</h3>
                        <p class="custom-exit-text">هل أنت متأكد من رغبتك بالخروج؟<br>سيتم فقدان التقدم الحالي في اللعبة.</p>
                        <div class="custom-exit-buttons">
                            <button onclick="window.location.href='../lobby.html'" class="custom-exit-btn custom-btn-danger">نعم، خروج</button>
                            <button onclick="document.getElementById('custom-exit-modal').classList.remove('active')" class="custom-exit-btn custom-btn-cancel">إلغاء</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            }
            
            // Small timeout to allow CSS transition to trigger
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        };
    });
})();
