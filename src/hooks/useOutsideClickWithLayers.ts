import { useEffect, useId } from "react";
import { useWindowEvent } from "./useWindowEvent";

interface UseOutsideClickOptions {
  ignoreElements: React.RefObject<HTMLElement>[];
  enable: boolean;
  onOutsideClick(e: MouseEvent | TouchEvent): void;
}

let queue = [] as string[];

export function useOutsideClickWithLayers({ ignoreElements, enable = false, onOutsideClick }: UseOutsideClickOptions) {
  const id = useId();

  useEffect(() => {
    const deleteElement = () => {
      queue = queue.filter((str) => str !== id);
    };

    if (enable) {
      queue.push(id);
    } else {
      deleteElement();
    }

    return deleteElement;
  }, [enable, id]);

  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    if (!enable) {
      return;
    }

    const queueIndex = queue.findIndex((str) => str === id);

    if (queueIndex !== queue.length - 1) {
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
  };

  useWindowEvent("mousedown", handleMouseDown);
}
