'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw !== null ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

function deleteStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {}
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const keyRef = useRef(key)
  const fallbackRef = useRef(initialValue)

  const [value, setInternalValue] = useState<T>(initialValue)

  useEffect(() => {
    setInternalValue(readStorage(keyRef.current, fallbackRef.current))
  }, [])

  useEffect(() => {
    function onStorageEvent(e: StorageEvent) {
      if (e.key !== keyRef.current) return
      if (e.newValue === null) {
        setInternalValue(fallbackRef.current)
        return
      }
      try {
        setInternalValue(JSON.parse(e.newValue) as T)
      } catch {}
    }
    window.addEventListener('storage', onStorageEvent)
    return () => window.removeEventListener('storage', onStorageEvent)
  }, [])

  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    setInternalValue((current) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(current) : next
      writeStorage(keyRef.current, resolved)
      return resolved
    })
  }, [])

  const removeValue = useCallback(() => {
    deleteStorage(keyRef.current)
    setInternalValue(fallbackRef.current)
  }, [])

  return [value, setValue, removeValue] as const
}
