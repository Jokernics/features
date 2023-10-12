import React, { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCombinedRef } from "../../hooks/useCombinedRef";

type propsType = {
  children: JSX.Element;
  tipContent: string | JSX.Element;
  containerClassName?: string;
  manualOpen?: boolean;
  gapX?: number;
  gapY?: number;
};

type CordsType = {
  top: number;
  left: number;
};

const arrowSize = 12;
const windowGapX = 10;

export default forwardRef<HTMLDivElement, propsType>(function Tip({ children, tipContent, gapX = 0, gapY = 5, containerClassName = "", manualOpen }, containerRef) {
  const [isMounted, setIsMounted] = useState(false);
  const [cords, setCords] = useState<CordsType | null>(null);
  const [arrowCords, setArrowCords] = useState<CordsType | null>(null);
  const [isRotateArrow, setIsRotateArrow] = useState(false);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const hoverOutTimer = useRef<ReturnType<typeof setTimeout>>();

  const calculationCords = useCallback(() => {
    if (!isMounted || !tipRef.current || !contentRef.current) return;

    const contentMetrics = contentRef.current.getBoundingClientRect();

    let topPosition = contentMetrics.top - tipRef.current.offsetHeight - gapY - arrowSize;
    let leftPosition = contentMetrics.left + contentRef.current.offsetWidth / 2 - tipRef.current.offsetWidth / 2 + gapX;

    let arrowTop = contentMetrics.top - arrowSize - gapY;
    let arrowLeft = contentMetrics.left + contentRef.current.offsetWidth / 2 - arrowSize / 2 + gapX;

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
  }, [gapX, gapY, isMounted])

  useLayoutEffect(() => {
    calculationCords()
  }, [calculationCords]);

  const handleContentMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (manualOpen !== undefined) return;
    if (!contentRef.current || (event.target instanceof Node && !contentRef.current.contains(event.target))) return;

    setIsMounted(true);
  };

  const handleTipMouseEnter = () => {
    if (hoverOutTimer.current) clearTimeout(hoverOutTimer.current);
  };

  const handleContentMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (manualOpen !== undefined) return;

    closeTip();
  };

  const handleTipMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (manualOpen !== undefined) return;

    closeTip();
  };

  const handleContentMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (manualOpen !== undefined) return;

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

  const memoChildren = useMemo(() => children, [children])

  const combinedContentRef = useCombinedRef(contentRef, containerRef)

  useEffect(() => {
    if (manualOpen !== undefined) setIsMounted(manualOpen);
  }, [manualOpen]);

  return (
    <>
      <div
        onMouseEnter={handleContentMouseEnter}
        onMouseLeave={handleContentMouseLeave}
        onMouseDown={handleContentMouseDown}
        className={containerClassName}
        ref={combinedContentRef}
      >
        {memoChildren}
      </div>
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
              className="border-lightblue bottom-1 w-fit h-fit flex flex-col items-center
                rounded-lg shadow-lg px-2 py-1 text-white text-sm
                bg-opacity-50 border-2 bg-lightblue
              "
              ref={tipRef}
              onMouseEnter={handleTipMouseEnter}
              onMouseLeave={handleTipMouseLeave}
            >
              <span className="">{tipContent}</span>
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
              className="w-0 h-0 border-[6px] border-solid border-transparent border-t-lightblue"
            />
          </div>,
          document.body
        )}
    </>
  );
})
