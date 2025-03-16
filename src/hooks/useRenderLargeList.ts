import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getRange } from "../utils/utils";
import { useAddEventListener } from "./useAddEventListener";

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

const DEFAULT_TRIGGER_OFFSET_COUNT = 15; // тригер быстрых вставок
const DEFAULT_COUNT_RENDER_ON_OFFSET_TRIGGER = 50; // размер нового слайса
const DEFAULT_MAX_RENDER_COUNT = 150; // максимальный размер массива

export default function useRenderLargeList({
  triggerOffestCount = DEFAULT_TRIGGER_OFFSET_COUNT,
  countRenderOnOffsetTrigger = DEFAULT_COUNT_RENDER_ON_OFFSET_TRIGGER,
  maxRenderCount = DEFAULT_MAX_RENDER_COUNT,
  total,
  initialIndex = 0,
  onScroll,
}: propsType) {
  const getArrayToRender = useCallback(
    (index: number) => {
      if (index > total || index < 1) return [];

      const arr = [];

      const start = Math.max(1, index - maxRenderCount / 2);
      const end = Math.min(index + maxRenderCount / 2, total);

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

  const [rowIndexes, setRowIndexes] = useState<number[]>(() => {
    const rows = getArrayToRender(initialIndex);

    return rows;
  });

  const [range, setRange] = useState<rangeType | null>(null);
  const scrollElementRef = useRef<HTMLDivElement | null>(null);

  const setUniqueRowIndexes = useCallback((func: (arg: number[]) => number[]) => {
    setRowIndexes((prev) => {
      const newArr = func(prev);
      //@ts-ignore
      return [...new Set(newArr)];
    });
  }, []);

  const checkRenderOverload = useCallback(
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
    const isUpOver = range.startIndex - triggerOffestCount < rowIndexes[0];
    const isEndOver = range.endIndex + triggerOffestCount > lastRowsIndex;

    if (isUpOver) {
      const length = rowIndexes[0] - countRenderOnOffsetTrigger < 0 ? rowIndexes[0] - 1 : countRenderOnOffsetTrigger;
      const newSlice = Array.from({ length: length }, (el, i) => rowIndexes[0] - (length - i));

      setUniqueRowIndexes((prev) => {
        const newArr = [...newSlice, ...prev];
        return checkRenderOverload(newArr, "start");
      });
    } else if (isEndOver) {
      const length = lastRowsIndex + countRenderOnOffsetTrigger >= total ? total - lastRowsIndex : countRenderOnOffsetTrigger;

      if (length <= 0) return;

      const newSlice = Array.from({ length: length }, (el, i) => lastRowsIndex + i + 1);

      setUniqueRowIndexes((prev) => {
        const newArr = [...prev, ...newSlice];
        return checkRenderOverload(newArr, "end");
      });
    }
  }, [rowIndexes, total, triggerOffestCount, countRenderOnOffsetTrigger, setUniqueRowIndexes, checkRenderOverload]);

  const calculateRange = useCallback(() => {
    if (!scrollElementRef.current) return { startIndex: 0, endIndex: 0 };

    const range = getRange(scrollElementRef.current);

    setRange(range);

    return range;
  }, []);

  const handleScroll = useCallback(
    (e: Event) => {
      checkForRender();
      const range = calculateRange();

      if (onScroll) onScroll(e, range);
    },
    [calculateRange, checkForRender, onScroll]
  );

  useAddEventListener(scrollElementRef, "scroll", handleScroll);

  useLayoutEffect(() => {
    scrollByIndex(initialIndex);
  }, []);

  const returnPrms = useMemo(
    () => ({ scrollElementRef, range, renderRowsByIndex, rowIndexes, scrollByIndex, calculateRange }),
    [calculateRange, range, renderRowsByIndex, rowIndexes, scrollByIndex]
  );

  return returnPrms;
}

export type LargeListInstanceType = ReturnType<typeof useRenderLargeList>;
