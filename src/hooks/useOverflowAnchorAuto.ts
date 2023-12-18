import { useCallback, useEffect, useRef } from "react";
import { useEvent } from "./useEvent";

const isChildInTopOfView = (scrollElement: HTMLElement, child: HTMLElement) => {
  const { scrollTop } = scrollElement;

  return scrollTop >= child.offsetTop;
};
const isChildInView = (scrollElement: HTMLElement, child: HTMLElement) => {
  const { offsetHeight, scrollTop } = scrollElement;

  return scrollTop <= child.offsetTop + child.offsetHeight && scrollTop + offsetHeight >= child.offsetTop;
};

export const useOverflowAnchorAuto = ({
  scrollContainerRef,
}: {
  scrollContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  const overflowAnchorDataRef = useRef<Record<string, number>>({});
  const isFirstRenderRef = useRef(true);

  const handleResizeObserver = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.target instanceof HTMLElement) {
        const overflowAnchorId = entry.target.dataset.overflowAnchor;

        if (overflowAnchorId) {
          const prevHeight = overflowAnchorDataRef.current[overflowAnchorId];
          const height = entry.contentBoxSize[0].blockSize;

          if (prevHeight) {
            const heightDifference = height - prevHeight;
            const containerEl = scrollContainerRef.current;

            if (containerEl) {
              const isInTopofViewOfParent = isChildInTopOfView(containerEl, entry.target);

              if (isInTopofViewOfParent) {
                containerEl.scrollTop = containerEl.scrollTop + heightDifference;
              }
            }
          }

          overflowAnchorDataRef.current[overflowAnchorId] = height;
        }
      }
    }
  }, []);

  const handleResizeObserverEvent = useEvent(handleResizeObserver);

  const resizeObserverRef = useRef(new ResizeObserver(handleResizeObserverEvent));

  const childRef = useCallback((el: HTMLDivElement | null) => {
    if (el && scrollContainerRef.current) {
      const isInViewOfParent = isChildInView(scrollContainerRef.current, el);
      const isInTopofViewOfParent = isChildInTopOfView(scrollContainerRef.current, el);

      if ((isInViewOfParent || isInTopofViewOfParent) && !isFirstRenderRef.current) {
        const containerEl = scrollContainerRef.current;

        if (containerEl) {
          containerEl.scrollTop = containerEl.scrollTop + el.offsetHeight;
        }
      }
    }

    if (el) {
      resizeObserverRef.current.observe(el);
    }
  }, []);

  useEffect(() => {
    const resizeObserver = resizeObserverRef.current;
    isFirstRenderRef.current = false;

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { childRef };
};
