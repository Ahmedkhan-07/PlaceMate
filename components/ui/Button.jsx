'use client';
import { forwardRef } from 'react';

const variants = {
    primary: '',  // uses inline gradient style
    secondary: 'bg-white border border-border text-primary hover:bg-background',
    outline: 'border border-border hover:border-primary text-text-primary hover:text-primary bg-transparent',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-background bg-transparent',
    danger: '',  // uses inline gradient
    success: '', // uses inline gradient
};

const gradients = {
    primary: 'linear-gradient(135deg, #2563EB, #6366F1)',
    danger: 'linear-gradient(135deg, #DC2626, #EF4444)',
    success: 'linear-gradient(135deg, #16A34A, #22C55E)',
};

const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
};

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    icon: Icon,
    iconRight: IconRight,
    fullWidth = false,
    style: externalStyle = {},
    ...props
}, ref) => {
    const hasGradient = ['primary', 'danger', 'success'].includes(variant);
    const gradientStyle = hasGradient ? {
        background: gradients[variant],
        color: 'white',
        boxShadow: disabled ? 'none' : '0 2px 8px rgba(0,0,0,0.15)',
    } : {};

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:-translate-y-0.5 hover:shadow-md active:scale-95
        ${variants[variant] || ''}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            style={{ ...gradientStyle, ...externalStyle }}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : Icon ? (
                <Icon className="h-4 w-4 shrink-0" />
            ) : null}
            {children}
            {IconRight && !loading && <IconRight className="h-4 w-4 shrink-0" />}
        </button>
    );
});

Button.displayName = 'Button';
export default Button;
