import { useCallback, useEffect, useRef } from "react";
import { waitUntilDOMUpdate } from "./utils/waitUntilDOMUpdate";
import { isSafari } from "./utils/isSafari";
import { useLatest } from "../useLatest";

const isChildInTopOfView = (scrollElement: HTMLElement, child: HTMLElement): boolean => {
  const { scrollTop } = scrollElement;

  return scrollTop >= child.offsetTop;
};
const isChildInView = (scrollElement: HTMLElement, child: HTMLElement): boolean => {
  const { offsetHeight, scrollTop } = scrollElement;

  return scrollTop <= child.offsetTop + child.offsetHeight && scrollTop + offsetHeight >= child.offsetTop;
};

export type useOverflowAnchorAutoPropsType = {
  scrollContainerRef: React.MutableRefObject<HTMLDivElement | null> | null;
  disableCorrection: React.MutableRefObject<boolean>;
};
export type useOverflowAnchorAutoReturnType = {
  scrollCorrectionRef: (el: HTMLDivElement | null) => void;
};

/**
 * Дополнительная коррекция скролла для Safari планшета
 * Чинит исчезание элементов после добавления их сверху (во время скролла)
 */
const useAdditionalScrollCorrectionInSafari = ({
  scrollContainerRef,
}: {
  scrollContainerRef: React.MutableRefObject<HTMLDivElement | null> | null;
}): {
  triggerRender: VoidFunction;
  lastScrollContainerScrollTop: React.MutableRefObject<number | null>;
} => {
  const lastScrollContainerScrollTop = useRef<null | number>(null);

  const triggerRender = useCallback(() => {
    if (scrollContainerRef && scrollContainerRef.current && lastScrollContainerScrollTop.current !== null && isSafari()) {
      const containerEl = scrollContainerRef.current;

      waitUntilDOMUpdate(() => {
        if (lastScrollContainerScrollTop.current) {
          containerEl.scrollTop = lastScrollContainerScrollTop.current;
        }
      });
    }
  }, [scrollContainerRef]);

  return {
    triggerRender,
    lastScrollContainerScrollTop,
  };
};

/**
 * - scrollCorrectionRef навешивается на элементы относительно позиционированные scrollContainerRef, то есть скролл контейнеру надо задать свойство position: relative
 * - на элементах, где используется scrollCorrectionRef, должен быть дата атрибут overflow-anchor с уникальным неизменяющимся во время ререндеров индентификатором
 * - overflow-anchor должен быть "none" в любом случае
 */
// eslint-disable-next-line max-lines-per-function
export function useOverflowAnchor({
  scrollContainerRef,
  disableCorrection,
}: useOverflowAnchorAutoPropsType): useOverflowAnchorAutoReturnType {
  const overflowAnchorDataRef = useRef<Record<string, number>>({});
  const isFirstRenderRef = useRef(true);
  const { triggerRender, lastScrollContainerScrollTop } = useAdditionalScrollCorrectionInSafari({
    scrollContainerRef,
  });
  const handleResizeObserver = useCallback(
    (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.target instanceof HTMLElement) {
          const overflowAnchorId = entry.target.dataset.overflowAnchor;

          if (overflowAnchorId) {
            // const height = entry.contentBoxSize[0].blockSize;
            const height = entry.borderBoxSize[0].blockSize 

            if (overflowAnchorDataRef.current.hasOwnProperty(overflowAnchorId)) {
              const prevHeight = overflowAnchorDataRef.current[overflowAnchorId];
              const heightDifference = height - prevHeight;

              if (scrollContainerRef) {
                const containerEl = scrollContainerRef.current;

                if (containerEl) {
                  const isInTopofViewOfParent = isChildInTopOfView(containerEl, entry.target);

                  if (overflowAnchorDataRef.current.hasOwnProperty(overflowAnchorId)) {
                    console.log(
                      "handleResizeObserver overflowAnchorId in cache",
                      overflowAnchorId,
                      height,
                      heightDifference,
                      isInTopofViewOfParent,
                    );
                  }

                  if (isInTopofViewOfParent && !disableCorrection.current) {
                    containerEl.scrollTop = containerEl.scrollTop + heightDifference;
                  }
                }
              }
            } else {
              console.log("handleResizeObserver overflowAnchorId no cache", overflowAnchorId, height);
            }

            overflowAnchorDataRef.current[overflowAnchorId] = height;
          }
        }
      }
    },
    [disableCorrection, scrollContainerRef]
  );

  const resizeObserverRef = useRef(new ResizeObserver(handleResizeObserver));

  const scrollCorrectionRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (el && scrollContainerRef && scrollContainerRef.current) {
        const isInViewOfParent = isChildInView(scrollContainerRef.current, el);
        const isInTopOfViewOfParent = isChildInTopOfView(scrollContainerRef.current, el);

        if ((isInViewOfParent || isInTopOfViewOfParent) && !isFirstRenderRef.current) {
          const containerEl = scrollContainerRef.current;

          if (containerEl && !disableCorrection.current) {
            const newScrollTop = containerEl.scrollTop + el.offsetHeight;

            console.log("overflow anchor scrollCorrectionRef ", el.dataset.overflowAnchor);

            containerEl.scrollTop = newScrollTop;
            lastScrollContainerScrollTop.current = newScrollTop;
            triggerRender();
          }
        }
      }

      if (el) {
        resizeObserverRef.current.observe(el);
      } 
    },
    [disableCorrection, lastScrollContainerScrollTop, scrollContainerRef, triggerRender]
  );

  useEffect(() => {
    const resizeObserver = resizeObserverRef.current;

    isFirstRenderRef.current = false;

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { scrollCorrectionRef };
}
