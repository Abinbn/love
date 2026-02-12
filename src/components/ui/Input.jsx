import { forwardRef } from 'react';

export const Input = forwardRef(({
    label,
    error,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                    {props.required && <span className="text-primary-500 ml-1">*</span>}
                </label>
            )}
            <input
                ref={ref}
                className={`input-field ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
