import { useState } from 'react';

const STORAGE_KEY = 'oirs_merchant';

function readFromStorage() {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

export function useMerchantStorage() {
    const [merchant, setMerchant] = useState(readFromStorage);

    const save = (data) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            setMerchant(data);
        } catch {}
    };

    const clear = () => {
        localStorage.removeItem(STORAGE_KEY);
        setMerchant(null);
    };

    return { merchant, save, clear };
}
