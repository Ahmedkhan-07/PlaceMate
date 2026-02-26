'use client';

export default function StudyProgress({ current, total }) {
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Progress</span>
                <span className="text-gray-700 font-medium">{current} / {total} cards</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-emerald-700 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <p className="text-xs text-gray-400 text-center">{pct}% complete</p>
        </div>
    );
}
