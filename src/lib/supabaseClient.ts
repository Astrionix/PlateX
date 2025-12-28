import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

import { CapacitorStorage } from './capacitorStorage';

// For backward compatibility - default export
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            storage: {
                getItem: (key) => CapacitorStorage.getItem(key),
                setItem: (key, value) => CapacitorStorage.setItem(key, value),
                removeItem: (key) => CapacitorStorage.removeItem(key),
            },
        },
    }
);
