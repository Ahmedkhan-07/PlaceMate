'use client';
import AppLayout from '@/components/layout/AppLayout';
import { CheckCircle, Circle, Map } from 'lucide-react';

const ROADMAP = [
    {
        phase: 'Foundation', color: 'blue', icon: '🏗️',
        steps: [
            { label: 'Set up your profile', done: true },
            { label: 'Complete aptitude assessment', done: false },
            { label: 'Review basic DSA concepts', done: false },
        ],
    },
    {
        phase: 'Core Skills', color: 'emerald', icon: '🧩',
        steps: [
            { label: 'Practice 50 aptitude questions', done: false },
            { label: 'Solve 20 coding problems', done: false },
            { label: 'Complete technical MCQs (DSA, DBMS, OS)', done: false },
            { label: 'Study 100 flashcards', done: false },
        ],
    },
    {
        phase: 'Mock Experience', color: 'amber', icon: '🎯',
        steps: [
            { label: 'Complete first mock drive', done: false },
            { label: 'Score 70%+ in all rounds', done: false },
            { label: 'Earn first certificate', done: false },
        ],
    },
    {
        phase: 'Company Prep', color: 'sky', icon: '🏢',
        steps: [
            { label: 'Track 10+ target companies', done: false },
            { label: 'Practice company-specific questions', done: false },
            { label: 'Achieve 7-day streak', done: false },
        ],
    },
    {
        phase: 'Placement Ready', color: 'purple', icon: '🏆',
        steps: [
            { label: 'Reach top 10 on leaderboard', done: false },
            { label: 'Complete 3 mock drives', done: false },
            { label: 'All badges earned', done: false },
        ],
    },
];

const colorMap = {
    blue: { bar: 'from-blue-500 to-indigo-500', badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400', phase: 'text-blue-500 dark:text-blue-400', line: 'bg-blue-200 dark:bg-blue-800' },
    emerald: { bar: 'from-emerald-500 to-teal-500', badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', phase: 'text-emerald-600 dark:text-emerald-400', line: 'bg-emerald-200 dark:bg-emerald-800' },
    amber: { bar: 'from-amber-400 to-orange-500', badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400', phase: 'text-amber-600 dark:text-amber-400', line: 'bg-amber-200 dark:bg-amber-800' },
    sky: { bar: 'from-sky-500 to-cyan-500', badge: 'bg-sky-500/10 border-sky-500/30 text-sky-400', phase: 'text-sky-600 dark:text-sky-400', line: 'bg-sky-200 dark:bg-sky-800' },
    purple: { bar: 'from-purple-500 to-violet-500', badge: 'bg-purple-500/10 border-purple-500/30 text-purple-400', phase: 'text-purple-600 dark:text-purple-400', line: 'bg-purple-200 dark:bg-purple-800' },
};

export default function RoadmapPage() {
    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6 pb-10">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/20 to-purple-600/20 border border-sky-500/30 flex items-center justify-center">
                        <Map className="h-6 w-6 text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">Learning Roadmap</h1>
                        <p className="text-text-secondary dark:text-gray-400 text-sm">Your step-by-step path to placement success</p>
                    </div>
                </div>

                {/* Overall progress */}
                <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-text-primary dark:text-gray-100">Overall Progress</span>
                        <span className="text-xs font-bold text-primary">1/5 Phases</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '20%' }} />
                    </div>
                    <p className="text-xs text-text-secondary dark:text-gray-400 mt-2">Complete activities on PlaceMate to progress through phases</p>
                </div>

                {/* Phase list */}
                <div className="space-y-4">
                    {ROADMAP.map((section, si) => {
                        const c = colorMap[section.color];
                        const completedSteps = section.steps.filter(s => s.done).length;
                        const pct = Math.round((completedSteps / section.steps.length) * 100);
                        const isActive = si === 0;
                        const isLocked = si > 1;

                        return (
                            <div key={si} className={`rounded-2xl border bg-white dark:bg-gray-800 overflow-hidden transition-all ${isLocked ? 'opacity-60 border-border dark:border-gray-700' : 'border-border dark:border-gray-700 shadow-sm'}`}>
                                <div className={`h-1 bg-gradient-to-r ${c.bar}`} />
                                <div className="p-5 space-y-4">
                                    {/* Phase header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg ${c.badge}`}>
                                                {section.icon}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-text-primary dark:text-gray-100">Phase {si + 1}: {section.phase}</span>
                                                    {isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Current</span>}
                                                    {isLocked && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 font-medium">Locked</span>}
                                                </div>
                                                <span className="text-xs text-text-secondary dark:text-gray-400">{completedSteps}/{section.steps.length} tasks</span>
                                            </div>
                                        </div>
                                        <span className={`text-lg font-black ${c.phase}`}>{pct}%</span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-700">
                                        <div className={`h-1.5 rounded-full bg-gradient-to-r ${c.bar} transition-all`} style={{ width: `${pct}%` }} />
                                    </div>

                                    {/* Steps */}
                                    <div className="space-y-2">
                                        {section.steps.map((step, i) => (
                                            <div key={i} className="flex items-center gap-3 py-1">
                                                {step.done
                                                    ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                                                    : <Circle className={`h-4 w-4 shrink-0 ${isActive ? 'text-gray-300 dark:text-gray-600' : 'text-gray-200 dark:text-gray-700'}`} />
                                                }
                                                <span className={`text-sm transition-all ${step.done ? 'text-text-secondary dark:text-gray-500 line-through' : 'text-text-primary dark:text-gray-100'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
