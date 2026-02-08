import { useState, useEffect } from 'react';

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const API_TIMEOUT = 5000; // 5s

interface CacheEntry {
  url: string;
  timestamp: number;
}

function getCached(tag: string): string | null {
  try {
    const raw = localStorage.getItem(`giphy_cache_${tag}`);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(`giphy_cache_${tag}`);
      return null;
    }
    return entry.url;
  } catch {
    return null;
  }
}

function setCache(tag: string, url: string) {
  try {
    const entry: CacheEntry = { url, timestamp: Date.now() };
    localStorage.setItem(`giphy_cache_${tag}`, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable
  }
}

export function useGiphy(tag: string, noCache = false): { gifUrl: string | null; isLoading: boolean } {
  const [gifUrl, setGifUrl] = useState<string | null>(() => noCache ? null : getCached(tag));
  const [isLoading, setIsLoading] = useState(noCache || !getCached(tag));

  useEffect(() => {
    if (!noCache) {
      const cached = getCached(tag);
      if (cached) {
        setGifUrl(cached);
        setIsLoading(false);
        return;
      }
    }

    const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
    if (!apiKey) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

    fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${encodeURIComponent(tag)}&rating=g`,
      { signal: controller.signal },
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const url: string | undefined = json?.data?.images?.fixed_width?.url;
        if (url) {
          setCache(tag, url);
          setGifUrl(url);
        }
      })
      .catch(() => {
        // API failed (rate limit, offline, timeout) → gifUrl stays null → fallback
      })
      .finally(() => {
        clearTimeout(timeout);
        setIsLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [tag]);

  return { gifUrl, isLoading };
}
