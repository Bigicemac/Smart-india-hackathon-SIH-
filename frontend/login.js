/* ==========================================================================
   MACWATIS — LOGIN & AUTHENTICATION ENGINE
   MongoDB Document Store • Error & Success Handling • User Session
   ========================================================================== */

// ---- MONGO COLLECTION STORAGE LAYER ----
class MongoCollection {
  constructor(name) {
    this.name = name;
    this.key = `MACWATIS_MONGO_${name.toUpperCase()}`;
  }

  _load() {
    try {
      return JSON.parse(localStorage.getItem(this.key) || '[]');
    } catch {
      return [];
    }
  }

  _save(docs) {
    try {
      localStorage.setItem(this.key, JSON.stringify(docs));
    } catch (e) {
      console.error(e);
    }
  }

  find(query = {}) {
    return this._load().filter(doc => Object.keys(query).every(k => doc[k] === query[k]));
  }

  findOne(query = {}) {
    return this.find(query)[0] || null;
  }

  insertOne(doc) {
    const docs = this._load();
    const newDoc = {
      _id: 'user_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...doc
    };
    docs.unshift(newDoc);
    this._save(docs);
    return newDoc;
  }

  initDefault(defaults) {
    if (!this._load().length) this._save(defaults);
  }
}

const DB = { users: new MongoCollection('users') };

// Seeded candidate for instant evaluation
const DEFAULT_USERS = [
  {
    _id: "user_jaiwant",
    name: "Jaiwant",
    fullName: "Jaiwant",
    email: "jaiwant@nitk.edu.in",
    rollNo: "211CS142",
    password: "password123",
    branch: "Computer Science (CSE)",
    batch: "2026 Batch",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    readinessScore: 72,
    predictedTier: "Very High",
    percentile: "Top 30%",
    targetCompany: "amazon",
    proficiencies: { dsa: 75, sys: 65, dbms: 80, os: 70, cn: 60 },
    recommendations: [
      { name: 'Amazon', role: 'SDE Intern', match: '76%', type: 'high', logo: 'A', color: '#ff9900', id: 'amazon' },
      { name: 'Google', role: 'SWE Intern', match: '70%', type: 'high', logo: 'G', color: '#4285F4', id: 'google' },
      { name: 'Microsoft', role: 'SDE Intern', match: '72%', type: 'high', logo: 'M', color: '#00a4ef', id: 'microsoft' },
      { name: 'Adobe', role: 'Research Intern', match: '66%', type: 'medium', logo: 'A', color: '#FA0F00', id: 'adobe' }
    ]
  }
];

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  DB.users.initDefault(DEFAULT_USERS);
});

// ---- VIEW SWITCHER (Login / Register) ----
function show(view) {
  const title = document.getElementById('title');
  const sub = document.getElementById('sub');

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${view}`)?.classList.add('active');

  // Clear existing alert messages
  setAlert('si-alert', '', '');
  setAlert('reg-alert', '', '');

  if (view === 'signin') {
    if (title) title.textContent = 'Welcome Back';
    if (sub) sub.innerHTML = `Don't have an account? <a href="#" onclick="show('register'); return false;">Sign up</a>`;
  } else if (view === 'register') {
    if (title) title.textContent = 'Create Account';
    if (sub) sub.innerHTML = `Already have an account? <a href="#" onclick="show('signin'); return false;">Sign in</a>`;
  }
}

// Legacy alias for compatibility
function showView(view) { show(view); }

// ---- ALERT HELPER ----
function setAlert(elementId, message, type) {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (!message) {
    el.className = 'alert';
    el.textContent = '';
    el.style.display = 'none';
  } else {
    el.className = `alert ${type}`;
    el.textContent = message;
    el.style.display = 'block';
  }
}

// ---- PASSWORD EYE TOGGLE ----
function eyeToggle(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';

  btn.innerHTML = isHidden
    ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function togglePw(id, btn) { eyeToggle(id, btn); }

// ---- 1. LOGIN HANDLER ----
function doSignIn(e) {
  e.preventDefault();
  const identifier = (document.getElementById('si-id') || document.getElementById('siIdentifier'))?.value.trim().toLowerCase() || '';
  const password = (document.getElementById('si-pw') || document.getElementById('siPassword'))?.value || '';

  if (!identifier) {
    setAlert('si-alert', 'Please enter your email address or roll number.', 'error');
    shakeCard();
    return;
  }

  const users = DB.users.find();
  const matched = users.find(u =>
    u.email.toLowerCase() === identifier ||
    u.rollNo.toLowerCase() === identifier ||
    u.name.toLowerCase() === identifier
  );

  // Check if candidate exists
  if (!matched) {
    setAlert('si-alert', 'Wrong credentials. Candidate account not found.', 'error');
    shakeCard();
    return;
  }

  // Check password if set on record
  if (matched.password && password && matched.password !== password) {
    setAlert('si-alert', 'Wrong password. Please try again.', 'error');
    shakeCard();
    return;
  }

  // SUCCESS: Log the candidate in & redirect
  localStorage.setItem('MACWATIS_ACTIVE_USER_ID', matched._id);
  localStorage.setItem('PREPVERSE_ACTIVE_USER_ID', matched._id);
  setAlert('si-alert', `Login successful! Welcome, ${matched.fullName || matched.name}. Redirecting...`, 'success');

  setTimeout(() => {
    window.location.href = './index.html';
  }, 700);
}

function handleSignIn(e) { doSignIn(e); }

// ---- 2. REGISTER / CREATE ACCOUNT HANDLER ----
function doRegister(e) {
  e.preventDefault();

  const fullName = (document.getElementById('reg-name') || document.getElementById('regFullName'))?.value.trim() || '';
  const rollNo = (document.getElementById('reg-roll') || document.getElementById('regRollNo'))?.value.trim() || '';
  const branch = (document.getElementById('reg-branch') || document.getElementById('regBranch'))?.value || 'Computer Science (CSE)';
  const batch = (document.getElementById('reg-batch') || document.getElementById('regBatch'))?.value || '2026 Batch';
  const email = (document.getElementById('reg-email') || document.getElementById('regEmail'))?.value.trim() || '';
  const password = (document.getElementById('reg-pw') || document.getElementById('regPassword'))?.value || '';

  if (!fullName || !rollNo) {
    setAlert('reg-alert', 'Please provide both your name and roll number.', 'error');
    return;
  }

  // Check for existing roll number
  const existing = DB.users.findOne({ rollNo: rollNo });
  if (existing) {₹
    setAlert('reg-alert', `An account with Roll No. ${rollNo} already exists. Please log in.`, 'error');
    return;
  }

  const firstName = fullName.split(' ')[0];
  const score = Math.floor(68 + Math.random() * 22);

  // Save new candidate into MongoDB collection
  const newUser = {
    name: firstName,
    fullName: fullName,
    email: email || `${firstName.toLowerCase()}.${rollNo.toLowerCase()}@nitk.edu.in`,
    rollNo: rollNo,
    password: password || '123456',
    branch: branch,
    batch: batch,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    readinessScore: score,
    predictedTier: score > 85 ? 'Elite Tier' : 'Very High',
    percentile: score > 85 ? 'Top 10%' : 'Top 25%',
    targetCompany: 'amazon',
    proficiencies: {
      dsa: score,
      sys: Math.max(50, score - 10),
      dbms: score + 5,
      os: score - 5,
      cn: score - 8
    },
    recommendations: [
      { name: 'Amazon', role: 'SDE Intern', match: `${score + 4}%`, type: 'high', logo: 'A', color: '#ff9900', id: 'amazon' },
      { name: 'Google', role: 'SWE Intern', match: `${score - 2}%`, type: 'high', logo: 'G', color: '#4285F4', id: 'google' },
      { name: 'Microsoft', role: 'SDE Intern', match: `${score}%`, type: 'high', logo: 'M', color: '#00a4ef', id: 'microsoft' },
      { name: 'Adobe', role: 'Research Intern', match: `${score - 6}%`, type: 'medium', logo: 'A', color: '#FA0F00', id: 'adobe' }
    ]
  };

  DB.users.insertOne(newUser);

  // Clear the register form inputs
  const regForm = document.querySelector('#view-register form');
  if (regForm) regForm.reset();

  // Switch back to Login view and prompt user to login
  show('signin');

  // Pre-fill login identifier with new roll number
  const siInput = document.getElementById('si-id') || document.getElementById('siIdentifier');
  if (siInput) siInput.value = rollNo;

  // Show success alert on the login screen
  setAlert('si-alert', `Account created successfully for ${fullName}! Please enter your password to log in.`, 'success');
  toast(`Account created for ${fullName}!`);
}

function handleRegister(e) { doRegister(e); }

// ---- UI HELPERS ----
function shakeCard() {
  const card = document.querySelector('.card') || document.querySelector('.auth-card');
  if (card) {
    card.style.animation = 'shake 0.35s ease';
    setTimeout(() => card.style.animation = '', 400);
  }
}

function toast(message) {
  const wrap = document.getElementById('toasts') || document.getElementById('toastWrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(12px)';
    setTimeout(() => el.remove(), 220);
  }, 2800);
}

function showToast(message) { toast(message); }
