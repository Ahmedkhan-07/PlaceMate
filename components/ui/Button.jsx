'use client';
import { forwardRef } from 'react';

const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed',
    secondary: 'bg-white border border-border text-text-primary hover:border-primary hover:text-primary',
    outline: 'bg-transparent border border-border text-text-primary hover:border-primary hover:text-primary',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-background border-transparent',
    danger: 'bg-danger text-white hover:bg-danger-dark disabled:opacity-60 disabled:cursor-not-allowed',
    success: 'bg-success text-white hover:bg-success-dark disabled:opacity-60 disabled:cursor-not-allowed',
};

const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3.5 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
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
    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center gap-2 rounded-md font-semibold
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            style={externalStyle}
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
