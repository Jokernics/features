import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type cords = { top: number; left: number };

export interface tipProps {
  children: JSX.Element;
  tipContent: string | JSX.Element;
  manualOpen?: boolean;
  gapX?: number;
  gapY?: number;
}

export default function Tip({ children, tipContent, gapX = 0, gapY = 5, manualOpen }: tipProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [cords, setCords] = useState<cords | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const hoverOutTimer = useRef<ReturnType<typeof setTimeout>>();

  useLayoutEffect(() => {
    if (!isMounted || !tipRef.current || !contentRef.current || !(contentRef.current.firstChild instanceof HTMLElement)) return;

    const contentMetrics = contentRef.current.getBoundingClientRect();
    const tipMetrics = tipRef.current.getBoundingClientRect();

    let topPosition = contentMetrics.top - tipMetrics.height - gapY;
    let leftPosition = contentMetrics.left + contentMetrics.width / 2 - tipMetrics.width / 2 + gapX;

    if (topPosition < 0) {
      topPosition = contentMetrics.top + tipMetrics.height;
    } else if (topPosition + tipMetrics.height > window.innerHeight) {
      topPosition = contentMetrics.top - tipRef.current.offsetHeight;
    }

    if (leftPosition < 0) {
      leftPosition = 0;
    } else if (leftPosition + tipRef.current.offsetWidth > window.innerWidth) {
      leftPosition = window.innerWidth - tipMetrics.width;
    }

    setCords({
      top: topPosition,
      left: leftPosition,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const handleContentMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      manualOpen !== undefined ||
      !contentRef.current ||
      (event.target instanceof Node && !contentRef.current.contains(event.target))
    )
      return;

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
    }, 50);
  };

  useEffect(() => {
    if (manualOpen !== undefined) setIsMounted(manualOpen);
  }, [manualOpen]);

  return (
    <>
      <div
        onMouseEnter={handleContentMouseEnter}
        onMouseLeave={handleContentMouseLeave}
        onMouseDown={handleContentMouseDown}
        className={`flex flex-1`}
        ref={contentRef}
      >
        {children}
      </div>
      {isMounted &&
        createPortal(
          <div
            style={{
              top: cords?.top,
              left: cords?.left,
              position: "fixed",
              zIndex: "10",
              display: "block",
            }}
            ref={tipRef}
            onMouseEnter={handleTipMouseEnter}
            onMouseLeave={handleTipMouseLeave}
          >
            <div className="contents">{tipContent}</div>
          </div>,
          document.body
        )}
    </>
  );
}
