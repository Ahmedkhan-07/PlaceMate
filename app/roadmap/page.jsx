'use client';
import AppLayout from '@/components/layout/AppLayout';
import { CheckCircle, Circle, ArrowRight, Lock } from 'lucide-react';

const ROADMAP = [
    {
        phase: 'Foundation',
        color: 'indigo',
        steps: [
            { label: 'Set up your profile', done: true },
            { label: 'Complete aptitude assessment', done: false },
            { label: 'Review basic DSA concepts', done: false },
        ],
    },
    {
        phase: 'Core Skills',
        color: 'emerald',
        steps: [
            { label: 'Practice 50 aptitude questions', done: false },
            { label: 'Solve 20 coding problems', done: false },
            { label: 'Complete technical MCQs (DSA, DBMS, OS)', done: false },
            { label: 'Study 100 flashcards', done: false },
        ],
    },
    {
        phase: 'Mock Experience',
        color: 'amber',
        steps: [
            { label: 'Complete first mock drive', done: false },
            { label: 'Score 70%+ in all rounds', done: false },
            { label: 'Earn first certificate', done: false },
        ],
    },
    {
        phase: 'Company Prep',
        color: 'sky',
        steps: [
            { label: 'Track 10+ target companies', done: false },
            { label: 'Practice company-specific questions', done: false },
            { label: 'Achieve 7-day streak', done: false },
        ],
    },
    {
        phase: 'Placement Ready',
        color: 'purple',
        steps: [
            { label: 'Reach top 10 on leaderboard', done: false },
            { label: 'Complete 3 mock drives', done: false },
            { label: 'All badges earned', done: false },
        ],
    },
];

const colorMap = {
    indigo: { dot: 'bg-primary', border: 'border-primary/20', bg: 'bg-blue-50', text: 'text-primary' },
    emerald: { dot: 'bg-blue-500', border: 'border-blue-500/20', bg: 'bg-blue-50', text: 'text-blue-600' },
    amber: { dot: 'bg-amber-500', border: 'border-amber-500/20', bg: 'bg-amber-50', text: 'text-amber-600' },
    sky: { dot: 'bg-sky-500', border: 'border-sky-500/20', bg: 'bg-sky-50', text: 'text-sky-600' },
    purple: { dot: 'bg-purple-500', border: 'border-purple-500/20', bg: 'bg-purple-50', text: 'text-purple-600' },
};

export default function RoadmapPage() {
    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Learning roadmap</h1>
                    <p className="text-text-secondary text-sm">Your step-by-step path to placement success</p>
                </div>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-border" />

                    <div className="space-y-6">
                        {ROADMAP.map((section, si) => {
                            const colors = colorMap[section.color];
                            return (
                                <div key={si} className="relative flex gap-4">
                                    <div className={`w-10 h-10 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0 z-10`}>
                                        <span className={`text-xs font-bold ${colors.text}`}>{si + 1}</span>
                                    </div>
                                    <div className={`flex-1 bg-white border ${colors.border} rounded-xl p-5`}>
                                        <h3 className={`font-semibold ${colors.text} mb-3`}>Phase {si + 1}: {section.phase}</h3>
                                        <div className="space-y-2.5">
                                            {section.steps.map((step, i) => (
                                                <div key={i} className="flex items-center gap-2.5">
                                                    {step.done
                                                        ? <CheckCircle className="h-4 w-4 text-success shrink-0" />
                                                        : <Circle className="h-4 w-4 text-slate-300 shrink-0" />
                                                    }
                                                    <span className={`text-sm ${step.done ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
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

                <div className="text-center py-4 text-xs text-text-secondary">
                    Complete activities on PlaceMate to unlock achievements and progress through the roadmap
                </div>
            </div>
        </AppLayout>
    );
}
