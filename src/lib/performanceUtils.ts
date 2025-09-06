import { useCallback, useMemo, useRef } from 'react'

// Debounce hook for expensive operations
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay]) as T
}

// Throttle hook for frequent updates
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0)
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now
      callback(...args)
    }
  }, [callback, delay]) as T
}

// Memoized array operations
export function useMemoizedFilter<T>(
  array: T[],
  predicate: (item: T) => boolean,
  deps: any[]
): T[] {
  return useMemo(() => array.filter(predicate), [array, ...deps])
}

export function useMemoizedSort<T>(
  array: T[],
  compareFn: (a: T, b: T) => number,
  deps: any[]
): T[] {
  return useMemo(() => [...array].sort(compareFn), [array, ...deps])
}

// Batch state updates
export class BatchUpdater {
  private updates: (() => void)[] = []
  private timeoutId: NodeJS.Timeout | null = null
  
  add(update: () => void) {
    this.updates.push(update)
    
    if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => {
        this.flush()
      }, 0)
    }
  }
  
  flush() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    
    const updates = [...this.updates]
    this.updates = []
    
    updates.forEach(update => update())
  }
}

// Memory-efficient array operations
export function efficientArrayUpdate<T>(
  array: T[],
  predicate: (item: T) => boolean,
  updater: (item: T) => T
): T[] {
  let hasChanges = false
  const result = array.map(item => {
    if (predicate(item)) {
      hasChanges = true
      return updater(item)
    }
    return item
  })
  
  return hasChanges ? result : array
}

// Cleanup utility for intervals and timeouts
export class CleanupManager {
  private cleanupFunctions: (() => void)[] = []
  
  addTimeout(timeoutId: NodeJS.Timeout) {
    this.cleanupFunctions.push(() => clearTimeout(timeoutId))
  }
  
  addInterval(intervalId: NodeJS.Timeout) {
    this.cleanupFunctions.push(() => clearInterval(intervalId))
  }
  
  addCustomCleanup(cleanup: () => void) {
    this.cleanupFunctions.push(cleanup)
  }
  
  cleanup() {
    this.cleanupFunctions.forEach(cleanup => cleanup())
    this.cleanupFunctions = []
  }
}

// Performance monitoring
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${end - start} milliseconds`)
  }
  
  return result
}

// Lazy loading utility
export function createLazyLoader<T>(
  loader: () => Promise<T>
): () => Promise<T> {
  let promise: Promise<T> | null = null
  
  return () => {
    if (!promise) {
      promise = loader()
    }
    return promise
  }
}