'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Search, ChevronDown, ChevronUp, ExternalLink, CheckSquare, Square, BookOpen, Lightbulb, Code2 } from 'lucide-react';

const companyPrepData = [
    {
        name: "Google",
        logo: "🔵",
        difficulty: "Very Hard",
        topics: [
            "Arrays and Strings", "Dynamic Programming", "Graphs and Trees",
            "System Design", "OS Concepts", "Distributed Systems"
        ],
        interviewProcess: [
            "1-2 Phone screens with coding questions",
            "4-5 Onsite rounds — 3 coding + 1 system design + 1 Googleyness",
            "Focus heavily on optimal solutions and time complexity",
            "Expect follow up questions to optimize your solution further",
            "Behavioral questions around leadership and problem solving"
        ],
        leetcodeQuestions: [
            { title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", difficulty: "Easy" },
            { title: "Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", difficulty: "Medium" },
            { title: "Median of Two Sorted Arrays", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", difficulty: "Hard" },
            { title: "Word Ladder", url: "https://leetcode.com/problems/word-ladder/", difficulty: "Hard" },
            { title: "Serialize and Deserialize Binary Tree", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", difficulty: "Hard" },
            { title: "Course Schedule", url: "https://leetcode.com/problems/course-schedule/", difficulty: "Medium" },
            { title: "Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water/", difficulty: "Hard" },
            { title: "Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring/", difficulty: "Hard" }
        ]
    },
    {
        name: "Amazon",
        logo: "🟠",
        difficulty: "Hard",
        topics: [
            "Arrays", "Trees and Graphs", "Dynamic Programming",
            "Leadership Principles", "System Design", "OOPs"
        ],
        interviewProcess: [
            "Online Assessment — 2 coding problems in 90 minutes on HackerRank",
            "2-3 Technical rounds focused on DSA and LP questions",
            "1 Bar Raiser round — toughest round, focus on leadership principles",
            "Every answer must follow STAR format for behavioral questions",
            "14 Leadership Principles must be memorized and applied in answers"
        ],
        leetcodeQuestions: [
            { title: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/", difficulty: "Medium" },
            { title: "LRU Cache", url: "https://leetcode.com/problems/lru-cache/", difficulty: "Medium" },
            { title: "Meeting Rooms II", url: "https://leetcode.com/problems/meeting-rooms-ii/", difficulty: "Medium" },
            { title: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges/", difficulty: "Medium" },
            { title: "Word Break", url: "https://leetcode.com/problems/word-break/", difficulty: "Medium" },
            { title: "Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/", difficulty: "Medium" },
            { title: "Binary Tree Right Side View", url: "https://leetcode.com/problems/binary-tree-right-side-view/", difficulty: "Medium" },
            { title: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements/", difficulty: "Medium" }
        ]
    },
    {
        name: "Microsoft",
        logo: "🪟",
        difficulty: "Hard",
        topics: [
            "Arrays and Linked Lists", "Trees and Graphs", "Dynamic Programming",
            "System Design", "OOPs and Design Patterns", "OS and Networking"
        ],
        interviewProcess: [
            "Online Assessment — 3 coding problems in 75 minutes",
            "4-5 rounds — mix of coding, system design, and behavioral",
            "Focus on code quality and clean readable solutions",
            "Expect questions on design patterns and OOP principles",
            "Strong emphasis on communication and explaining your thought process"
        ],
        leetcodeQuestions: [
            { title: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", difficulty: "Easy" },
            { title: "Clone Graph", url: "https://leetcode.com/problems/clone-graph/", difficulty: "Medium" },
            { title: "Longest Palindromic Substring", url: "https://leetcode.com/problems/longest-palindromic-substring/", difficulty: "Medium" },
            { title: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", difficulty: "Easy" },
            { title: "Design HashMap", url: "https://leetcode.com/problems/design-hashmap/", difficulty: "Easy" },
            { title: "Spiral Matrix", url: "https://leetcode.com/problems/spiral-matrix/", difficulty: "Medium" },
            { title: "Maximum Depth of Binary Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", difficulty: "Easy" },
            { title: "Pacific Atlantic Water Flow", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", difficulty: "Medium" }
        ]
    },
    {
        name: "TCS",
        logo: "🔷",
        difficulty: "Easy",
        topics: [
            "Aptitude and Reasoning", "Basic Programming", "Verbal Ability",
            "Basic Data Structures", "DBMS Basics", "Networking Basics"
        ],
        interviewProcess: [
            "TCS NQT — National Qualifier Test with aptitude, reasoning, verbal, coding",
            "Technical Interview — basic CS fundamentals and one programming language",
            "HR Interview — standard HR questions about yourself and career goals",
            "Focus on communication skills and basic programming knowledge",
            "Know at least one language well — C, Java, or Python"
        ],
        leetcodeQuestions: [
            { title: "Reverse String", url: "https://leetcode.com/problems/reverse-string/", difficulty: "Easy" },
            { title: "Fibonacci Number", url: "https://leetcode.com/problems/fibonacci-number/", difficulty: "Easy" },
            { title: "Palindrome Number", url: "https://leetcode.com/problems/palindrome-number/", difficulty: "Easy" },
            { title: "FizzBuzz", url: "https://leetcode.com/problems/fizz-buzz/", difficulty: "Easy" },
            { title: "Count Primes", url: "https://leetcode.com/problems/count-primes/", difficulty: "Medium" },
            { title: "Single Number", url: "https://leetcode.com/problems/single-number/", difficulty: "Easy" },
            { title: "Missing Number", url: "https://leetcode.com/problems/missing-number/", difficulty: "Easy" },
            { title: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", difficulty: "Easy" }
        ]
    },
    {
        name: "Infosys",
        logo: "🟢",
        difficulty: "Easy",
        topics: [
            "Aptitude", "Logical Reasoning", "Verbal English",
            "Basic Programming", "Pseudocode", "Data Structures Basics"
        ],
        interviewProcess: [
            "InfyTQ or Infosys Certification — online exam with aptitude and coding",
            "Technical Interview — basic programming and CS concepts",
            "HR Interview — career goals, strengths, weaknesses",
            "Focus on problem solving approach not just correct answer",
            "Good communication skills are very important for selection"
        ],
        leetcodeQuestions: [
            { title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", difficulty: "Easy" },
            { title: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", difficulty: "Easy" },
            { title: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", difficulty: "Easy" },
            { title: "Maximum Subarray", url: "https://leetcode.com/problems/maximum-subarray/", difficulty: "Medium" },
            { title: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", difficulty: "Easy" },
            { title: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate/", difficulty: "Easy" },
            { title: "Majority Element", url: "https://leetcode.com/problems/majority-element/", difficulty: "Easy" },
            { title: "Move Zeroes", url: "https://leetcode.com/problems/move-zeroes/", difficulty: "Easy" }
        ]
    },
    {
        name: "Wipro",
        logo: "🟡",
        difficulty: "Easy",
        topics: [
            "Aptitude", "Logical Reasoning", "Verbal Ability",
            "Basic Coding", "OOPs Concepts", "DBMS"
        ],
        interviewProcess: [
            "WILP or Elite/Turbo online test — aptitude and coding",
            "Technical Interview — OOPs, DBMS, basic coding",
            "HR Interview — standard questions",
            "Focus on OOPs concepts — inheritance, polymorphism, encapsulation",
            "Know SQL queries well — joins, subqueries, aggregations"
        ],
        leetcodeQuestions: [
            { title: "Reverse Integer", url: "https://leetcode.com/problems/reverse-integer/", difficulty: "Medium" },
            { title: "String to Integer", url: "https://leetcode.com/problems/string-to-integer-atoi/", difficulty: "Medium" },
            { title: "Implement strStr", url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/", difficulty: "Easy" },
            { title: "Remove Duplicates from Sorted Array", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", difficulty: "Easy" },
            { title: "Pascal Triangle", url: "https://leetcode.com/problems/pascals-triangle/", difficulty: "Easy" },
            { title: "Best Time to Buy and Sell Stock II", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/", difficulty: "Medium" },
            { title: "Intersection of Two Arrays", url: "https://leetcode.com/problems/intersection-of-two-arrays/", difficulty: "Easy" },
            { title: "Power of Two", url: "https://leetcode.com/problems/power-of-two/", difficulty: "Easy" }
        ]
    },
    {
        name: "Zoho",
        logo: "🔴",
        difficulty: "Medium",
        topics: [
            "Core Java or C++", "Data Structures", "Problem Solving",
            "DBMS and SQL", "OOPs", "Puzzles and Logic"
        ],
        interviewProcess: [
            "Written test — aptitude and programming on paper",
            "Advanced programming round — complex coding problems",
            "Technical Interview 1 — DSA and programming",
            "Technical Interview 2 — project discussion and advanced concepts",
            "HR Interview — culture fit and career goals",
            "Zoho focuses heavily on pure coding ability not communication"
        ],
        leetcodeQuestions: [
            { title: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/", difficulty: "Medium" },
            { title: "Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self/", difficulty: "Medium" },
            { title: "Find Minimum in Rotated Sorted Array", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", difficulty: "Medium" },
            { title: "3Sum", url: "https://leetcode.com/problems/3sum/", difficulty: "Medium" },
            { title: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", difficulty: "Medium" },
            { title: "Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle/", difficulty: "Easy" },
            { title: "Binary Search", url: "https://leetcode.com/problems/binary-search/", difficulty: "Easy" },
            { title: "Kth Largest Element", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", difficulty: "Medium" }
        ]
    },
    {
        name: "Flipkart",
        logo: "💛",
        difficulty: "Hard",
        topics: [
            "Data Structures and Algorithms", "System Design", "OOPs",
            "Database Design", "Problem Solving", "Product Thinking"
        ],
        interviewProcess: [
            "Online Coding Test — 3 problems in 90 minutes on HackerEarth",
            "3-4 Technical rounds — DSA heavy with system design",
            "Focus on scalable system design for e-commerce scenarios",
            "Expect questions on database design and caching strategies",
            "Product sense questions — how would you improve Flipkart feature"
        ],
        leetcodeQuestions: [
            { title: "Lowest Common Ancestor", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", difficulty: "Medium" },
            { title: "Flatten Binary Tree to Linked List", url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/", difficulty: "Medium" },
            { title: "Decode Ways", url: "https://leetcode.com/problems/decode-ways/", difficulty: "Medium" },
            { title: "Jump Game", url: "https://leetcode.com/problems/jump-game/", difficulty: "Medium" },
            { title: "Edit Distance", url: "https://leetcode.com/problems/edit-distance/", difficulty: "Hard" },
            { title: "Sudoku Solver", url: "https://leetcode.com/problems/sudoku-solver/", difficulty: "Hard" },
            { title: "Maximum Product Subarray", url: "https://leetcode.com/problems/maximum-product-subarray/", difficulty: "Medium" },
            { title: "Find Peak Element", url: "https://leetcode.com/problems/find-peak-element/", difficulty: "Medium" }
        ]
    },
    {
        name: "Razorpay",
        logo: "🔵",
        difficulty: "Hard",
        topics: [
            "System Design", "Backend Development", "DSA",
            "Database Design", "Payment Systems", "API Design"
        ],
        interviewProcess: [
            "Online Assessment — DSA problems and system design questions",
            "Technical rounds focused on backend and system design",
            "Expect questions on payment gateways and fintech concepts",
            "Strong focus on API design and database optimization",
            "Know distributed systems and microservices architecture"
        ],
        leetcodeQuestions: [
            { title: "Design Twitter", url: "https://leetcode.com/problems/design-twitter/", difficulty: "Medium" },
            { title: "Insert Delete GetRandom", url: "https://leetcode.com/problems/insert-delete-getrandom-o1/", difficulty: "Medium" },
            { title: "Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/", difficulty: "Hard" },
            { title: "Sliding Window Maximum", url: "https://leetcode.com/problems/sliding-window-maximum/", difficulty: "Hard" },
            { title: "Design Search Autocomplete", url: "https://leetcode.com/problems/design-search-autocomplete-system/", difficulty: "Hard" },
            { title: "Task Scheduler", url: "https://leetcode.com/problems/task-scheduler/", difficulty: "Medium" },
            { title: "Implement Trie", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", difficulty: "Medium" },
            { title: "Word Search II", url: "https://leetcode.com/problems/word-search-ii/", difficulty: "Hard" }
        ]
    },
    {
        name: "Swiggy",
        logo: "🟠",
        difficulty: "Hard",
        topics: [
            "DSA", "System Design", "Backend Engineering",
            "Location Based Systems", "Real Time Processing", "OOPs"
        ],
        interviewProcess: [
            "Online Assessment — 2-3 coding problems",
            "Technical rounds — DSA and system design",
            "Expect system design around food delivery and location tracking",
            "Focus on real time systems and optimization problems",
            "Product thinking questions around Swiggy features"
        ],
        leetcodeQuestions: [
            { title: "Shortest Path in Binary Matrix", url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/", difficulty: "Medium" },
            { title: "Network Delay Time", url: "https://leetcode.com/problems/network-delay-time/", difficulty: "Medium" },
            { title: "Minimum Cost to Connect All Points", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/", difficulty: "Medium" },
            { title: "Path With Minimum Effort", url: "https://leetcode.com/problems/path-with-minimum-effort/", difficulty: "Medium" },
            { title: "Cheapest Flights Within K Stops", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", difficulty: "Medium" },
            { title: "Critical Connections in Network", url: "https://leetcode.com/problems/critical-connections-in-a-network/", difficulty: "Hard" },
            { title: "Reconstruct Itinerary", url: "https://leetcode.com/problems/reconstruct-itinerary/", difficulty: "Hard" },
            { title: "Swim in Rising Water", url: "https://leetcode.com/problems/swim-in-rising-water/", difficulty: "Hard" }
        ]
    }
];

const DIFFICULTY_CONFIG = {
    'Easy': { bg: '#D1FAE5', text: '#065F46', bar: '#10B981' },
    'Medium': { bg: '#FEF3C7', text: '#92400E', bar: '#F59E0B' },
    'Hard': { bg: '#FEE2E2', text: '#991B1B', bar: '#EF4444' },
    'Very Hard': { bg: '#EDE9FE', text: '#5B21B6', bar: '#8B5CF6' },
};

const TABS = ['Topics', 'Interview Process', 'LeetCode Questions'];

const LSKEY = 'placemate_company_prep_done';

function getDone() {
    try { return JSON.parse(localStorage.getItem(LSKEY) || '{}'); } catch { return {}; }
}
function setDone(data) {
    localStorage.setItem(LSKEY, JSON.stringify(data));
}

function DifficultyBadge({ difficulty, size = 'sm' }) {
    const cfg = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG['Easy'];
    return (
        <span
            className={`inline-flex items-center font-semibold rounded-full ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'}`}
            style={{ background: cfg.bg, color: cfg.text }}
        >
            {difficulty}
        </span>
    );
}

function ProgressBar({ done, total, difficulty }) {
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    const cfg = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG['Easy'];
    return (
        <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500 font-medium">{done}/{total} solved</span>
                <span className="text-xs font-bold" style={{ color: cfg.bar }}>{pct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: cfg.bar }}
                />
            </div>
        </div>
    );
}

function CompanyCard({ company, done, onToggleDone }) {
    const [expanded, setExpanded] = useState(false);
    const [tab, setTab] = useState(0);

    const doneKeys = done[company.name] || {};
    const doneCount = Object.values(doneKeys).filter(Boolean).length;
    const total = company.leetcodeQuestions.length;

    const handleToggle = (e) => {
        e.stopPropagation();
        // handled inside
    };

    return (
        <div
            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${expanded ? 'border-blue-300 shadow-lg shadow-blue-50' : 'border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer'}`}
            style={{ transition: 'all 0.2s ease' }}
        >
            {/* Card header */}
            <div
                className="p-5 flex items-start gap-4 cursor-pointer select-none"
                onClick={() => setExpanded(e => !e)}
            >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: 'linear-gradient(135deg, #F8FAFF, #EFF6FF)', border: '1px solid #DBEAFE' }}>
                    {company.logo}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-800 text-base">{company.name}</h3>
                        <DifficultyBadge difficulty={company.difficulty} />
                    </div>
                    <ProgressBar done={doneCount} total={total} difficulty={company.difficulty} />
                </div>
                <div className="shrink-0 text-slate-400 mt-1">
                    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </div>

            {/* Expanded detail */}
            {expanded && (
                <div className="border-t border-slate-100">
                    {/* Tab bar */}
                    <div className="flex border-b border-slate-100 bg-slate-50/60">
                        {TABS.map((t, i) => (
                            <button
                                key={t}
                                onClick={() => setTab(i)}
                                className={`flex-1 py-3 text-xs font-semibold transition-all ${tab === i
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                    : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {t === 'Topics' && <BookOpen size={12} className="inline mr-1 mb-0.5" />}
                                {t === 'Interview Process' && <Lightbulb size={12} className="inline mr-1 mb-0.5" />}
                                {t === 'LeetCode Questions' && <Code2 size={12} className="inline mr-1 mb-0.5" />}
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="p-5">
                        {/* Tab 0: Topics */}
                        {tab === 0 && (
                            <div className="flex flex-wrap gap-2">
                                {company.topics.map(topic => (
                                    <span
                                        key={topic}
                                        className="px-3 py-1.5 rounded-xl text-xs font-medium"
                                        style={{ background: 'linear-gradient(135deg, #EFF6FF, #F0F4FF)', color: '#2563EB', border: '1px solid #DBEAFE' }}
                                    >
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Tab 1: Interview Process */}
                        {tab === 1 && (
                            <ol className="space-y-3">
                                {company.interviewProcess.map((step, i) => (
                                    <li key={i} className="flex gap-3 items-start">
                                        <span
                                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                                            style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}
                                        >
                                            {i + 1}
                                        </span>
                                        <span className="text-sm text-slate-700 leading-relaxed">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        )}

                        {/* Tab 2: LeetCode Questions */}
                        {tab === 2 && (
                            <div className="space-y-2">
                                {company.leetcodeQuestions.map((q, i) => {
                                    const key = `${company.name}__${i}`;
                                    const isDone = !!(done[company.name]?.[i]);
                                    return (
                                        <div
                                            key={i}
                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isDone ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100 hover:bg-blue-50 hover:border-blue-100'}`}
                                        >
                                            <button
                                                onClick={() => onToggleDone(company.name, i)}
                                                className="shrink-0 text-slate-400 hover:text-green-500 transition-colors"
                                                title={isDone ? 'Mark as not done' : 'Mark as done'}
                                            >
                                                {isDone
                                                    ? <CheckSquare size={18} className="text-green-500" />
                                                    : <Square size={18} />
                                                }
                                            </button>
                                            <a
                                                href={q.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex-1 text-sm font-medium hover:underline flex items-center gap-1 ${isDone ? 'line-through text-slate-400' : 'text-slate-700'}`}
                                            >
                                                {q.title}
                                                <ExternalLink size={11} className="text-slate-400 shrink-0" />
                                            </a>
                                            <DifficultyBadge difficulty={q.difficulty} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const DIFFICULTY_FILTERS = ['All', 'Easy', 'Medium', 'Hard', 'Very Hard'];

export default function CompanyPrepPage() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [done, setDoneState] = useState({});

    useEffect(() => {
        setDoneState(getDone());
    }, []);

    const handleToggleDone = (companyName, idx) => {
        setDoneState(prev => {
            const next = { ...prev, [companyName]: { ...(prev[companyName] || {}) } };
            next[companyName][idx] = !next[companyName][idx];
            setDone(next);
            return next;
        });
    };

    const filtered = companyPrepData.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'All' || c.difficulty === filter;
        return matchSearch && matchFilter;
    });

    // Aggregate stats
    const totalQ = companyPrepData.reduce((a, c) => a + c.leetcodeQuestions.length, 0);
    const solvedQ = companyPrepData.reduce((a, c) => {
        return a + Object.values(done[c.name] || {}).filter(Boolean).length;
    }, 0);

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Company Prep 🏢</h1>
                        <p className="text-text-secondary text-sm mt-1">Interview guides, topics & LeetCode questions by company</p>
                    </div>
                    <div
                        className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-slate-200"
                        style={{ background: 'linear-gradient(135deg, #EFF6FF, #F5F3FF)' }}
                    >
                        <div className="text-center">
                            <div className="text-lg font-black text-blue-600">{solvedQ}</div>
                            <div className="text-xs text-slate-500">Solved</div>
                        </div>
                        <div className="w-px h-8 bg-slate-200" />
                        <div className="text-center">
                            <div className="text-lg font-black text-slate-700">{totalQ}</div>
                            <div className="text-xs text-slate-500">Total</div>
                        </div>
                    </div>
                </div>

                {/* Search + Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search company..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>

                    {/* Difficulty filter */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {DIFFICULTY_FILTERS.map(d => {
                            const active = filter === d;
                            const cfg = DIFFICULTY_CONFIG[d];
                            return (
                                <button
                                    key={d}
                                    onClick={() => setFilter(d)}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${active
                                        ? d === 'All'
                                            ? 'bg-slate-800 text-white border-slate-800'
                                            : ''
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                    style={active && d !== 'All' ? { background: cfg?.bg, color: cfg?.text, borderColor: cfg?.bar } : {}}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Company grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="font-medium">No companies found</p>
                        <p className="text-sm mt-1">Try a different search or filter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filtered.map(company => (
                            <CompanyCard
                                key={company.name}
                                company={company}
                                done={done}
                                onToggleDone={handleToggleDone}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
