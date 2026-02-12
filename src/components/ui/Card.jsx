export const Card = ({ children, className = '', hover = false, ...props }) => {
    return (
        <div
            className={`card ${hover ? 'hover:scale-[1.02] cursor-pointer' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
