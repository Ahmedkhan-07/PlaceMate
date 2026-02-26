'use client';

const variants = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    gold: 'bg-amber-50 text-amber-700 border border-amber-200',
};

const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
};

export default function Badge({ children, variant = 'default', size = 'md', className = '', dot = false }) {
    return (
        <span className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
            {dot && (
                <span className={`
          h-1.5 w-1.5 rounded-full
          ${variant === 'success' ? 'bg-emerald-500' :
                        variant === 'warning' ? 'bg-amber-500' :
                            variant === 'danger' ? 'bg-red-500' :
                                variant === 'primary' ? 'bg-emerald-600' : 'bg-gray-400'}
          animate-pulse
        `} />
            )}
            {children}
        </span>
    );
}
