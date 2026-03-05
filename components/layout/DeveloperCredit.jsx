export default function DeveloperCredit() {
    const name = process.env.NEXT_PUBLIC_DEVELOPER_NAME;
    const linkedIn = process.env.NEXT_PUBLIC_DEVELOPER_LINKEDIN;

    if (!name) return null;

    return (
        <div className="fixed bottom-14 right-4 z-20">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-border dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs text-textSecondary dark:text-gray-400 shadow-card">
                <span>Built by</span>
                {linkedIn ? (
                    <a
                        href={linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:underline"
                    >
                        {name}
                    </a>
                ) : (
                    <span className="font-semibold text-textPrimary dark:text-gray-100">{name}</span>
                )}
            </div>
        </div>
    );
}
