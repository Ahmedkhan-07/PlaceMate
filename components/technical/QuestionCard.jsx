'use client';
import { CheckCircle } from 'lucide-react';

export default function TechnicalQuestionCard({ question, index, total, selectedAnswer, onSelect, showResult }) {
    if (!question) return null;

    const isShort = question.type === 'short' || !question.options || question.options.length === 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Question {index + 1} of {total}</span>
                <div className="flex gap-1.5">
                    {question.category && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{question.category}</span>}
                    {isShort
                        ? <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">Short Answer</span>
                        : question.difficulty && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 dark:text-gray-400">{question.difficulty}</span>
                    }
                </div>
            </div>

            <div className="bg-gray-50/40 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <p className="text-base text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{question.question}</p>
                {question.code && (
                    <pre className="mt-3 p-3 rounded-lg bg-slate-950/60 text-emerald-300 text-sm font-mono overflow-auto border border-gray-200 dark:border-gray-700/30">
                        {question.code}
                    </pre>
                )}
            </div>

            {isShort ? (
                <div className="space-y-2">
                    <textarea
                        value={selectedAnswer || ''}
                        onChange={e => !showResult && onSelect(e.target.value)}
                        disabled={showResult}
                        rows={4}
                        placeholder="Write your answer here..."
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none focus:border-primary focus:outline-none transition-colors placeholder:text-gray-400"
                    />
                    {showResult && question.correctAnswer && (
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700">
                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Model Answer</p>
                            <p className="text-sm text-emerald-800 dark:text-emerald-300">{question.correctAnswer}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-2.5">
                    {question.options.map((option, i) => {
                        const isSelected = selectedAnswer?.trim().toLowerCase() === option?.trim().toLowerCase();
                        const isCorrectOption = showResult && question.correctAnswer?.trim().toLowerCase() === option?.trim().toLowerCase();
                        const isWrongSelection = showResult && isSelected && !isCorrectOption;

                        return (
                            <button
                                key={i}
                                onClick={() => !showResult && onSelect(option)}
                                disabled={showResult}
                                className={`
                  w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all
                  ${isCorrectOption ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                                        : isWrongSelection ? 'border-red-500/50 bg-red-500/10 text-red-300'
                                            : isSelected ? 'border-emerald-600/50 bg-emerald-50 text-emerald-800'
                                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 text-gray-700 dark:text-gray-300 hover:border-gray-300'}
                  ${showResult ? 'cursor-default' : 'cursor-pointer'}
                `}
                            >
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${isCorrectOption ? 'bg-emerald-500 text-white' : isWrongSelection ? 'bg-red-500 text-white' : isSelected ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-700 dark:text-gray-300'}`}>
                                    {isCorrectOption ? <CheckCircle className="h-4 w-4" /> : ['A', 'B', 'C', 'D'][i]}
                                </span>
                                <span className="text-sm">{option}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {showResult && question.explanation && (
                <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Explanation</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{question.explanation}</p>
                </div>
            )}
        </div>
    );
}
