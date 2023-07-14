import React, { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type cords = { top: number; left: number };

export interface tipProps {
  children: JSX.Element;
  tipText: string | JSX.Element;
  gapX?: number;
  gapY?: number;
  containerClass?: string;
}

export default function Tip({ children, tipText, gapX = 0, gapY = 5, containerClass = "" }: tipProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [cords, setCords] = useState<cords | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!isMounted || !tipRef.current || !contentRef.current || !(contentRef.current.firstChild instanceof HTMLElement)) return;
    const getContent = (node: HTMLElement): HTMLElement | null => {
      const child = node.firstChild;
      let result = null;

      if (child instanceof HTMLElement) {
        const styles = getComputedStyle(child);

        if (styles.display === "contents") {
          result = getContent(child);
        } else {
          result = child;
        }
      }

      return result;
    };

    const contentElement = getContent(contentRef.current);

    if (!contentElement) return;

    const contentMetrics = contentElement.getBoundingClientRect();
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
    setIsMounted(true);
  };

  const handleTipMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {};

  const handleContentMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsMounted(false);
  };

  const handleTipMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsMounted(false);
  };

  return (
    <>
      <div
        onMouseEnter={handleContentMouseEnter}
        onMouseLeave={handleContentMouseLeave}
        className={`contents ${containerClass}`}
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
            <h5 className="tipText-center">{tipText}</h5>
          </div>,
          document.body
        )}
    </>
  );
}
