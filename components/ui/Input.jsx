'use client';
import { forwardRef, useState } from 'react';

const Input = forwardRef(({
    label,
    required,
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
        <div className={`${className}`}>
            {label && (
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                    {label}{required && <span className="text-danger ml-0.5">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={props.placeholder || ' '}
                    className={`
            w-full bg-white border rounded-md text-text-primary text-sm
            placeholder:text-slate-400 transition-colors duration-200
            focus:outline-none focus:border-primary
            ${error
                            ? 'border-danger focus:border-danger'
                            : 'border-border'
                        }
            ${Icon ? 'pl-10' : 'px-3.5'}
            ${iconRight ? 'pr-10' : ''}
            py-2.5
          `}
                    {...props}
                />
                {iconRight && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {iconRight}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-[12px] text-danger">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export function Textarea({ label, required, error, className = '', ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                    {label}{required && <span className="text-danger ml-0.5">*</span>}
                </label>
            )}
            <textarea
                placeholder={props.placeholder || ' '}
                className={`
          w-full bg-white border rounded-md text-text-primary text-sm px-3.5 py-2.5
          placeholder:text-slate-400 transition-colors duration-200 resize-none
          focus:outline-none focus:border-primary
          ${error ? 'border-danger focus:border-danger' : 'border-border'}
        `}
                {...props}
            />
            {error && <p className="mt-1 text-[12px] text-danger">{error}</p>}
        </div>
    );
}

export function Select({ label, required, error, children, className = '', ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                    {label}{required && <span className="text-danger ml-0.5">*</span>}
                </label>
            )}
            <select
                className={`
          w-full bg-white border rounded-md text-text-primary text-sm px-3.5 py-2.5
          transition-colors duration-200 cursor-pointer appearance-none
          focus:outline-none focus:border-primary
          ${error ? 'border-danger focus:border-danger' : 'border-border'}
        `}
                {...props}
            >
                {children}
            </select>
            {error && <p className="mt-1 text-[12px] text-danger">{error}</p>}
        </div>
    );
}

export default Input;
