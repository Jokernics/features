import { useCallback, useRef } from "react";
import { useEvent } from "./useEvent";

export default function useDebounce<T extends (...args: never[]) => unknown>(callback: T, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackPersistent = useEvent(callback)

  const debouncedCallback = useCallback(
    (...args: never[]) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        callbackPersistent(...args);
      }, delay);
    },
    [callbackPersistent, delay]
  );

  return debouncedCallback as T;
}
