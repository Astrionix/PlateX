export const GET_API_URL = (path: string) => {
    // In production (mobile), this should point to the deployed Vercel URL
    // In development, it falls back to empty string (relative path)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    // Ensure we don't end up with double slashes if path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
};
