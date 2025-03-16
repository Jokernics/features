import { Virtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";

import { SCROLL_RESTORATION_ON_SCROLL_DEBOUNCE } from "./constants";
import { ScrollRestorationDataType } from "./types";
import {
  getScrollRestorationData,
  getScrollRestorationKey,
  setScrollRestorationData,
} from "./utils";
import useDebounce from "../useDebounce";

type UseScrollRestorationReturn = (
  virtualizer: Virtualizer<HTMLDivElement, Element>
) => void;

export const useScrollRestorationOnScroll = ({
  scrollContainerRef,
  customScrollRestorationKey,
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  customScrollRestorationKey?: string;
}): UseScrollRestorationReturn => {
  const scrollRestorationDataRef = useRef<ScrollRestorationDataType>(
    getScrollRestorationData()
  );

  const scrollRestorationOnContainerScroll = useCallback(
    (virtualizer: Virtualizer<HTMLDivElement, Element>) => {
      const { range } = virtualizer;

      if (!range || !scrollContainerRef.current) {
        return;
      }

      const firstChildInView = scrollContainerRef.current.querySelector(
        `[data-index='${range.startIndex}']`
      );

      if (firstChildInView) {
        const childTop = firstChildInView.getBoundingClientRect().top;
        const parentTop =
          scrollContainerRef.current.getBoundingClientRect().top;

        const offset = parentTop - childTop;

        scrollRestorationDataRef.current[
          getScrollRestorationKey(customScrollRestorationKey)
        ] = {
          index: range.startIndex,
          offset,
        };

        setScrollRestorationData(scrollRestorationDataRef.current);
      }
    },
    [scrollContainerRef, customScrollRestorationKey]
  );

  const scrollRestorationOnContainerScrollDebounce = useDebounce(
    scrollRestorationOnContainerScroll,
    SCROLL_RESTORATION_ON_SCROLL_DEBOUNCE
  );

  return scrollRestorationOnContainerScrollDebounce;
};
