import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getRange } from "../utils/utils";
import { useAddEventListener } from "./useAddEventListener";
import { waitUntilDOMUpdate } from "./useOverfloAuto/utils/waitUntilDOMUpdate";
import useDebounce from "./useDebounce";
import { useThrottle } from "./useThrottle";

type propsType = {
  triggerOffestCount?: number;
  countRenderOnOffsetTrigger?: number;
  maxRenderCount?: number;
  total: number;
  initialIndex?: number;
  scrollToIndexOffestTop?: number;
  onScroll?: (e: Event, range: rangeType | null) => void;
};

export type rangeType = {
  startIndex: number;
  endIndex: number;
};

const DEFAULT_TRIGGER_OFFSET_COUNT = 4; // тригер быстрых вставок
const DEFAULT_COUNT_RENDER_ON_OFFSET_TRIGGER = 3; // размер нового слайса
const DEFAULT_MAX_RENDER_COUNT = 20; // максимальный размер массива

export default function useRenderLargeListRefactor({
  triggerOffestCount = DEFAULT_TRIGGER_OFFSET_COUNT,
  countRenderOnOffsetTrigger = DEFAULT_COUNT_RENDER_ON_OFFSET_TRIGGER,
  maxRenderCount = DEFAULT_MAX_RENDER_COUNT,
  total,
  initialIndex = 0,
  onScroll,
}: propsType) {
  const getArrayToRender = useCallback(
    (index: number) => {
      if (index > total - 1 || index < 0) return [];

      const arr = [];

      const start = Math.max(0, index - maxRenderCount / 2);
      const end = Math.min(index + maxRenderCount / 2, total - 1);

      for (let i = start; i <= end; i++) {
        arr.push(i);
      }

      return arr;
    },
    [maxRenderCount, total]
  );

  const scrollByIndex = useCallback((index: number) => {
    if (!scrollElementRef.current) return;

    const child = scrollElementRef.current.querySelector(`[data-index='${index}'][data-row="true"]`);

    if (child) {
      child.scrollIntoView(true);
    }
  }, []);

  const renderRowsByIndex = useCallback(
    (index: number) => {
      setRowIndexes(getArrayToRender(index));
      requestAnimationFrame(() => scrollByIndex(index));
    },
    [getArrayToRender, scrollByIndex]
  );

  const renderRdas = useCallback(() => {
    const rows = getArrayToRender(initialIndex);

    return rows;
  }, [getArrayToRender, initialIndex]);

  const [rowIndexes, setRowIndexes] = useState<number[]>(renderRdas);

  const [range, setRange] = useState<rangeType | null>(null);
  const scrollElementRef = useRef<HTMLDivElement | null>(null);

  const setUniqueRowIndexes = useCallback((func: (arg: number[]) => number[]) => {
    setRowIndexes((prev) => {
      const newArr = func(prev);
      //@ts-ignore
      return [...new Set(newArr)];
    });
  }, []);

  const calculateRange = useCallback(() => {
    if (!scrollElementRef.current) return null;

    const range = getRange(scrollElementRef.current);

    setRange(range);

    return range;
  }, []);

  const checkRenderOverload3 = useCallback(() => {
    const range = calculateRange();

    if (range) {
      if (rowIndexes.length > maxRenderCount) {
        const boundaryPrm = 2;

        setRowIndexes((prev) => {
          const start = range.startIndex - boundaryPrm < 0 ? 0 : range.startIndex - boundaryPrm;
          const end = range.endIndex + boundaryPrm > total - 1 ? total - 1 : range.endIndex;

          const newArr = [];

          for (let index = start; index < end; index++) {
            newArr.push(index);
          }

          return newArr;
        });
      }
    }
  }, [calculateRange, maxRenderCount, rowIndexes.length, total]);

  const checkRenderOverloadDebounce = useDebounce(checkRenderOverload3, 1000);

  const checkRenderOverload2 = useCallback(
    (arr: number[], direction: "start" | "end") => {
      if (arr.length < maxRenderCount) return arr;

      if (direction === "start") {
        return arr.slice(0, maxRenderCount);
      } else if (direction === "end") {
        return arr.slice(-maxRenderCount);
      }

      return arr;
    },
    [maxRenderCount]
  );

  const checkForRender = useCallback(() => {
    if (!scrollElementRef.current || rowIndexes.length >= total) return;

    const range = getRange(scrollElementRef.current);

    if (range === null) return;

    const lastRowsIndex = rowIndexes[rowIndexes.length - 1];
    const lastIndex = total - 1
    const isUpOver = range.startIndex - triggerOffestCount < rowIndexes[0];
    const isEndOver = range.endIndex + triggerOffestCount > lastRowsIndex;

    if (isUpOver) {
      const length = rowIndexes[0] - countRenderOnOffsetTrigger < 0 ? rowIndexes[0] - 1 : countRenderOnOffsetTrigger;
      const newSlice = Array.from({ length: length }, (el, i) => rowIndexes[0] - (length - i));

      setUniqueRowIndexes((prev) => {
        const newArr = [...newSlice, ...prev];
        return checkRenderOverload2(newArr, "start");
      });
    } else if (isEndOver) {
      const length = lastRowsIndex + countRenderOnOffsetTrigger >= lastIndex ? lastIndex - lastRowsIndex : countRenderOnOffsetTrigger;

      if (length <= 0) return;

      const newSlice = Array.from({ length: length }, (el, i) => lastRowsIndex + i + 1);

      console.log(newSlice)

      setUniqueRowIndexes((prev) => {
        const newArr = [...prev, ...newSlice];
        return checkRenderOverload2(newArr, "end");
      });
    }
  }, [rowIndexes, total, triggerOffestCount, countRenderOnOffsetTrigger, setUniqueRowIndexes, checkRenderOverload2]);

  const checkForRenderThrottle = useThrottle(checkForRender, 10000);
  const checkForRenderDebounce = useDebounce(checkForRenderThrottle, 1000);

  const handleScroll = useCallback(
    (e: Event) => {
      console.log("handle Scroll");

      // скролл может срабатывать очень быстро, ждем пока зарендерятся элементы с прошлой вставки нового слайса
      // waitUntilDOMUpdate(checkForRender);
      checkForRenderDebounce();
      const range = calculateRange();

      // checkRenderOverloadDebounce();

      if (onScroll) onScroll(e, range);
    },
    [calculateRange, checkForRenderDebounce, onScroll]
  );

  useAddEventListener(scrollElementRef, "scroll", handleScroll);

  // useLayoutEffect(() => {
  //   scrollByIndex(initialIndex);
  // }, []);

  const handleIndexOfBame = useCallback((indexOfBame: number) => {
    setRowIndexes((prev) => prev.map((index) => index + indexOfBame));
  }, []);

  const returnPrms = useMemo(() => {
    return {
      scrollElementRef,
      range,
      renderRowsByIndex,
      rowIndexes,
      scrollByIndex,
      calculateRange,
      setWhtenAddTotheTop: handleIndexOfBame,
    };
  }, [calculateRange, handleIndexOfBame, range, renderRowsByIndex, rowIndexes, scrollByIndex]);

  return returnPrms;
}
