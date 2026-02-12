import { forwardRef } from 'react';

export const Textarea = forwardRef(({
    label,
    error,
    maxLength,
    showCount = false,
    value = '',
    className = '',
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                        {label}
                        {props.required && <span className="text-primary-500 ml-1">*</span>}
                    </label>
                    {showCount && maxLength && (
                        <span className={`text-sm ${value.length > maxLength ? 'text-red-400' : 'text-gray-400'}`}>
                            {value.length}/{maxLength}
                        </span>
                    )}
                </div>
            )}
            <textarea
                ref={ref}
                value={value}
                maxLength={maxLength}
                className={`input-field resize-none ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';
