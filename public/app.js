const STORAGE_KEY = 'neonBunkerUser';

const text = {
  de: {
    loginTitle: 'Login',
    loginUser: 'User',
    loginId: 'ID',
    loginBtn: 'Einloggen',
    registerTitle: 'Register',
    registerUser: 'User',
    registerId1: 'ID eingeben',
    registerId2: 'ID wiederholen',
    registerId3: 'ID bestätigen',
    registerBtn: 'Registrieren',
    registerNote: 'ID darf Zahlen, Buchstaben, Zeichen und Leerzeichen enthalten.',
    genderTitle: 'Wähle deinen Charakter',
    male: 'Male',
    female: 'Female',
    equipped: 'Ausgerüstet',
    slotWeapon: 'Waffe',
    slotShield: 'Schild',
    slotPet: 'Haustier',
    solo: 'Solo',
    online: 'Online',
    inventory: 'Inventar',
    yourItems: 'Deine Items',
    statusLoginOk: 'Willkommen zurück!',
    statusLoginFail: 'Login fehlgeschlagen: User oder ID stimmen nicht.',
    statusRegisterOk: 'Registrierung erfolgreich. Jetzt einloggen.',
    statusRegisterFail: 'Registrierung fehlgeschlagen: Prüfe User und IDs.',
    statusRegisterExists: 'User existiert bereits.'
  },
  en: {
    loginTitle: 'Login',
    loginUser: 'User',
    loginId: 'ID',
    loginBtn: 'Sign in',
    registerTitle: 'Register',
    registerUser: 'User',
    registerId1: 'Enter ID',
    registerId2: 'Repeat ID',
    registerId3: 'Confirm ID',
    registerBtn: 'Create account',
    registerNote: 'ID may contain numbers, letters, symbols and spaces.',
    genderTitle: 'Choose your character',
    male: 'Male',
    female: 'Female',
    equipped: 'Equipped',
    slotWeapon: 'Weapon',
    slotShield: 'Shield',
    slotPet: 'Pet',
    solo: 'Solo',
    online: 'Online',
    inventory: 'Inventory',
    yourItems: 'Your items',
    statusLoginOk: 'Welcome back!',
    statusLoginFail: 'Login failed: user or ID is incorrect.',
    statusRegisterOk: 'Registration complete. Please sign in.',
    statusRegisterFail: 'Registration failed: check user and IDs.',
    statusRegisterExists: 'User already exists.'
  }
};

const defaultProfile = {
  user: '',
  id: '',
  gender: '',
  inventory: ['Grey Sword', 'Shield', 'Pet'],
  equipped: {
    weapon: 'Grey Sword',
    shield: '—',
    pet: '—'
  }
};

let state = {
  lang: 'de',
  session: null,
  panel: 'home'
};

const authView = document.getElementById('authView');
const genderView = document.getElementById('genderView');
const gameView = document.getElementById('gameView');
const langToggle = document.getElementById('langToggle');

function getDB() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
}

function setDB(value) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function t(key) {
  return text[state.lang][key];
}

function switchView(viewName) {
  [authView, genderView, gameView].forEach((v) => v.classList.remove('active'));
  if (viewName === 'auth') authView.classList.add('active');
  if (viewName === 'gender') genderView.classList.add('active');
  if (viewName === 'game') gameView.classList.add('active');
}

function renderAuth(status = '', statusClass = '') {
  authView.innerHTML = `
    <div class="auth-grid">
      <div class="panel">
        <h2>${t('loginTitle')}</h2>
        <form id="loginForm">
          <div class="input-group">
            <label>${t('loginUser')}</label>
            <input name="user" required />
          </div>
          <div class="input-group">
            <label>${t('loginId')}</label>
            <input name="id" required />
          </div>
          <button class="btn" type="submit">${t('loginBtn')}</button>
        </form>
      </div>

      <div class="panel">
        <h2>${t('registerTitle')}</h2>
        <form id="registerForm">
          <div class="input-group">
            <label>${t('registerUser')}</label>
            <input name="user" required />
          </div>
          <div class="input-group">
            <label>${t('registerId1')}</label>
            <input name="id1" required />
          </div>
          <div class="input-group">
            <label>${t('registerId2')}</label>
            <input name="id2" required />
          </div>
          <div class="input-group">
            <label>${t('registerId3')}</label>
            <input name="id3" required />
          </div>
          <button class="btn" type="submit">${t('registerBtn')}</button>
        </form>
        <p class="note">${t('registerNote')}</p>
      </div>
    </div>
    <p class="status ${statusClass}">${status}</p>
  `;

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const user = String(form.get('user') || '');
    const id = String(form.get('id') || '');
    const db = getDB();
    if (db[user] && db[user].id === id) {
      state.session = db[user];
      if (!state.session.gender) {
        renderGender();
        switchView('gender');
      } else {
        renderGame();
        switchView('game');
      }
      return;
    }
    renderAuth(t('statusLoginFail'), 'warn');
  });

  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const user = String(form.get('user') || '').trim();
    const id1 = String(form.get('id1') || '');
    const id2 = String(form.get('id2') || '');
    const id3 = String(form.get('id3') || '');
    const db = getDB();

    if (!user || id1 !== id2 || id1 !== id3) {
      renderAuth(t('statusRegisterFail'), 'warn');
      return;
    }

    if (db[user]) {
      renderAuth(t('statusRegisterExists'), 'warn');
      return;
    }

    db[user] = {
      ...defaultProfile,
      user,
      id: id1
    };
    setDB(db);
    renderAuth(t('statusRegisterOk'), 'ok');
  });
}

function renderGender() {
  genderView.innerHTML = `
    <div class="panel">
      <h2>${t('genderTitle')}</h2>
      <div class="gender-grid">
        <button class="gender-btn" type="button" data-gender="male">${t('male')}</button>
        <button class="gender-btn" type="button" data-gender="female">${t('female')}</button>
      </div>
    </div>
  `;

  genderView.querySelectorAll('.gender-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.session.gender = button.dataset.gender;
      const db = getDB();
      db[state.session.user] = state.session;
      setDB(db);
      renderGame();
      switchView('game');
    });
  });
}

function avatarPixels(gender) {
  const hair = gender === 'female' ? '#ff85f1' : '#6fb1ff';
  const outfit = gender === 'female' ? '#f557ff' : '#3e88ff';
  return [
    [60, 0, hair],
    [80, 0, hair],
    [40, 20, hair],
    [60, 20, '#ffcd98'],
    [80, 20, '#ffcd98'],
    [100, 20, hair],
    [40, 40, '#ffcd98'],
    [60, 40, '#ffcd98'],
    [80, 40, '#ffcd98'],
    [100, 40, '#ffcd98'],
    [60, 60, outfit],
    [80, 60, outfit],
    [40, 80, outfit],
    [60, 80, outfit],
    [80, 80, outfit],
    [100, 80, outfit],
    [40, 100, outfit],
    [60, 100, outfit],
    [80, 100, outfit],
    [100, 100, outfit],
    [40, 120, '#151d35'],
    [100, 120, '#151d35'],
    [40, 140, '#151d35'],
    [100, 140, '#151d35']
  ];
}

function drawAvatar(gender, mini = false) {
  const pixels = avatarPixels(gender)
    .map(
      ([x, y, color]) =>
        `<span class="pixel" style="left:${mini ? x * 0.6 : x}px;top:${mini ? y * 0.6 : y}px;background:${color}"></span>`
    )
    .join('');
  return `<div class="avatar ${mini ? 'mini-avatar' : ''}">${pixels}</div>`;
}

function renderGame() {
  const { user, gender, equipped, inventory } = state.session;
  const isInventory = state.panel === 'inventory';

  gameView.innerHTML = `
    <div class="game-stage">
      <button id="leftArrow" class="arrow" type="button">◀</button>

      <section class="home-panel ${isInventory ? '' : 'active'}">
        <h3 class="player-name">${user}</h3>
        ${drawAvatar(gender)}
        <div>
          <p class="player-name">${t('equipped')}</p>
          <div class="slot-row">
            <div class="slot">${t('slotWeapon')}<br />${equipped.weapon}</div>
            <div class="slot">${t('slotShield')}<br />${equipped.shield}</div>
            <div class="slot">${t('slotPet')}<br />${equipped.pet}</div>
          </div>
        </div>

        <div class="mode-row">
          <button class="mode">${t('solo')}</button>
          <button class="mode disabled" disabled>${t('online')}</button>
        </div>
      </section>

      <section class="inventory-panel ${isInventory ? 'active' : ''}">
        <div class="inventory-header">
          <div>
            <h3>${t('inventory')}</h3>
            <p class="note">${t('yourItems')}</p>
          </div>
          ${drawAvatar(gender, true)}
        </div>

        <div class="slot-row">
          <div class="slot">${t('slotWeapon')}<br />${equipped.weapon}</div>
          <div class="slot">${t('slotShield')}<br />${equipped.shield}</div>
          <div class="slot">${t('slotPet')}<br />${equipped.pet}</div>
        </div>

        <div class="item-list">
          ${inventory
            .map((item) => {
              const equippedNow = Object.values(equipped).includes(item);
              return `<article class="item-card ${equippedNow ? 'equipped' : ''}">
                <p class="item-name">${item}</p>
                <p class="note">${equippedNow ? t('equipped') : '—'}</p>
              </article>`;
            })
            .join('')}
        </div>
      </section>

      <button id="rightArrow" class="arrow" type="button">▶</button>
    </div>
  `;

  document.getElementById('leftArrow').addEventListener('click', () => {
    state.panel = 'inventory';
    renderGame();
  });

  document.getElementById('rightArrow').addEventListener('click', () => {
    state.panel = 'home';
    renderGame();
  });
}

langToggle.addEventListener('click', () => {
  state.lang = state.lang === 'de' ? 'en' : 'de';
  langToggle.textContent = state.lang === 'de' ? 'DE / EN' : 'EN / DE';

  if (authView.classList.contains('active')) renderAuth();
  if (genderView.classList.contains('active')) renderGender();
  if (gameView.classList.contains('active')) renderGame();
});

renderAuth();
switchView('auth');
