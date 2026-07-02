export default function InputField({ label, error, required, className = '', ...props }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <input
                className={`input-field ${error ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export function SelectField({ label, error, required, className = '', children, ...props }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <select
                className={`input-field ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
                {...props}
            >
                {children}
            </select>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export function TextareaField({ label, error, required, rows = 3, className = '', ...props }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <textarea
                rows={rows}
                className={`input-field resize-none ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
