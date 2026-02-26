export default function DeveloperCredit() {
    const name = process.env.NEXT_PUBLIC_DEVELOPER_NAME;
    const linkedIn = process.env.NEXT_PUBLIC_DEVELOPER_LINKEDIN;

    if (!name) return null;

    return (
        <div className="fixed bottom-14 right-4 z-20">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-border rounded-xl px-3 py-1.5 text-xs text-textSecondary shadow-card">
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
                    <span className="font-semibold text-textPrimary">{name}</span>
                )}
            </div>
        </div>
    );
}
