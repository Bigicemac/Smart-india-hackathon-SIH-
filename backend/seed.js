require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Experience = require('./models/Experience');
const Company = require('./models/Company');
const Question = require('./models/Question');

const DEFAULT_USERS = [
  {
    name: 'Jaiwant', fullName: 'Jaiwant', email: 'jaiwant@nitk.edu.in', rollNo: '211CS142',
    password: 'password123', branch: 'Computer Science (CSE)', batch: '2026 Batch',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    readinessScore: 72, predictedTier: 'Very High', percentile: 'Top 30%', targetCompany: 'amazon',
    proficiencies: { dsa: 75, sys: 65, dbms: 80, os: 70, cn: 60 },
    recommendations: [
      { name: 'Amazon', role: 'SDE Intern', match: '88%', type: 'high', logo: 'a', color: '#ff9900', id: 'amazon' },
      { name: 'Microsoft', role: 'SDE Intern', match: '85%', type: 'high', logo: 'M', color: '#00a4ef', id: 'microsoft' },
      { name: 'Google', role: 'STEP Intern', match: '83%', type: 'high', logo: 'G', color: '#4285F4', id: 'google' },
      { name: 'Adobe', role: 'Research Intern', match: '76%', type: 'medium', logo: 'A', color: '#FA0F00', id: 'adobe' },
      { name: 'Atlassian', role: 'SWE Intern', match: '72%', type: 'medium', logo: '▲', color: '#0052CC', id: 'atlassian' },
    ],
  },
  {
    name: 'Ananya', fullName: 'Ananya Sharma', email: 'ananya.sharma@nitk.edu.in', rollNo: '211IT023',
    password: 'password123', branch: 'Information Tech (IT)', batch: '2025 Batch',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    readinessScore: 89, predictedTier: 'Elite Tier', percentile: 'Top 5%', targetCompany: 'microsoft',
    proficiencies: { dsa: 92, sys: 88, dbms: 90, os: 85, cn: 82 },
    recommendations: [
      { name: 'Microsoft', role: 'SWE FTE', match: '94%', type: 'high', logo: 'M', color: '#00a4ef', id: 'microsoft' },
      { name: 'Google', role: 'SWE-1', match: '91%', type: 'high', logo: 'G', color: '#4285F4', id: 'google' },
      { name: 'Amazon', role: 'SDE-1', match: '89%', type: 'high', logo: 'a', color: '#ff9900', id: 'amazon' },
      { name: 'Goldman Sachs', role: 'Summer Analyst', match: '87%', type: 'high', logo: 'GS', color: '#60a5fa', id: 'goldmansachs' },
      { name: 'Adobe', role: 'Research Intern', match: '84%', type: 'medium', logo: 'A', color: '#FA0F00', id: 'adobe' },
    ],
  },
  {
    name: 'Rohan', fullName: 'Rohan Verma', email: 'rohan.verma@nitk.edu.in', rollNo: '211EC088',
    password: 'password123', branch: 'Electronics (ECE)', batch: '2025 Batch',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    readinessScore: 94, predictedTier: 'Super Elite', percentile: 'Top 2%', targetCompany: 'amazon',
    proficiencies: { dsa: 96, sys: 92, dbms: 90, os: 94, cn: 88 },
    recommendations: [
      { name: 'Amazon', role: 'SDE II', match: '96%', type: 'high', logo: 'a', color: '#ff9900', id: 'amazon' },
      { name: 'Atlassian', role: 'SWE-2', match: '93%', type: 'high', logo: '▲', color: '#0052CC', id: 'atlassian' },
      { name: 'Google', role: 'SWE-2', match: '90%', type: 'high', logo: 'G', color: '#4285F4', id: 'google' },
      { name: 'Adobe', role: 'Member Tech Staff', match: '88%', type: 'high', logo: 'A', color: '#FA0F00', id: 'adobe' },
      { name: 'Microsoft', role: 'SDE-2', match: '86%', type: 'medium', logo: 'M', color: '#00a4ef', id: 'microsoft' },
    ],
  },
];

const DEFAULT_EXPERIENCES = [
  {
    authorName: 'Ananya Sharma', authorRole: "Microsoft SWE Intern '25",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    company: 'Microsoft', role: 'SDE Intern',
    title: 'Microsoft Interview Experience (SDE Intern)',
    body: 'Had my final round today. 3 coding rounds + 1 behavioral. Questions were on DP, Graphs and System Design. Overall a great experience!',
    likes: 124, comments: 27,
  },
  {
    authorName: 'Rohan Verma', authorRole: "Amazon SDE '24",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    company: 'Amazon', role: 'SDE II',
    title: 'Amazon offered 52 LPA for SDE II – Breakdown and Strategy',
    body: 'Received my offer letter today. Total CTC is 52 LPA (Fixed: 30, Bonus: 12, RSU: 10). Role is SDE II. Grateful to this community!',
    likes: 211, comments: 45,
  },
];

const DEFAULT_COMPANIES = [
  {
    id: 'amazon', name: 'Amazon', role: 'SDE Intern / FTE', logo: 'A', logoColor: '#ff9900',
    tier: 'Tier-1 Super Dream', ctc: '₹44.2 LPA', cutoff: '7.00+ CGPA',
    benchmark: { dsa: 90, sys: 85, dbms: 80, os: 75, cn: 70 },
    rounds: [
      { name: 'Online Assessment (OA)', pass: '22%' },
      { name: 'Tech Round 1 (DSA + LP)', pass: '45%' },
      { name: 'Tech Round 2 (LLD + LP)', pass: '50%' },
      { name: 'Bar Raiser Round', pass: '65%' },
    ],
    topics: ['Dynamic Programming (30%)', 'Trees & Graphs (25%)', 'HashMaps & Stacks (20%)', 'Leadership Principles (25%)'],
  },
  {
    id: 'microsoft', name: 'Microsoft', role: 'SDE Intern', logo: 'M', logoColor: '#00a4ef',
    tier: 'Tier-1 Super Dream', ctc: '₹42.0 LPA', cutoff: '7.50+ CGPA',
    benchmark: { dsa: 88, sys: 80, dbms: 85, os: 90, cn: 85 },
    rounds: [
      { name: 'Codility OA (3 Coding)', pass: '18%' },
      { name: 'Technical Round 1', pass: '45%' },
      { name: 'Technical Round 2 (OS/Systems)', pass: '55%' },
      { name: 'AA / Managerial Round', pass: '70%' },
    ],
    topics: ['Strings & Bit Manipulation (25%)', 'Trees & Recursion (25%)', 'OS & Concurrency (20%)', 'System Design (15%)'],
  },
  {
    id: 'google', name: 'Google', role: 'STEP Intern / SWE', logo: 'G', logoColor: '#4285f4',
    tier: 'Tier-1 Super Dream', ctc: '₹38.5 LPA', cutoff: '8.50+ CGPA',
    benchmark: { dsa: 95, sys: 80, dbms: 70, os: 85, cn: 75 },
    rounds: [
      { name: 'OA (2 Hard Problems)', pass: '12%' },
      { name: 'Tech Round 1 (Algorithms)', pass: '35%' },
      { name: 'Tech Round 2 (Data Structures)', pass: '50%' },
      { name: 'Googliness & Fitment', pass: '80%' },
    ],
    topics: ['Dynamic Programming (35%)', 'Graphs & Shortest Path (30%)', 'Tries & Strings (15%)', 'Segment Trees (10%)'],
  },
  {
    id: 'adobe', name: 'Adobe', role: 'Research Intern', logo: 'A', logoColor: '#fa0f00',
    tier: 'Tier-1 Super Dream', ctc: '₹40.0 LPA', cutoff: '7.50+ CGPA',
    benchmark: { dsa: 85, sys: 78, dbms: 75, os: 80, cn: 75 },
    rounds: [
      { name: 'OA (Coding + Aptitude)', pass: '20%' },
      { name: 'Tech Round 1 (DSA)', pass: '42%' },
      { name: 'Tech Round 2 (Research/Projects)', pass: '60%' },
    ],
    topics: ['Matrix DP & Graphs (30%)', 'Math & Probability (25%)', 'C++ Fundamentals (20%)', 'Trees (15%)'],
  },
  {
    id: 'atlassian', name: 'Atlassian', role: 'SWE Intern', logo: '▲', logoColor: '#0052cc',
    tier: 'Tier-1 Super Dream', ctc: '₹55.0 LPA', cutoff: '8.00+ CGPA',
    benchmark: { dsa: 92, sys: 88, dbms: 82, os: 80, cn: 78 },
    rounds: [
      { name: 'OA (3 Coding Problems)', pass: '15%' },
      { name: 'Tech Round 1 (Data Structures)', pass: '40%' },
      { name: 'Tech Round 2 (System Design/Values)', pass: '55%' },
    ],
    topics: ['Graph Traversals (30%)', 'Low-Level Design (25%)', 'DP on Strings (20%)', 'Values & Culture (25%)'],
  },
];

const DEFAULT_QUESTIONS = [
  {
    id: 'mq1', title: 'Trapping Rain Water (2D & 3D Variations)', company: 'Google / Amazon',
    topic: 'Dynamic Programming', difficulty: 'Hard',
    desc: 'Compute total units of water trapped after rain given elevation heights array.',
    solution: `int trap(vector<int>& h) {
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
}`,
  },
  {
    id: 'mq2', title: 'Design Thread-Safe LRU Cache with TTL', company: 'Amazon / D. E. Shaw',
    topic: 'Low-Level Design (LLD)', difficulty: 'Medium',
    desc: 'Implement LRU cache supporting O(1) get and put with thread synchronization.',
    solution: `class LRUCache {
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
};`,
  },
  {
    id: 'mq3', title: 'Course Schedule II (Topological Sort)', company: 'Microsoft / Uber',
    topic: 'Graphs & BFS', difficulty: 'Medium',
    desc: "Find ordering of courses you should take to finish all courses using Kahn's Algorithm.",
    solution: `vector<int> findOrder(int n, vector<vector<int>>& edges) {
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
}`,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('[seed] connected');

  for (const [label, Model, docs] of [
    ['users', User, DEFAULT_USERS],
    ['experiences', Experience, DEFAULT_EXPERIENCES],
    ['companies', Company, DEFAULT_COMPANIES],
    ['questions', Question, DEFAULT_QUESTIONS],
  ]) {
    const count = await Model.countDocuments();
    if (count > 0) {
      console.log(`[seed] ${label}: already has ${count} docs, skipping`);
      continue;
    }
    if (label === 'users') {
      for (const doc of docs) await User.create(doc);
    } else {
      await Model.insertMany(docs);
    }
    console.log(`[seed] ${label}: inserted ${docs.length} docs`);
  }

  await mongoose.disconnect();
  console.log('[seed] done');
}

seed().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});