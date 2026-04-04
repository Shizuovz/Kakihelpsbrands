import { API_BASE_URL } from '@/config';

/**
 * Resolves a URL that might be relative (starting with /uploads/) 
 * by prepending the API_BASE_URL.
 * 
 * @param url The URL string to resolve
 * @returns The resolved absolute URL or the original URL if already absolute
 */
export const resolveApiUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  
  // If it's already an absolute URL (starts with http or https), return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative path starting with /uploads, prepend API_BASE_URL
  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`;
  }
  
  // For other relative paths (like /src/assets/...), return as is 
  // as they are handled by the build tool (Vite)
  return url;
};
