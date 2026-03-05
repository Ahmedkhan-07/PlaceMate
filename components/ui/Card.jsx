'use client';

export default function Card({ children, className = '', hover = false, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`
        bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl shadow-card
        ${hover ? 'hover:shadow-card-hover transition-shadow duration-200 cursor-pointer' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`px-6 py-4 border-b border-border dark:border-gray-700 ${className}`}>
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
        <div className={`px-6 py-4 border-t border-border dark:border-gray-700 ${className}`}>
            {children}
        </div>
    );
}
