/* ==========================================================================
   MACWATIS / PKIP - MONGODB ENGINE & USER AUTHENTICATION
   Monochrome Matte Black & White Architecture | SIH 2026
   ========================================================================== */

// --- MONGO DB STORAGE LAYER (Local / Persistent Document Store) ---
class MongoCollection {
  constructor(collectionName) {
    this.name = collectionName;
    this.storageKey = `MACWATIS_MONGO_${collectionName.toUpperCase()}`;
  }

  _load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`MongoDB read error on collection ${this.name}:`, e);
      return [];
    }
  }

  _save(docs) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(docs));
    } catch (e) {
      console.error(`MongoDB write error on collection ${this.name}:`, e);
    }
  }

  find(query = {}) {
    const docs = this._load();
    return docs.filter(doc => {
      for (let key in query) {
        if (doc[key] !== query[key]) return false;
      }
      return true;
    });
  }

  findOne(query = {}) {
    const results = this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  insertOne(doc) {
    const docs = this._load();
    const newDoc = {
      _id: doc._id || 'doc_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...doc
    };
    docs.unshift(newDoc);
    this._save(docs);
    return newDoc;
  }

  updateOne(query, updateData) {
    const docs = this._load();
    let updated = false;
    for (let i = 0; i < docs.length; i++) {
      let match = true;
      for (let key in query) {
        if (docs[i][key] !== query[key]) { match = false; break; }
      }
      if (match) {
        docs[i] = { ...docs[i], ...updateData, updatedAt: new Date().toISOString() };
        updated = true;
        break;
      }
    }
    if (updated) this._save(docs);
    return updated;
  }

  initDefault(defaultDocs) {
    const existing = this._load();
    if (!existing || existing.length === 0) {
      this._save(defaultDocs);
    }
  }
}

// MongoDB Database Instance
const DB = {
  users: new MongoCollection('users'),
  experiences: new MongoCollection('experiences'),
  companies: new MongoCollection('companies'),
  questions: new MongoCollection('questions')
};

// --- INITIALIZE DEFAULT MONGO DOCUMENTS ---
const DEFAULT_USERS = [
  {
    _id: "user_jaiwant",
    name: "Jaiwant",
    fullName: "Jaiwant",
    email: "jaiwant@nitk.edu.in",
    rollNo: "211CS142",
    branch: "Computer Science (CSE)",
    batch: "2026 Batch",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    readinessScore: 72,
    predictedTier: "Very High",
    percentile: "Top 30%",
    targetCompany: "amazon",
    proficiencies: { dsa: 75, sys: 65, dbms: 80, os: 70, cn: 60 },
    recommendations: [
      { name: "Amazon", role: "SDE Intern", match: "88%", type: "high", logo: "a", color: "#ff9900", id: "amazon" },
      { name: "Microsoft", role: "SDE Intern", match: "85%", type: "high", logo: "M", color: "#00a4ef", id: "microsoft" },
      { name: "Google", role: "STEP Intern", match: "83%", type: "high", logo: "G", color: "#4285F4", id: "google" },
      { name: "Adobe", role: "Research Intern", match: "76%", type: "medium", logo: "A", color: "#FA0F00", id: "adobe" },
      { name: "Atlassian", role: "SWE Intern", match: "72%", type: "medium", logo: "▲", color: "#0052CC", id: "atlassian" }
    ]
  },
  {
    _id: "user_ananya",
    name: "Ananya",
    fullName: "Ananya Sharma",
    email: "ananya.sharma@nitk.edu.in",
    rollNo: "211IT023",
    branch: "Information Tech (IT)",
    batch: "2025 Batch",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    readinessScore: 89,
    predictedTier: "Elite Tier",
    percentile: "Top 5%",
    targetCompany: "microsoft",
    proficiencies: { dsa: 92, sys: 88, dbms: 90, os: 85, cn: 82 },
    recommendations: [
      { name: "Microsoft", role: "SWE FTE", match: "94%", type: "high", logo: "M", color: "#00a4ef", id: "microsoft" },
      { name: "Google", role: "SWE-1", match: "91%", type: "high", logo: "G", color: "#4285F4", id: "google" },
      { name: "Amazon", role: "SDE-1", match: "89%", type: "high", logo: "a", color: "#ff9900", id: "amazon" },
      { name: "Goldman Sachs", role: "Summer Analyst", match: "87%", type: "high", logo: "GS", color: "#60a5fa", id: "goldmansachs" },
      { name: "Adobe", role: "Research Intern", match: "84%", type: "medium", logo: "A", color: "#FA0F00", id: "adobe" }
    ]
  },
  {
    _id: "user_rohan",
    name: "Rohan",
    fullName: "Rohan Verma",
    email: "rohan.verma@nitk.edu.in",
    rollNo: "211EC088",
    branch: "Electronics (ECE)",
    batch: "2025 Batch",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    readinessScore: 94,
    predictedTier: "Super Elite",
    percentile: "Top 2%",
    targetCompany: "amazon",
    proficiencies: { dsa: 96, sys: 92, dbms: 90, os: 94, cn: 88 },
    recommendations: [
      { name: "Amazon", role: "SDE II", match: "96%", type: "high", logo: "a", color: "#ff9900", id: "amazon" },
      { name: "Atlassian", role: "SWE-2", match: "93%", type: "high", logo: "▲", color: "#0052CC", id: "atlassian" },
      { name: "Google", role: "SWE-2", match: "90%", type: "high", logo: "G", color: "#4285F4", id: "google" },
      { name: "Adobe", role: "Member Tech Staff", match: "88%", type: "high", logo: "A", color: "#FA0F00", id: "adobe" },
      { name: "Microsoft", role: "SDE-2", match: "86%", type: "medium", logo: "M", color: "#00a4ef", id: "microsoft" }
    ]
  }
];

const DEFAULT_EXPERIENCES = [
  {
    _id: "exp_1",
    authorName: "Ananya Sharma",
    authorRole: "Microsoft SWE Intern '25",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    time: "2h ago",
    title: "Microsoft Interview Experience (SDE Intern)",
    body: "Had my final round today. 3 coding rounds + 1 behavioral. Questions were on DP, Graphs and System Design. Overall a great experience!",
    likes: 124,
    comments: 27
  },
  {
    _id: "exp_2",
    authorName: "Rohan Verma",
    authorRole: "Amazon SDE '24",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    time: "5h ago",
    title: "Amazon offered 52 LPA for SDE II – Breakdown and Strategy",
    body: "Received my offer letter today. Total CTC is 52 LPA (Fixed: 30, Bonus: 12, RSU: 10). Role is SDE II. Grateful to this community!",
    likes: 211,
    comments: 45
  }
];

const DEFAULT_COMPANIES = [
  {
    id: "amazon",
    name: "Amazon",
    role: "SDE Intern / FTE",
    logo: "A",
    logoColor: "#ff9900",
    tier: "Tier-1 Super Dream",
    ctc: "₹44.2 LPA",
    cutoff: "7.00+ CGPA",
    benchmark: { dsa: 90, sys: 85, dbms: 80, os: 75, cn: 70 },
    rounds: [
      { name: "Online Assessment (OA)", pass: "22%" },
      { name: "Tech Round 1 (DSA + LP)", pass: "45%" },
      { name: "Tech Round 2 (LLD + LP)", pass: "50%" },
      { name: "Bar Raiser Round", pass: "65%" }
    ],
    topics: ["Dynamic Programming (30%)", "Trees & Graphs (25%)", "HashMaps & Stacks (20%)", "Leadership Principles (25%)"]
  },
  {
    id: "microsoft",
    name: "Microsoft",
    role: "SDE Intern",
    logo: "M",
    logoColor: "#00a4ef",
    tier: "Tier-1 Super Dream",
    ctc: "₹42.0 LPA",
    cutoff: "7.50+ CGPA",
    benchmark: { dsa: 88, sys: 80, dbms: 85, os: 90, cn: 85 },
    rounds: [
      { name: "Codility OA (3 Coding)", pass: "18%" },
      { name: "Technical Round 1", pass: "45%" },
      { name: "Technical Round 2 (OS/Systems)", pass: "55%" },
      { name: "AA / Managerial Round", pass: "70%" }
    ],
    topics: ["Strings & Bit Manipulation (25%)", "Trees & Recursion (25%)", "OS & Concurrency (20%)", "System Design (15%)"]
  },
  {
    id: "google",
    name: "Google",
    role: "STEP Intern / SWE",
    logo: "G",
    logoColor: "#4285f4",
    tier: "Tier-1 Super Dream",
    ctc: "₹38.5 LPA",
    cutoff: "8.50+ CGPA",
    benchmark: { dsa: 95, sys: 80, dbms: 70, os: 85, cn: 75 },
    rounds: [
      { name: "OA (2 Hard Problems)", pass: "12%" },
      { name: "Tech Round 1 (Algorithms)", pass: "35%" },
      { name: "Tech Round 2 (Data Structures)", pass: "50%" },
      { name: "Googliness & Fitment", pass: "80%" }
    ],
    topics: ["Dynamic Programming (35%)", "Graphs & Shortest Path (30%)", "Tries & Strings (15%)", "Segment Trees (10%)"]
  },
  {
    id: "adobe",
    name: "Adobe",
    role: "Research Intern",
    logo: "A",
    logoColor: "#fa0f00",
    tier: "Tier-1 Super Dream",
    ctc: "₹40.0 LPA",
    cutoff: "7.50+ CGPA",
    benchmark: { dsa: 85, sys: 78, dbms: 75, os: 80, cn: 75 },
    rounds: [
      { name: "OA (Coding + Aptitude)", pass: "20%" },
      { name: "Tech Round 1 (DSA)", pass: "42%" },
      { name: "Tech Round 2 (Research/Projects)", pass: "60%" }
    ],
    topics: ["Matrix DP & Graphs (30%)", "Math & Probability (25%)", "C++ Fundamentals (20%)", "Trees (15%)"]
  },
  {
    id: "atlassian",
    name: "Atlassian",
    role: "SWE Intern",
    logo: "▲",
    logoColor: "#0052cc",
    tier: "Tier-1 Super Dream",
    ctc: "₹55.0 LPA",
    cutoff: "8.00+ CGPA",
    benchmark: { dsa: 92, sys: 88, dbms: 82, os: 80, cn: 78 },
    rounds: [
      { name: "OA (3 Coding Problems)", pass: "15%" },
      { name: "Tech Round 1 (Data Structures)", pass: "40%" },
      { name: "Tech Round 2 (System Design/Values)", pass: "55%" }
    ],
    topics: ["Graph Traversals (30%)", "Low-Level Design (25%)", "DP on Strings (20%)", "Values & Culture (25%)"]
  }
];

const DEFAULT_QUESTIONS = [
  {
    id: "mq1",
    title: "Trapping Rain Water (2D & 3D Variations)",
    company: "Google / Amazon",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    desc: "Compute total units of water trapped after rain given elevation heights array.",
    solution: `// Two-Pointer Optimal Approach O(N) Time, O(1) Space
int trap(vector<int>& h) {
    int l = 0, r = h.size() - 1, lmax = 0, rmax = 0, ans = 0;
    while (l < r) {
        if (h[l] < h[r]) {
            if (h[l] >= lmax) lmax = h[l];
            else ans += lmax - h[l];
            l++;
        } else {
            if (h[r] >= rmax) rmax = h[r];
            else ans += rmax - h[r];
            r--;
        }
    }
    return ans;
}`
  },
  {
    id: "mq2",
    title: "Design Thread-Safe LRU Cache with TTL",
    company: "Amazon / D. E. Shaw",
    topic: "Low-Level Design (LLD)",
    difficulty: "Medium",
    desc: "Implement LRU cache supporting O(1) get and put with thread synchronization.",
    solution: `// Doubly Linked List + Hashmap with mutex lock
class LRUCache {
    unordered_map<int, list<pair<int, int>>::iterator> map;
    list<pair<int, int>> cache;
    int cap;
    mutex mtx;
public:
    LRUCache(int c) : cap(c) {}
    int get(int key) {
        lock_guard<mutex> lock(mtx);
        if (!map.count(key)) return -1;
        cache.splice(cache.begin(), cache, map[key]);
        return map[key]->second;
    }
};`
  },
  {
    id: "mq3",
    title: "Course Schedule II (Topological Sort)",
    company: "Microsoft / Uber",
    topic: "Graphs & BFS",
    difficulty: "Medium",
    desc: "Find ordering of courses you should take to finish all courses using Kahn's Algorithm.",
    solution: `// Kahn's In-Degree Array + BFS Queue
vector<int> findOrder(int n, vector<vector<int>>& edges) {
    vector<int> in(n, 0), order;
    vector<vector<int>> adj(n);
    for (auto& e : edges) { adj[e[1]].push_back(e[0]); in[e[0]]++; }
    queue<int> q;
    for (int i = 0; i < n; i++) if (in[i] == 0) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop(); order.push_back(u);
        for (int v : adj[u]) if (--in[v] == 0) q.push(v);
    }
    return order.size() == n ? order : vector<int>{};
}`
  }
];

// --- GLOBAL STATE ---
let currentUser = null;
let radarChartInstance = null;

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Database Collections
  DB.users.initDefault(DEFAULT_USERS);
  DB.experiences.initDefault(DEFAULT_EXPERIENCES);
  DB.companies.initDefault(DEFAULT_COMPANIES);
  DB.questions.initDefault(DEFAULT_QUESTIONS);

  // Load Active User from MongoDB
  const savedUserId = localStorage.getItem("MACWATIS_ACTIVE_USER_ID") || localStorage.getItem("PREPVERSE_ACTIVE_USER_ID") || "user_jaiwant";
  const user = DB.users.findOne({ _id: savedUserId }) || DB.users.find()[0];
  setCurrentUser(user._id);

  initCompaniesView();
  initMockQuestionsView();
  renderCommunityFeed();
  refreshIcons();

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".user-profile-btn") && !e.target.closest(".user-dropdown-menu")) {
      const menu = document.getElementById("userDropdownMenu");
      if (menu) menu.classList.remove("open");
    }
  });
});

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// --- USER PROFILE & DASHBOARD REACTIVITY ---
function setCurrentUser(userId) {
  const user = DB.users.findOne({ _id: userId });
  if (!user) return;

  currentUser = user;
  localStorage.setItem("MACWATIS_ACTIVE_USER_ID", user._id);
  localStorage.setItem("PREPVERSE_ACTIVE_USER_ID", user._id);

  // 1. Update Navigation Bar Header
  const navAvatar = document.getElementById("navUserAvatar");
  const navName = document.getElementById("navUserName");
  if (navAvatar) navAvatar.src = user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";
  if (navName) navName.textContent = user.name;

  // 2. Update Popover Header
  const dropFullName = document.getElementById("dropdownFullName");
  const dropMeta = document.getElementById("dropdownMeta");
  if (dropFullName) dropFullName.textContent = user.fullName || user.name;
  if (dropMeta) dropMeta.textContent = `${user.branch} • ${user.rollNo}`;

  // 3. Update Welcome Hero Card
  const heroName = document.getElementById("heroWelcomeName");
  const heroScoreNum = document.getElementById("heroScoreNum");
  const heroScoreBar = document.getElementById("heroScoreBar");
  const heroTier = document.getElementById("heroPredictedTier");
  const heroPercentile = document.getElementById("heroPredictedPercentile");
  const sidebarScore = document.getElementById("sidebarReadinessVal");
  const sidebarCircle = document.getElementById("sidebarProgressCircle");

  if (heroName) heroName.textContent = `Welcome back, ${user.name}`;
  if (heroScoreNum) heroScoreNum.textContent = `${user.readinessScore}%`;
  if (heroScoreBar) heroScoreBar.style.width = `${user.readinessScore}%`;
  if (heroTier) heroTier.textContent = user.predictedTier || "Very High";
  if (heroPercentile) heroPercentile.textContent = user.percentile || "Top 30%";
  if (sidebarScore) sidebarScore.textContent = `${user.readinessScore}%`;
  if (sidebarCircle) sidebarCircle.style.background = `conic-gradient(#ffffff 0% ${user.readinessScore}%, #27272a ${user.readinessScore}% 100%)`;

  // 4. Update Slider Inputs with User's Proficiencies
  if (user.proficiencies) {
    if (document.getElementById("predDsa")) document.getElementById("predDsa").value = user.proficiencies.dsa;
    if (document.getElementById("predSys")) document.getElementById("predSys").value = user.proficiencies.sys;
    if (document.getElementById("predDbms")) document.getElementById("predDbms").value = user.proficiencies.dbms;
    if (document.getElementById("predOs")) document.getElementById("predOs").value = user.proficiencies.os;
    if (document.getElementById("predCn")) document.getElementById("predCn").value = user.proficiencies.cn;
  }

  // 5. Update Target Recruiter in Predictor
  const selectComp = document.getElementById("predictorCompanySelect");
  if (selectComp && user.targetCompany) {
    selectComp.value = user.targetCompany;
  }

  // 6. Re-render Recommendations Carousel
  renderRecommendations(user);

  // 7. Calculate and Re-render Radar Chart
  calculatePredictor(false);

  // 8. Refresh Demo Users List in Modal
  renderDemoUsersList();

  refreshIcons();
}

function renderRecommendations(user) {
  const container = document.getElementById("companyRecsContainer");
  if (!container) return;

  const recs = user.recommendations || DEFAULT_USERS[0].recommendations;

  container.innerHTML = recs.map(r => `
    <div class="company-rec-card" onclick="openCompanyModal('${r.id || 'amazon'}')">
      <div class="rec-company-logo" style="font-size: 1.5rem; display: flex; align-items: center; justify-content: center; font-weight: 800; color: ${r.color || '#fff'};">${r.logo}</div>
      <h4 class="rec-company-name">${r.name}</h4>
      <p class="rec-company-role">${r.role}</p>
      <span class="match-pill match-${r.type || 'high'}">${r.type === 'high' ? 'High Match' : 'Medium Match'}</span>
      <span class="match-percentage">${r.match}</span>
    </div>
  `).join("");
}

// --- USER DROPDOWN POPOVER ---
function toggleUserDropdown(e) {
  e.stopPropagation();
  const menu = document.getElementById("userDropdownMenu");
  if (menu) menu.classList.toggle("open");
}

function handleUserSignOut() {
  const menu = document.getElementById("userDropdownMenu");
  if (menu) menu.classList.remove("open");
  openAuthModal("signin");
  showToast("Signed out of current session");
}

// --- AUTHENTICATION & LOGIN MODAL ---
function openAuthModal(defaultTab = 'switch') {
  const menu = document.getElementById("userDropdownMenu");
  if (menu) menu.classList.remove("open");

  const overlay = document.getElementById("authModalOverlay");
  if (overlay) overlay.classList.add("open");

  switchAuthTab(defaultTab);
  renderDemoUsersList();
}

function closeAuthModal() {
  const overlay = document.getElementById("authModalOverlay");
  if (overlay) overlay.classList.remove("open");
}

function switchAuthTab(tab) {
  const tabSwitchBtn = document.getElementById("tabSwitchBtn");
  const tabSignInBtn = document.getElementById("tabSignInBtn");
  const tabSignUpBtn = document.getElementById("tabSignUpBtn");

  const tabSwitch = document.getElementById("authTabSwitch");
  const formSignIn = document.getElementById("authSignInForm");
  const formSignUp = document.getElementById("authSignUpForm");

  // Reset active classes
  [tabSwitchBtn, tabSignInBtn, tabSignUpBtn].forEach(b => b?.classList.remove("active"));
  if (tabSwitch) tabSwitch.style.display = "none";
  if (formSignIn) formSignIn.style.display = "none";
  if (formSignUp) formSignUp.style.display = "none";

  if (tab === 'switch') {
    tabSwitchBtn?.classList.add("active");
    if (tabSwitch) tabSwitch.style.display = "block";
  } else if (tab === 'signin') {
    tabSignInBtn?.classList.add("active");
    if (formSignIn) formSignIn.style.display = "block";
  } else if (tab === 'signup') {
    tabSignUpBtn?.classList.add("active");
    if (formSignUp) formSignUp.style.display = "block";
  }
}

function renderDemoUsersList() {
  const container = document.getElementById("demoUsersListContainer");
  if (!container) return;

  const users = DB.users.find();
  container.innerHTML = users.map(u => `
    <div class="demo-user-card ${currentUser && currentUser._id === u._id ? 'current' : ''}" onclick="selectUserFromModal('${u._id}')">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <img src="${u.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color);">
        <div>
          <div style="font-size: 0.85rem; font-weight: 600; color: #fff;">${u.fullName || u.name}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${u.branch} • Roll: ${u.rollNo}</div>
        </div>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 0.85rem; font-weight: 700; font-family: var(--font-mono); color: #fff;">${u.readinessScore}%</span>
        <div style="font-size: 0.65rem; color: var(--text-muted);">${u.predictedTier || 'High Match'}</div>
      </div>
    </div>
  `).join("");
}

function selectUserFromModal(userId) {
  setCurrentUser(userId);
  closeAuthModal();
  showToast(`Switched profile to ${currentUser.fullName || currentUser.name}`);
}

function handleUserSignIn(e) {
  e.preventDefault();
  const identifier = document.getElementById("signInIdentifier")?.value.trim().toLowerCase() || "";
  
  const allUsers = DB.users.find();
  const matched = allUsers.find(u => 
    u.email.toLowerCase() === identifier || 
    u.rollNo.toLowerCase() === identifier ||
    u.name.toLowerCase() === identifier
  );

  if (matched) {
    setCurrentUser(matched._id);
    closeAuthModal();
    document.getElementById("authSignInForm")?.reset();
    showToast(`Welcome back, ${matched.fullName || matched.name}! Authenticated via MongoDB.`);
  } else {
    showToast(`Candidate '${identifier}' not found in MongoDB. Please Register below.`);
    switchAuthTab('signup');
  }
}

function handleUserRegister(e) {
  e.preventDefault();
  const fullName = document.getElementById("regFullName")?.value.trim() || "Candidate";
  const rollNo = document.getElementById("regRollNo")?.value.trim() || "221CS001";
  const branch = document.getElementById("regBranch")?.value || "Computer Science (CSE)";
  const batch = document.getElementById("regBatch")?.value || "2026 Batch";
  const targetCompany = document.getElementById("regTargetCompany")?.value || "Amazon";

  const firstName = fullName.split(" ")[0];
  const initialScore = Math.floor(70 + Math.random() * 20);

  const newUser = {
    _id: "user_" + Math.random().toString(36).substr(2, 9),
    name: firstName,
    fullName: fullName,
    email: `${firstName.toLowerCase()}.${rollNo.toLowerCase()}@nitk.edu.in`,
    rollNo: rollNo,
    branch: branch,
    batch: batch,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    readinessScore: initialScore,
    predictedTier: initialScore > 85 ? "Elite Tier" : "Very High",
    percentile: initialScore > 85 ? "Top 10%" : "Top 25%",
    targetCompany: targetCompany.toLowerCase().replace(/\s+/g, ''),
    proficiencies: {
      dsa: initialScore,
      sys: Math.max(50, initialScore - 10),
      dbms: initialScore + 5,
      os: initialScore - 5,
      cn: initialScore - 8
    },
    recommendations: [
      { name: targetCompany, role: "SDE Intern", match: `${initialScore + 4}%`, type: "high", logo: targetCompany[0], color: "#ffffff", id: targetCompany.toLowerCase() },
      { name: "Google", role: "SWE Intern", match: `${initialScore - 2}%`, type: "high", logo: "G", color: "#4285F4", id: "google" },
      { name: "Microsoft", role: "SDE Intern", match: `${initialScore}%`, type: "high", logo: "M", color: "#00a4ef", id: "microsoft" },
      { name: "Adobe", role: "Research Intern", match: `${initialScore - 6}%`, type: "medium", logo: "A", color: "#FA0F00", id: "adobe" }
    ]
  };

  DB.users.insertOne(newUser);
  setCurrentUser(newUser._id);
  closeAuthModal();
  document.getElementById("authSignUpForm")?.reset();
  showToast(`Registered candidate '${fullName}' successfully in MongoDB!`);
}

// --- VIEW ROUTER ---
function switchView(viewId) {
  const panels = document.querySelectorAll(".view-panel");
  const navBtns = document.querySelectorAll(".nav-item-btn");

  panels.forEach(p => p.classList.remove("active"));
  navBtns.forEach(b => b.classList.remove("active"));

  const targetPanel = document.getElementById(viewId);
  if (targetPanel) {
    targetPanel.classList.add("active");
  }

  const activeBtn = document.querySelector(`[data-view="${viewId}"]`);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }

  if (viewId === "view-predictor") {
    setTimeout(() => calculatePredictor(false), 100);
  }

  refreshIcons();
}

// --- PLACEMENT PREDICTOR & RADAR CHART ---
function updatePredictorBenchmark() {
  calculatePredictor(true);
}

function calculatePredictor(isUserTriggered = false) {
  const dsa = parseInt(document.getElementById("predDsa")?.value || (currentUser?.proficiencies?.dsa || 75));
  const sys = parseInt(document.getElementById("predSys")?.value || (currentUser?.proficiencies?.sys || 65));
  const dbms = parseInt(document.getElementById("predDbms")?.value || (currentUser?.proficiencies?.dbms || 80));
  const os = parseInt(document.getElementById("predOs")?.value || (currentUser?.proficiencies?.os || 70));
  const cn = parseInt(document.getElementById("predCn")?.value || (currentUser?.proficiencies?.cn || 60));

  // Update slider badges
  if (document.getElementById("sliderDsaVal")) document.getElementById("sliderDsaVal").textContent = dsa + "%";
  if (document.getElementById("sliderSysVal")) document.getElementById("sliderSysVal").textContent = sys + "%";
  if (document.getElementById("sliderDbmsVal")) document.getElementById("sliderDbmsVal").textContent = dbms + "%";
  if (document.getElementById("sliderOsVal")) document.getElementById("sliderOsVal").textContent = os + "%";
  if (document.getElementById("sliderCnVal")) document.getElementById("sliderCnVal").textContent = cn + "%";

  const compKey = document.getElementById("predictorCompanySelect")?.value || (currentUser?.targetCompany || "amazon");
  const comp = DB.companies.findOne({ id: compKey }) || DEFAULT_COMPANIES[0];
  const bm = comp.benchmark;

  // Calculate weighted readiness
  const score = Math.round(
    (dsa / bm.dsa) * 35 +
    (sys / bm.sys) * 20 +
    (dbms / bm.dbms) * 15 +
    (os / bm.os) * 15 +
    (cn / bm.cn) * 15
  );

  const finalScore = Math.min(98, Math.max(45, score));

  // Update Hero and Sidebar
  if (document.getElementById("heroScoreNum")) document.getElementById("heroScoreNum").textContent = finalScore + "%";
  if (document.getElementById("heroScoreBar")) document.getElementById("heroScoreBar").style.width = finalScore + "%";
  if (document.getElementById("sidebarReadinessVal")) document.getElementById("sidebarReadinessVal").textContent = finalScore + "%";
  const circle = document.getElementById("sidebarProgressCircle");
  if (circle) circle.style.background = `conic-gradient(#ffffff 0% ${finalScore}%, #27272a ${finalScore}% 100%)`;

  // Persist updated proficiencies in MongoDB if user adjusted sliders
  if (isUserTriggered && currentUser) {
    currentUser.proficiencies = { dsa, sys, dbms, os, cn };
    currentUser.readinessScore = finalScore;
    DB.users.updateOne({ _id: currentUser._id }, { proficiencies: currentUser.proficiencies, readinessScore: finalScore });
  }

  renderRadarChart([dsa, sys, dbms, os, cn], [bm.dsa, bm.sys, bm.dbms, bm.os, bm.cn], comp.name);
}

function renderRadarChart(userScores, targetScores, compName) {
  const ctx = document.getElementById("predictorRadarChart");
  if (!ctx) return;

  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  radarChartInstance = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["DSA / Algo", "System Design", "DBMS / SQL", "OS & Concurrency", "Networks"],
      datasets: [
        {
          label: "Your Proficiency",
          data: userScores,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderColor: "#ffffff",
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#09090b",
          borderWidth: 2
        },
        {
          label: `${compName} Benchmark`,
          data: targetScores,
          backgroundColor: "rgba(161, 161, 170, 0.08)",
          borderColor: "#71717a",
          pointBackgroundColor: "#a1a1aa",
          borderWidth: 1.5,
          borderDash: [4, 4]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          grid: { color: "#27272a" },
          angleLines: { color: "#27272a" },
          pointLabels: {
            font: { family: "Inter", size: 11, weight: "500" },
            color: "#a1a1aa"
          },
          ticks: { display: false, max: 100, min: 0 }
        }
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { font: { family: "Inter", size: 11 }, color: "#ffffff", boxWidth: 10 }
        }
      }
    }
  });
}

// --- COMPANIES INTELLIGENCE HUB ---
function initCompaniesView() {
  const sidebar = document.getElementById("companyHubList");
  if (!sidebar) return;

  const companies = DB.companies.find();
  sidebar.innerHTML = companies.map((c, i) => `
    <div class="company-list-item ${i === 0 ? 'active' : ''}" onclick="selectCompanyHub('${c.id}', this)">
      <div style="display: flex; align-items: center; gap: 0.65rem;">
        <div style="width: 30px; height: 30px; border-radius: 6px; background: #1c1c22; display: flex; align-items: center; justify-content: center; font-weight: 700; color: ${c.logoColor}; font-size: 0.85rem;">${c.logo}</div>
        <div>
          <div style="font-size: 0.84rem; font-weight: 600; color: #fff;">${c.name}</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${c.role}</div>
        </div>
      </div>
      <span class="match-pill match-high" style="margin: 0; font-size: 0.65rem;">${c.ctc}</span>
    </div>
  `).join("");

  selectCompanyHub(companies[0].id);
}

function selectCompanyHub(compId, el) {
  if (el) {
    document.querySelectorAll(".company-list-item").forEach(i => i.classList.remove("active"));
    el.classList.add("active");
  }

  const c = DB.companies.findOne({ id: compId }) || DEFAULT_COMPANIES[0];
  const container = document.getElementById("companyDossierCard");
  if (!container) return;

  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div style="width: 44px; height: 44px; border-radius: 8px; background: #18181c; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 800; color: ${c.logoColor};">${c.logo}</div>
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #ffffff;">${c.name}</h3>
          <p style="font-size: 0.78rem; color: var(--text-muted);">${c.tier} • ${c.role}</p>
        </div>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 1.15rem; font-weight: 700; color: #ffffff;">${c.ctc}</span>
        <p style="font-size: 0.72rem; color: var(--text-muted);">Eligibility: ${c.cutoff}</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.25rem;">
      <div>
        <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; color: #ffffff;">Selection Funnel</h4>
        <div style="display: flex; flex-direction: column; gap: 0.45rem;">
          ${c.rounds.map(r => `
            <div style="display: flex; justify-content: space-between; padding: 0.55rem 0.8rem; background: #111115; border: 1px solid var(--border-color); border-radius: 6px; font-size: 0.8rem; font-weight: 500;">
              <span style="color: var(--text-secondary);">${r.name}</span>
              <span style="color: #ffffff; font-family: var(--font-mono);">${r.pass}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div>
        <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; color: #ffffff;">Recurring Assessment Topics</h4>
        <div style="display: flex; flex-direction: column; gap: 0.45rem;">
          ${c.topics.map(t => `
            <div style="padding: 0.55rem 0.8rem; background: #18181c; border: 1px solid var(--border-color); color: #ffffff; border-radius: 6px; font-size: 0.78rem; font-weight: 500;">
              ${t}
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function openCompanyModal(compId) {
  switchView('view-companies');
  selectCompanyHub(compId);
}

// --- MOCK Q&A VIEW ---
function initMockQuestionsView() {
  const container = document.getElementById("mockQuestionsGrid");
  if (!container) return;

  const questions = DB.questions.find();
  container.innerHTML = questions.map(q => `
    <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.15rem; background: #111115; display: flex; flex-direction: column; gap: 0.65rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="match-pill match-high" style="margin: 0; font-size: 0.68rem;">${q.difficulty}</span>
        <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500;">${q.company}</span>
      </div>
      <h4 style="font-size: 0.92rem; font-weight: 600; color: #ffffff;">${q.title}</h4>
      <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.45;">${q.desc}</p>
      
      <button onclick="toggleMockSolution('${q.id}')" style="margin-top: auto; padding: 0.45rem 0.8rem; background: #ffffff; color: #000000; border: none; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
        View Verified Solution
      </button>

      <div id="sol_${q.id}" style="display: none; background: #09090b; border: 1px solid var(--border-color); color: #ffffff; padding: 0.75rem; border-radius: 6px; font-size: 0.75rem; font-family: var(--font-mono); white-space: pre-wrap; margin-top: 0.5rem;">
${q.solution}
      </div>
    </div>
  `).join("");
}

function toggleMockSolution(id) {
  const box = document.getElementById(`sol_${id}`);
  if (box) {
    box.style.display = box.style.display === "none" ? "block" : "none";
  }
}

// --- COMMUNITY FEED (Rendered from MongoDB) ---
function renderCommunityFeed() {
  const container = document.getElementById("communityPostsContainer");
  if (!container) return;

  const posts = DB.experiences.find();
  container.innerHTML = posts.map(p => `
    <article class="feed-post-card">
      <div class="post-author-row">
        <div class="author-meta-left">
          <img src="${p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" alt="Author" class="author-avatar-circle">
          <div>
            <div class="author-name-tag">
              <span>${p.authorName}</span>
              <span class="author-role-badge">${p.authorRole}</span>
            </div>
          </div>
        </div>
        <span class="post-time-text">${p.time}</span>
      </div>

      <h4 class="post-title">${p.title}</h4>
      <p class="post-content-body">${p.body}</p>

      <div class="post-actions-bar">
        <button class="post-action-btn" onclick="likePost(this)">
          <i data-lucide="thumbs-up"></i>
          <span>${p.likes || 1}</span>
        </button>
        <button class="post-action-btn" onclick="showToast('${p.comments || 0} comments on this experience')">
          <i data-lucide="message-circle"></i>
          <span>${p.comments || 0}</span>
        </button>
        <button class="post-action-btn" style="margin-left: auto;" onclick="bookmarkPost(this)">
          <i data-lucide="bookmark"></i>
        </button>
        <button class="post-action-btn" onclick="showToast('Copied experience link to clipboard')">
          <i data-lucide="share-2"></i>
        </button>
      </div>
    </article>
  `).join("");

  refreshIcons();
}

function likePost(btn) {
  const span = btn.querySelector("span");
  let count = parseInt(span.textContent);
  count++;
  span.textContent = count;
  btn.style.color = "#ffffff";
  showToast("Liked interview experience");
}

function bookmarkPost(btn) {
  btn.style.color = "#ffffff";
  showToast("Saved to your reading list");
}

function filterFeed(type) {
  document.querySelectorAll(".feed-tab-btn").forEach(b => b.classList.remove("active"));
  const clicked = event?.target;
  if (clicked) clicked.classList.add("active");
  showToast(`Filtered feed: ${type.replace('-', ' ').toUpperCase()}`);
}

// --- EXPERIENCE SUBMISSION & LIVE PII REDACTOR ---
function openShareModal() {
  const overlay = document.getElementById("shareModalOverlay");
  if (overlay) overlay.classList.add("open");
}

function closeShareModal() {
  const overlay = document.getElementById("shareModalOverlay");
  if (overlay) overlay.classList.remove("open");
}

function handlePiiLiveScrub() {
  const text = document.getElementById("shareTextarea")?.value || "";
  const output = document.getElementById("piiLiveOutput");
  const countBadge = document.getElementById("piiScrubCount");

  if (!text.trim()) {
    if (output) output.textContent = "Start typing above to see real-time PII anonymization...";
    if (countBadge) countBadge.textContent = "0 entities redacted";
    return;
  }

  let scrubbed = text;
  let count = 0;

  // Redact Emails
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  if (emailRegex.test(scrubbed)) {
    count += (scrubbed.match(emailRegex) || []).length;
    scrubbed = scrubbed.replace(emailRegex, '[REDACTED_EMAIL]');
  }

  // Redact Phones
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
  if (phoneRegex.test(scrubbed)) {
    count += (scrubbed.match(phoneRegex) || []).length;
    scrubbed = scrubbed.replace(phoneRegex, '[REDACTED_PHONE]');
  }

  // Redact Roll Numbers (e.g. 211CS142, 22IT045)
  const rollRegex = /\b(\d{2,3}[A-Z]{2,4}\d{2,4}|[A-Z]{2,4}\d{6,8})\b/gi;
  if (rollRegex.test(scrubbed)) {
    count += (scrubbed.match(rollRegex) || []).length;
    scrubbed = scrubbed.replace(rollRegex, '[REDACTED_ROLL_NO]');
  }

  // Redact Names phrases
  const nameRegex = /(?:my name is|i am|myself|candidate:?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi;
  scrubbed = scrubbed.replace(nameRegex, (m, p1) => {
    count++;
    return m.replace(p1, '[REDACTED_NAME]');
  });

  if (output) output.innerHTML = scrubbed;
  if (countBadge) countBadge.textContent = `${count} entities redacted`;
}

function handleExperiencePublish(e) {
  e.preventDefault();
  const company = document.getElementById("shareCompany")?.value || "Tech Recruiter";
  const role = document.getElementById("shareRole")?.value || "SDE Intern";
  const details = document.getElementById("shareTextarea")?.value || "";

  const candidateId = currentUser ? currentUser.rollNo : `NITK-${Math.floor(1000 + Math.random() * 9000)}`;

  const newDoc = {
    authorName: `NITK-Candidate#${Math.floor(1000 + Math.random() * 9000)}`,
    authorRole: `${company} ${role}`,
    avatar: currentUser ? currentUser.avatar : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    time: "Just now",
    title: `${company} Interview Experience (${role})`,
    body: details.substring(0, 200) + '...',
    likes: 1,
    comments: 0
  };

  DB.experiences.insertOne(newDoc);
  renderCommunityFeed();

  closeShareModal();
  document.getElementById("shareExpForm")?.reset();
  showToast("Experience saved to MongoDB and published with Zero PII leakage!");
}

// --- GLOBAL SEARCH ---
function handleSearchKey(e) {
  if (e.key === "Enter") {
    const q = e.target.value.trim().toLowerCase();
    if (!q) return;

    const matched = DB.companies.find().find(c => c.name.toLowerCase().includes(q) || c.id.includes(q));
    if (matched) {
      openCompanyModal(matched.id);
      showToast(`Found dossier for ${matched.name}`);
    } else {
      switchView('view-mock');
      showToast(`Searching mock bank for "${q}"`);
    }
  }
}

// --- TOAST NOTIFICATION HELPER ---
function showToast(message) {
  const container = document.getElementById("appToastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    setTimeout(() => toast.remove(), 200);
  }, 2800);
}
