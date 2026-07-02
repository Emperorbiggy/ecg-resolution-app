export default function Stepper({ steps = [], currentStep = 0 }) {
    return (
        <div className="flex items-center gap-0">
            {steps.map((step, i) => {
                const done    = i < currentStep;
                const active  = i === currentStep;

                return (
                    <div key={i} className="flex items-center gap-0 flex-1 last:flex-none">
                        {/* Circle */}
                        <div className="flex flex-col items-center">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300
                                ${done    ? 'bg-brand-600 text-white'                      : ''}
                                ${active  ? 'bg-gradient-brand text-white shadow-brand'     : ''}
                                ${!done && !active ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500' : ''}
                            `}>
                                {done ? (
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    i + 1
                                )}
                            </div>
                            <span className={`mt-1 text-xs font-medium whitespace-nowrap
                                ${active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}
                            `}>
                                {step}
                            </span>
                        </div>

                        {/* Connector */}
                        {i < steps.length - 1 && (
                            <div className={`flex-1 h-px mx-2 mt-[-18px] transition-all duration-300
                                ${done ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}
                            `} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
