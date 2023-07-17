import { useEffect } from "react";

import { useEvent } from "./useEvent";

type GetWindowEvent<Type extends string> = Type extends keyof WindowEventMap ? WindowEventMap[Type] : Event;

export function useWindowEvent<Type extends string>(type: Type, cb: (event: GetWindowEvent<Type>) => void): void;
export function useWindowEvent(type: string, cb: (event: Event) => void) {
  const eventCb = useEvent(cb);

  useEffect(() => {
    window.addEventListener(type, eventCb);

    return () => window.removeEventListener(type, eventCb);
  }, [type, eventCb]);
}
