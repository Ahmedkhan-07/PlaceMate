'use client';

export default function Card({ children, className = '', hover = false, glow = false, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`
        bg-white border border-gray-200 rounded-xl shadow-card
        ${hover ? 'hover:border-emerald-500/50 hover:shadow-card-hover transition-all duration-200 cursor-pointer' : ''}
        ${glow ? 'shadow-lg shadow-emerald-500/10' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
            {children}
        </div>
    );
}

export function CardBody({ children, className = '' }) {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }) {
    return (
        <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
            {children}
        </div>
    );
}
