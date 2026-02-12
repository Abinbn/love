import { useHaptic } from '@/hooks/useHaptic';

export const Button = ({
    children,
    variant = 'primary',
    onClick,
    type = 'button',
    disabled = false,
    className = '',
    ...props
}) => {
    const haptic = useHaptic();

    const handleClick = (e) => {
        haptic.light();
        if (onClick) onClick(e);
    };

    const baseClasses = 'font-semibold px-6 py-3 rounded-full transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'hover:bg-white/10 text-white',
    };

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
