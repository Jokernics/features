import { useWindowEvent } from "./useWindowEvent";

interface UseOutsideClickOptions {
  ignoreElements: React.RefObject<HTMLElement>[];
  enabled?: boolean;
  onOutsideClick(e: MouseEvent | TouchEvent): void;
}

export function useOutsideClick({
  ignoreElements,
  enabled = true,
  onOutsideClick,
}: UseOutsideClickOptions) {
  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    if (!enabled) {
      return;
    }

    const target = e.target;
    
    if (!(target instanceof Node)) {
      return;
    }

    if (!ignoreElements.length) {
      return;
    }

    if (!ignoreElements.some((ref) => ref.current && ref.current.contains(target))) {
      onOutsideClick(e);
    }
  }

  useWindowEvent('mousedown', handleMouseDown)
  useWindowEvent('touchstart', handleMouseDown)
}