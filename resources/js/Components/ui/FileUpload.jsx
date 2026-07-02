import { useRef, useState } from 'react';

export default function FileUpload({ onChange, error, accept = '.jpg,.jpeg,.png,.pdf', maxMb = 5 }) {
    const [drag, setDrag] = useState(false);
    const [file, setFile]  = useState(null);
    const inputRef = useRef(null);

    const handleFile = (f) => {
        if (!f) return;
        setFile(f);
        onChange?.(f);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDrag(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const ext = file?.name?.split('.').pop()?.toUpperCase();
    const isImage = file && ['jpg', 'jpeg', 'png'].includes(file.name.split('.').pop().toLowerCase());

    return (
        <div className="space-y-2">
            <div
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center
                    ${drag
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                        : error
                        ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
                        : 'border-slate-200 dark:border-slate-600 hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                />

                {file ? (
                    <div className="flex flex-col items-center gap-2">
                        {isImage ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="h-20 w-20 object-cover rounded-lg shadow"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                                <span className="text-lg font-bold text-red-600 dark:text-red-400">{ext}</span>
                            </div>
                        )}
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
                        <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p className="text-xs text-brand-600 dark:text-brand-400 underline">Click to change</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
                            <svg className="h-6 w-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                Drag & drop or <span className="text-brand-600 dark:text-brand-400">browse</span>
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                JPG, PNG, PDF · Max {maxMb}MB
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
