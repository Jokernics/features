import { Virtualizer } from "@tanstack/react-virtual";
import { useCallback } from "react";


type UseScrollRestorationReturn = () =>
  | {
      index: number;
      offset: number;
    }
  | undefined;

export const useScrollRestoration = ({
  scrollContainerRef,
  virtualizer,
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
}): UseScrollRestorationReturn => {
  const getRestorationData = useCallback(() => {
    const { range } = virtualizer;

    if (!range || !scrollContainerRef.current) {
      return;
    }

    const firstChildInView = scrollContainerRef.current.querySelector(`[data-index='${range.startIndex}']`);

    if (firstChildInView) {
      const childTop = firstChildInView.getBoundingClientRect().top;
      const parentTop = scrollContainerRef.current.getBoundingClientRect().top;

      const offset = parentTop - childTop;
      return {
        index: range.startIndex,
        offset,
      };
    }
  }, [virtualizer, scrollContainerRef]);

  return getRestorationData;
};
