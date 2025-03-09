/**
 * Cache utility for API requests to Financial Modeling Prep
 * Provides persistent caching to reduce API calls and avoid rate limits
 */

import { API_CONFIG } from './config';

// Cache types
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache storage - uses localStorage for persistence
class PersistentCache {
  private readonly prefix: string = 'fmp_cache_';
  private readonly expiry: number;
  
  constructor(expiryMs: number = API_CONFIG.CACHE_DURATION) {
    this.expiry = expiryMs;
  }
  
  /**
   * Get an item from cache
   * @param key Cache key
   * @returns Cached data or null if not found/expired
   */
  get<T>(key: string): T | null {
    try {
      const storageKey = this.prefix + key;
      const cached = localStorage.getItem(storageKey);
      
      if (!cached) {
        return null;
      }
      
      const entry: CacheEntry<T> = JSON.parse(cached);
      
      // Check if the entry has expired
      if (Date.now() - entry.timestamp > this.expiry) {
        // Remove expired entry
        localStorage.removeItem(storageKey);
        return null;
      }
      
      return entry.data;
    } catch (error) {
      console.warn('Cache retrieval error:', error);
      return null;
    }
  }
  
  /**
   * Store an item in cache
   * @param key Cache key
   * @param data Data to cache
   */
  set<T>(key: string, data: T): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch (error) {
      console.warn('Cache storage error:', error);
    }
  }
  
  /**
   * Remove an item from cache
   * @param key Cache key
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.warn('Cache removal error:', error);
    }
  }
  
  /**
   * Clear all cached items for this application
   */
  clear(): void {
    try {
      // Only clear items with our prefix
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }
  
  /**
   * Get cache statistics
   * @returns Object with count and size information
   */
  getStats(): { count: number; sizeKB: number; oldestTimestamp: number | null } {
    try {
      let totalSize = 0;
      let count = 0;
      let oldestTimestamp: number | null = null;
      
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += value.length * 2; // Approximate size in bytes (UTF-16)
            count++;
            
            try {
              const entry = JSON.parse(value);
              if (entry.timestamp && (!oldestTimestamp || entry.timestamp < oldestTimestamp)) {
                oldestTimestamp = entry.timestamp;
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        });
      
      return {
        count,
        sizeKB: Math.round(totalSize / 1024),
        oldestTimestamp
      };
    } catch (error) {
      console.warn('Error getting cache stats:', error);
      return { count: 0, sizeKB: 0, oldestTimestamp: null };
    }
  }
}

// Create and export singleton instance
export const apiCache = new PersistentCache(API_CONFIG.CACHE_DURATION);

// Format timestamp to readable date string
export function formatCacheTimestamp(timestamp: number | null): string {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  return date.toLocaleString();
}

/**
 * Wrapper function to handle cached API requests
 * @param fetchFn Function that makes the actual API request
 * @param cacheKey Key to store/retrieve cached data
 * @returns Promise with data (either from cache or fresh)
 */
export async function cachedFetch<T>(
  fetchFn: () => Promise<T>,
  cacheKey: string
): Promise<T> {
  // Try to get from cache first
  const cachedData = apiCache.get<T>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  // Not in cache, fetch fresh data
  const data = await fetchFn();
  
  // Store in cache
  apiCache.set(cacheKey, data);
  
  return data;
}