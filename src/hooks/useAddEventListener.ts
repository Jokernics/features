import { MutableRefObject, useEffect } from "react";

import { useEvent } from "./useEvent";

type GetWindowEvent<Type extends string> = Type extends keyof WindowEventMap ? WindowEventMap[Type] : Event;

export function useAddEventListener<Type extends string>(
  ref: MutableRefObject<HTMLElement | null>,
  type: Type,
  cb: (event: GetWindowEvent<Type>) => void
): void;
export function useAddEventListener(ref: MutableRefObject<HTMLElement | null>, type: string, cb: (event: Event) => void) {
  const eventCb = useEvent(cb);

  useEffect(() => {
    let refElement = null as HTMLElement | null

    if (ref.current) {
      ref.current.addEventListener(type, eventCb);
      refElement = ref.current;
    }

    return () => {
      if (refElement) {
        refElement.removeEventListener(type, eventCb);
      }
    };
  }, [type, eventCb, ref]);
}
