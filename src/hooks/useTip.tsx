import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAddEventListener } from "./useAddEventListener";

type propsType = {
  tipText: string;
  gapX?: number;
  gapY?: number;
};

type CordsType = {
  top: number;
  left: number;
};

const arrowSize = 12;
const windowGapX = 10;

export default function useTip({ tipText = "", gapX = 0, gapY = 0 }: propsType) {
  const [isMounted, setIsMounted] = useState(false);
  const [cords, setCords] = useState<CordsType | null>(null);
  const [arrowCords, setArrowCords] = useState<CordsType | null>(null);
  const [isRotateArrow, setIsRotateArrow] = useState(false);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const hoverOutTimer = useRef<ReturnType<typeof setTimeout>>();

  useLayoutEffect(() => {
    if (!isMounted || !tipRef.current || !contentRef.current) return;

    const contentMetrics = contentRef.current.getBoundingClientRect();

    let topPosition = contentMetrics.top - tipRef.current.offsetHeight - gapY - arrowSize;
    let leftPosition =
      contentMetrics.left + contentRef.current.offsetWidth / 2 - tipRef.current.offsetWidth / 2 + gapX

    let arrowTop = contentMetrics.top - arrowSize - gapY;
    let arrowLeft = contentMetrics.left + contentRef.current.offsetWidth / 2 - arrowSize / 2 + gapX;

    console.log(leftPosition + contentRef.current.offsetWidth / 2)
    console.log(arrowLeft + arrowSize / 2)

    setIsRotateArrow(false);

    if (topPosition < 0) {
      setIsRotateArrow(true);
      arrowTop = contentMetrics.top + contentRef.current.offsetHeight + gapY;
      topPosition = contentMetrics.top + contentRef.current.offsetHeight + arrowSize + gapY;
    }

    if (leftPosition - windowGapX < 0) {
      leftPosition = 0 + windowGapX;
    } else if (leftPosition + tipRef.current.offsetWidth + windowGapX > window.innerWidth) {
      leftPosition = window.innerWidth - tipRef.current.offsetWidth - windowGapX;
    }

    setCords({
      top: topPosition,
      left: leftPosition,
    });
    setArrowCords({ top: arrowTop, left: arrowLeft });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const handleContentMouseEnter = (event: MouseEvent) => {
    if (!contentRef.current || (event.target instanceof Node && !contentRef.current.contains(event.target))) return;

    setIsMounted(true);
  };

  const handleTipMouseEnter = () => {
    if (hoverOutTimer.current) clearTimeout(hoverOutTimer.current);
  };

  const handleContentMouseLeave = (event: MouseEvent) => {
    closeTip();
  };

  const handleTipMouseLeave = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    closeTip();
  }, []);

  const handleContentMouseDown = (event: MouseEvent) => {
    closeTip();
  };

  const closeTip = () => {
    if (hoverOutTimer.current) clearTimeout(hoverOutTimer.current);

    hoverOutTimer.current = setTimeout(() => {
      setIsMounted(false);
      setCords(null);
      setArrowCords(null);
    }, 50);
  };

  useAddEventListener(contentRef, "mouseenter", handleContentMouseEnter);
  useAddEventListener(contentRef, "mouseleave", handleContentMouseLeave);
  useAddEventListener(contentRef, "mousedown", handleContentMouseDown);

  const Tip = useCallback(() => {
    return (
      <>
        {isMounted &&
          createPortal(
            <div className="contents">
              <div
                style={{
                  top: cords?.top,
                  left: cords?.left,
                  position: "fixed",
                  zIndex: "1",
                }}
                className="border-[#0284C7] bottom-1 w-fit h-fit flex flex-col items-center
                  rounded-lg shadow-lg px-2 py-1 text-gray-500 text-sm
                  bg-opacity-50 border-2 
                "
                ref={tipRef}
                onMouseEnter={handleTipMouseEnter}
                onMouseLeave={handleTipMouseLeave}
              >
                <span className="">{tipText}</span>
              </div>
              <div
                style={{
                  top: arrowCords?.top,
                  left: arrowCords?.left,
                  width: arrowSize,
                  height: arrowSize,
                  position: "fixed",
                  zIndex: "1",
                  rotate: isRotateArrow ? "180deg" : "",
                }}
                className="w-0 h-0 border-[6px] border-solid border-transparent border-t-[#0284C7]"
              />
            </div>,
            document.body
          )}
      </>
    );
  }, [arrowCords, cords, handleTipMouseLeave, isMounted, isRotateArrow, tipText]);

  return { Tip, contentRef };
}
