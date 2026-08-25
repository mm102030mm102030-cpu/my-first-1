/* ===== AUTH SYSTEM ===== */

const ARABIC_NAMES = [
  'أسد', 'نمر', 'صقر', 'ذئب', 'نسر', 'ثعلب', 'دب', 'قط', 'وحش', 'تنين',
  'فارس', 'بطل', 'ملك', 'أمير', 'صياد', 'محارب', 'شجاع', 'قوي', 'ماهر', 'سريع'
];

function generateTag() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function generateRandomUsername() {
  const name = ARABIC_NAMES[Math.floor(Math.random() * ARABIC_NAMES.length)];
  const tag = generateTag();
  const input = document.getElementById('username-input');
  const tagEl = document.getElementById('user-tag');
  if (input) input.value = name;
  if (tagEl) tagEl.textContent = tag;
  return { name, tag };
}

function getUser() {
  const raw = localStorage.getItem('rafiq_user');
  return raw ? JSON.parse(raw) : null;
}

function saveUser(user) {
  localStorage.setItem('rafiq_user', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('rafiq_user');
  window.location.href = 'index.html';
}

function loginWithGoogle() {
  // For now, simulate Google login (real OAuth needs a backend)
  showToast('🔄 يتم الاتصال بـ Google...', 'info');
  setTimeout(() => {
    openUsernameModal('google');
  }, 800);
}

function loginWithFacebook() {
  // For now, simulate Facebook login
  showToast('🔄 يتم الاتصال بـ Facebook...', 'info');
  setTimeout(() => {
    openUsernameModal('facebook');
  }, 800);
}

function loginAsGuest() {
  openUsernameModal('guest');
}

function openUsernameModal(provider) {
  const modal = document.getElementById('username-modal');
  if (modal) {
    modal.classList.remove('hidden');
    const { tag } = generateRandomUsername();
    // Store provider
    modal.dataset.provider = provider;
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

function confirmUsername() {
  const input = document.getElementById('username-input');
  const tagEl = document.getElementById('user-tag');
  const modal = document.getElementById('username-modal');

  const name = input ? input.value.trim() : '';
  const tag = tagEl ? tagEl.textContent : generateTag();

  if (!name) {
    showToast('❗ أدخل اسم المستخدم أولاً', 'error');
    return;
  }

  if (name.length < 2) {
    showToast('❗ الاسم قصير جداً', 'error');
    return;
  }

  const provider = modal ? modal.dataset.provider : 'guest';

  const avatarColors = ['#7c3aed', '#2563eb', '#d946ef', '#10b981', '#f59e0b', '#ef4444'];
  const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const user = {
    id: 'user_' + Date.now(),
    name: name,
    tag: tag,
    displayName: name + '#' + tag,
    provider: provider,
    avatar: name.charAt(0),
    avatarColor: avatarColor,
    friends: [],
    joinedAt: new Date().toISOString(),
    gamesPlayed: 0,
    wins: 0
  };

  saveUser(user);
  closeModal('username-modal');
  showToast(`🎉 أهلاً ${name}! جاهز تلعب؟`, 'success');

  setTimeout(() => {
    window.location.href = 'lobby.html';
  }, 1000);
}

// Update tag preview when typing
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('username-input');
  const tagEl = document.getElementById('user-tag');

  if (input) {
    // Generate initial random tag
    if (tagEl) tagEl.textContent = generateTag();

    input.addEventListener('input', () => {
      // Tag stays the same while typing
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') confirmUsername();
    });
  }
});
