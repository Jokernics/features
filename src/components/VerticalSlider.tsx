import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWindowEvent } from "../hooks/useWindowEvent";

type props = {
  currentIndex: number;
  totalCount: number;
  onChange?: (currentIndex: number) => void;
  onMouseUp?: (currentIndex: number) => void;
  scrollHeight?: number;
  customThumbTitle?: (currentIndex: number, totalCount: number) => JSX.Element;
  disable?: boolean;
};

const MIN_SCROLL_HEIGHT = 50;

export default function VerticalSlider({
  currentIndex,
  customThumbTitle,
  totalCount,
  onChange,
  onMouseUp,
  scrollHeight = 300,
  disable,
}: props) {
  const thumbHeight = useMemo(() => {
    return Math.max(MIN_SCROLL_HEIGHT, scrollHeight / totalCount);
  }, [scrollHeight, totalCount]);

  const getScrollInitialPosition = useCallback(() => {
    const procent = Math.min(totalCount, currentIndex) / totalCount;

    return procent * (scrollHeight - thumbHeight);
  }, [currentIndex, scrollHeight, thumbHeight, totalCount]);

  const dragAreaRef = useRef<HTMLDivElement | null>(null);
  const scrollBarRef = useRef<HTMLDivElement | null>(null);
  const isMouseDownRef = useRef(false);
  const offsetRef = useRef<number | null>(null);
  const lastCountPositionRef = useRef(currentIndex);
  const [scrollOffsetTop, setScrollOffsetTop] = useState(() => getScrollInitialPosition());

  const scrollOffestBottom = useMemo(() => {
    return scrollHeight - scrollOffsetTop - thumbHeight;
  }, [scrollHeight, thumbHeight, scrollOffsetTop]);

  const changeScrollOffsetTop = (height: number) => {
    requestAnimationFrame(() => {
      setScrollOffsetTop(height);
    });
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isMouseDownRef.current || !offsetRef.current || disable) return;

      const newHeight = Math.max(0, Math.min(event.clientY + offsetRef.current, scrollHeight - thumbHeight));
      const countRate = newHeight / (scrollHeight - thumbHeight);
      const newCount = Math.max(1, Math.round(countRate * totalCount));

      changeScrollOffsetTop(newHeight);

      lastCountPositionRef.current = newCount;
      if (onChange) onChange(newCount);
    },
    [disable, scrollHeight, thumbHeight, totalCount, onChange]
  );

  useWindowEvent("mousemove", handleMouseMove);

  useWindowEvent("mouseup", () => {
    if (isMouseDownRef.current && onMouseUp && !disable) {
      onMouseUp(lastCountPositionRef.current);
    }

    isMouseDownRef.current = false;
  });

  useEffect(() => {
    const newScrollOffsetTop = getScrollInitialPosition();

    changeScrollOffsetTop(newScrollOffsetTop);
  }, [currentIndex, getScrollInitialPosition, totalCount]);

  return (
    <div
      ref={scrollBarRef}
      style={{ height: scrollHeight }}
      className="flex flex-col select-none relative z-[1] border-l-[1px] border-lightblue2"
    >
      <div className="" style={{ height: scrollOffsetTop }}></div>
      <div
        ref={dragAreaRef}
        onMouseDown={(e) => {
          isMouseDownRef.current = true;
          if (dragAreaRef.current) {
            offsetRef.current = dragAreaRef.current.offsetTop - e.clientY;
          }
        }}
        className="flex select-none items-center h-[50px] ml-[-0.18em] cursor-s-resize gap-2"
        style={{ height: thumbHeight }}
      >
        <div className="w-[0.4em] rounded-lg  h-full bg-[#d1f0ff]"></div>
        {!customThumbTitle && (
          <div className="flex">
            {currentIndex} из {totalCount}
          </div>
        )}
        {customThumbTitle && customThumbTitle(currentIndex, totalCount)}
      </div>
      <div className="" style={{ height: scrollOffestBottom }}></div>
    </div>
  );
}
