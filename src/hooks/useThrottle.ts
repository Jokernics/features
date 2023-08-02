import { useCallback, useRef } from "react";
import { useEvent } from "./useEvent";

export function useThrottle<T>(cb: (...args: T[]) => void, time: number = 500) {
  const refCb = useEvent(cb);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const throttleCb = useCallback(
    (...args: T[]) => {
      if (timerRef.current) return;

      refCb(...args);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
      }, time);
    },
    [refCb, time]
  );

  return throttleCb;
}
