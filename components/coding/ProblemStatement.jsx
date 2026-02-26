'use client';
import Badge from '@/components/ui/Badge';

const diffColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
};

export default function ProblemStatement({ problem }) {
    if (!problem) return (
        <div className="text-center py-12 text-gray-400">
            <p>Select a problem to get started</p>
        </div>
    );

    return (
        <div className="space-y-4 h-full overflow-auto">
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold text-white">{problem.title}</h2>
                <Badge variant={diffColors[problem.difficulty] || 'default'} className="shrink-0 capitalize">
                    {problem.difficulty}
                </Badge>
            </div>

            {problem.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {problem.tags.map(tag => (
                        <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
                    ))}
                </div>
            )}

            <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
            </div>

            {problem.examples?.map((ex, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-500">Example {i + 1}</p>
                    {ex.input && (
                        <div>
                            <span className="text-xs text-gray-400">Input: </span>
                            <code className="text-xs text-emerald-300">{ex.input}</code>
                        </div>
                    )}
                    {ex.output && (
                        <div>
                            <span className="text-xs text-gray-400">Output: </span>
                            <code className="text-xs text-emerald-300">{ex.output}</code>
                        </div>
                    )}
                    {ex.explanation && (
                        <p className="text-xs text-gray-500">{ex.explanation}</p>
                    )}
                </div>
            ))}

            {problem.constraints?.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Constraints</p>
                    <ul className="space-y-1">
                        {problem.constraints.map((c, i) => (
                            <li key={i} className="text-xs text-gray-500">• {c}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
