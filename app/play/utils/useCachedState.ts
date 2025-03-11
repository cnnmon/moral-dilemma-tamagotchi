import { GameState } from "@/convex/state";
import { useEffect, useState } from "react";

// cache key for local storage
const CACHED_STATE_KEY = "cached_game_state";
const CACHE_TIMESTAMP_KEY = "cached_game_state_timestamp";
const MAX_CACHE_AGE_MS = 5 * 60 * 1000; // 5 minutes

// save state to local storage
export function cacheGameState(state: GameState): void {
  try {
    // don't cache authentication errors or incomplete states
    if (state.status === 'not_authenticated' || state.status === 'needs_pet') {
      return;
    }
    
    localStorage.setItem(CACHED_STATE_KEY, JSON.stringify(state));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error("Failed to cache game state:", error);
  }
}

// get cached state if it exists and is not too old
export function getCachedGameState(): GameState | null {
  try {
    const cachedStateStr = localStorage.getItem(CACHED_STATE_KEY);
    const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (!cachedStateStr || !timestampStr) {
      return null;
    }
    
    // check if cache is not too old
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp) || Date.now() - timestamp > MAX_CACHE_AGE_MS) {
      // cache is too old, clear it
      localStorage.removeItem(CACHED_STATE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      return null;
    }
    
    // parse and return cached state
    return JSON.parse(cachedStateStr) as GameState;
  } catch (error) {
    console.error("Failed to retrieve cached game state:", error);
    return null;
  }
}

// hook to use cached state
export function useCachedState(): {
  cachedState: GameState | null;
  isUsingCachedState: boolean;
} {
  const [cachedState, setCachedState] = useState<GameState | null>(null);
  const [isUsingCachedState, setIsUsingCachedState] = useState(false);
  
  // load cached state on mount
  useEffect(() => {
    const cached = getCachedGameState();
    if (cached) {
      setCachedState(cached);
      setIsUsingCachedState(true);
    }
  }, []);
  
  return { cachedState, isUsingCachedState };
} 