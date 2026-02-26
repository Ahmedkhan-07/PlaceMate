'use client';
import { CheckCircle } from 'lucide-react';

export default function QuestionCard({
    question,
    questionIndex,
    total,
    selectedAnswer,
    onSelect,
    showResult,
    correctAnswer,
}) {
    if (!question) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Question {questionIndex + 1} of {total}</span>
                {question.topic && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-600/20">
                        {question.topic}
                    </span>
                )}
            </div>

            <p className="text-base text-gray-900 leading-relaxed">{question.question}</p>

            <div className="space-y-2.5">
                {question.options?.map((option, i) => {
                    const isSelected = selectedAnswer?.trim().toLowerCase() === option?.trim().toLowerCase();
                    const isCorrectOption = showResult && correctAnswer?.trim().toLowerCase() === option?.trim().toLowerCase();
                    const isWrongSelection = showResult && isSelected && !isCorrectOption;

                    return (
                        <button
                            key={i}
                            onClick={() => !showResult && onSelect(option)}
                            disabled={showResult}
                            className={`
                w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200
                ${isCorrectOption
                                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                                    : isWrongSelection
                                        ? 'border-red-500/50 bg-red-500/10 text-red-300'
                                        : isSelected
                                            ? 'border-emerald-600/50 bg-emerald-50 text-emerald-800'
                                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
                                }
                ${showResult ? 'cursor-default' : 'cursor-pointer'}
              `}
                        >
                            <span className={`
                w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
                ${isCorrectOption ? 'bg-emerald-500 text-white' : isWrongSelection ? 'bg-red-500 text-white' : isSelected ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-700'}
              `}>
                                {isCorrectOption ? <CheckCircle className="h-4 w-4" /> : ['A', 'B', 'C', 'D'][i]}
                            </span>
                            <span className="text-sm">{option}</span>
                        </button>
                    );
                })}
            </div>

            {showResult && question.explanation && (
                <div className="p-4 rounded-xl bg-gray-100 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Explanation</p>
                    <p className="text-sm text-gray-500">{question.explanation}</p>
                </div>
            )}
        </div>
    );
}
