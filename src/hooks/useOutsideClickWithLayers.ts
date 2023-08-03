import { useEffect } from "react";
import { useEvent } from "./useEvent";

interface UseOutsideClickOptions {
  ignoreRefs: React.RefObject<HTMLElement>[];
  enabled?: boolean;
  onOutsideClick(e: MouseEvent | TouchEvent): void;
}

const parrentLayers = [] as { ignoreRefs: React.RefObject<HTMLElement>[] }[];

export function useOutsideClickWithLayers({ ignoreRefs, enabled = true, onOutsideClick }: UseOutsideClickOptions) {
  const handleOutsideClick = useEvent(onOutsideClick);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!ignoreRefs.length) {
        return;
      }

      if (!ignoreRefs.some((element) => element.current && element.current.contains(target))) {
        handleOutsideClick(e);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [enabled, ignoreRefs, handleOutsideClick]);
}
