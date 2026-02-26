'use client';
import { forwardRef, useState } from 'react';

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    iconRight,
    className = '',
    type = 'text',
    ...props
}, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value !== undefined ? Boolean(props.value) : undefined;

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={label ? ' ' : props.placeholder}
                    className={`
            w-full bg-white border rounded-lg text-gray-900 text-sm
            placeholder-gray-400 transition-all duration-200
            focus:outline-none focus:ring-2
            ${error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-300 focus:border-emerald-600 focus:ring-emerald-600/20'
                        }
            ${label ? 'pt-5 pb-2' : 'py-2.5'}
            ${Icon ? 'pl-10' : 'pl-4'}
            ${iconRight ? 'pr-10' : 'pr-4'}
          `}
                    {...props}
                />
                {label && (
                    <label
                        className={`
              absolute left-${Icon ? '10' : '4'} transition-all duration-200 pointer-events-none font-medium
              ${(focused || hasValue || props.value)
                                ? 'top-1.5 text-xs text-emerald-700'
                                : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
                            }
            `}
                        style={{ left: Icon ? '2.5rem' : '1rem' }}
                    >
                        {label}
                    </label>
                )}
                {iconRight && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {iconRight}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export function Textarea({ label, error, className = '', ...props }) {
    return (
        <div className={`relative ${className}`}>
            <textarea
                placeholder={label || props.placeholder}
                className={`
          w-full bg-white border rounded-lg text-gray-900 text-sm px-4 py-2.5
          placeholder-gray-400 transition-all duration-200 resize-none
          focus:outline-none focus:ring-2
          ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-emerald-600 focus:ring-emerald-600/20'
                    }
        `}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

export function Select({ label, error, children, className = '', ...props }) {
    return (
        <div className={`${className}`}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
            <select
                className={`
          w-full bg-white border rounded-lg text-gray-900 text-sm px-4 py-2.5
          transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-2
          ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-emerald-600 focus:ring-emerald-600/20'
                    }
        `}
                {...props}
            >
                {children}
            </select>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default Input;
