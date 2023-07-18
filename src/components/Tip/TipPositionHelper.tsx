import { useLayoutEffect, useRef, useState } from "react";
import Portal from "../Portal";
import { useDebounceUnmount } from "../../hooks/useDebounceUnmount";

interface Cords {
  top: number;
  left: number;
}

type elements = { tipEl: HTMLDivElement; contentEl: HTMLDivElement; contentMetrics: DOMRect };

interface TipPositionHelperProps {
  tip: JSX.Element;
  children: JSX.Element;
  tipTop?: (({ tipEl, contentEl, contentMetrics }: elements) => number) | null;
  tipLeft?: (({ tipEl, contentEl }: elements) => number) | null;
  onTopOverflow?: (({ tipEl, contentEl, contentMetrics }: elements) => Cords) | null;
  isOpen: boolean;
  gapX?: number;
  gapY?: number;
  unmountDelay?: number;
}

export default function TipPositionHelper({
  tip,
  children,
  tipTop = null,
  tipLeft = null,
  isOpen,
  gapX = 0,
  gapY = 5,
  unmountDelay = 0,
}: TipPositionHelperProps) {
  const [cords, setCords] = useState<Cords | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { mounted } = useDebounceUnmount({ opened: isOpen, delay: unmountDelay });

  useLayoutEffect(() => {
    if (!mounted || !tipRef.current || !contentRef.current) return;

    const contentEl = contentRef.current;
    const tipEl = tipRef.current;
    const contentMetrics = contentRef.current.getBoundingClientRect();

    const defaultTopPosition = contentMetrics.top - tipRef.current.offsetHeight - gapY;
    const defaultLeftPosition = contentMetrics.left + contentRef.current.offsetWidth / 2 - tipRef.current.offsetWidth / 2 + gapX;

    let newCords = { top: defaultTopPosition, left: defaultLeftPosition };

    if (tipTop) newCords.top = tipTop({ tipEl, contentEl, contentMetrics });
    if (tipLeft) newCords.left = tipLeft({ tipEl, contentEl, contentMetrics });

    //check Boundaries
    let { top, left } = newCords;

    const isTopOverflow = top < 0;
    const isBottomOverflow = top + tipRef.current.offsetHeight > window.innerHeight;
    const isLeftOverflow = left < 0;
    const isRightOverflow = left + tipRef.current.offsetWidth > window.innerWidth;
    console.log("isTopOverflow", isTopOverflow);
    console.log("isBottomOverflow", isBottomOverflow);
    console.log("isLeftOverflow", isLeftOverflow);
    console.log("isRightOverflow", isRightOverflow);

    if (top < 0) {
      top = contentMetrics.top + tipRef.current.offsetHeight;
    } else if (top + tipRef.current.offsetHeight > window.innerHeight) {
      top = contentMetrics.top - tipRef.current.offsetHeight;
    }

    if (left < 0) {
      left = 0;
    } else if (left + tipRef.current.offsetWidth > window.innerWidth) {
      left = window.innerWidth - tipRef.current.offsetWidth;
    }

    setCords({
      top: top,
      left: left,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  return (
    <>
      <div className={`flex flex-1`} ref={contentRef}>
        {children}
      </div>
      <Portal open={mounted}>
        <div
          style={{
            top: cords?.top,
            left: cords?.left,
            position: "fixed",
            zIndex: "1",
          }}
          ref={tipRef}
        >
          {tip}
        </div>
      </Portal>
    </>
  );
}
