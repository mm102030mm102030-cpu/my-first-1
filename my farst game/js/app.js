/* ===== APP CORE UTILITIES ===== */

// ===== TOAST NOTIFICATIONS =====
let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}

function showToast(message, type = 'info', duration = 3000) {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===== FRIENDS SYSTEM =====
function getFriends() {
  const user = getUser();
  return user ? (user.friends || []) : [];
}

function addFriend(username) {
  const user = getUser();
  if (!user) return false;

  // username format: Name#Tag
  if (!username.includes('#')) {
    showToast('❗ الصيغة الصحيحة: اسم#1234', 'error');
    return false;
  }

  if (username === user.displayName) {
    showToast('😄 لا يمكنك إضافة نفسك!', 'error');
    return false;
  }

  if (user.friends.find(f => f.displayName === username)) {
    showToast('👥 هذا الشخص موجود بالفعل في قائمة أصدقائك', 'error');
    return false;
  }

  // Simulate adding (in real app, would look up server)
  const friendName = username.split('#')[0];
  const friendTag = username.split('#')[1];
  const colors = ['#7c3aed', '#2563eb', '#d946ef', '#10b981', '#f59e0b'];

  const friend = {
    id: 'friend_' + Date.now(),
    name: friendName,
    tag: friendTag,
    displayName: username,
    avatar: friendName.charAt(0),
    avatarColor: colors[Math.floor(Math.random() * colors.length)],
    status: Math.random() > 0.5 ? 'online' : 'offline',
    addedAt: new Date().toISOString()
  };

  user.friends.push(friend);
  saveUser(user);
  showToast(`✅ تمت إضافة ${friendName} إلى أصدقائك!`, 'success');
  return true;
}

function removeFriend(friendId) {
  const user = getUser();
  if (!user) return;
  user.friends = user.friends.filter(f => f.id !== friendId);
  saveUser(user);
  showToast('🗑️ تم إزالة الصديق', 'info');
}

// ===== NAVBAR SETUP =====
function setupNavbar() {
  const user = getUser();
  if (!user) return;

  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Set user info
  const avatarEl = navbar.querySelector('.user-avatar');
  const tagEl = navbar.querySelector('.user-tag');

  if (avatarEl) {
    avatarEl.textContent = user.avatar;
    avatarEl.style.background = `linear-gradient(135deg, ${user.avatarColor}, #1a1040)`;
  }
  if (tagEl) {
    tagEl.textContent = user.displayName;
  }
}

// ===== REQUIRE AUTH =====
function requireAuth() {
  const user = getUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

// ===== COPY TO CLIPBOARD =====
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 تم النسخ!', 'success', 1500);
  }).catch(() => {
    showToast('❗ فشل النسخ', 'error');
  });
}

// ===== GAME STATE =====
function saveGameState(gameId, state) {
  localStorage.setItem(`rafiq_game_${gameId}`, JSON.stringify(state));
}

function loadGameState(gameId) {
  const raw = localStorage.getItem(`rafiq_game_${gameId}`);
  return raw ? JSON.parse(raw) : null;
}

// ===== FORMAT DATE =====
function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `منذ ${Math.floor(diff/60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff/3600)} ساعة`;
  return `منذ ${Math.floor(diff/86400)} يوم`;
}

// ===== RANDOM UTILS =====
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
