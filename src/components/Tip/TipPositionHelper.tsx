import { useLayoutEffect, useRef, useState } from "react";
import Portal from "../Portal";
import { useDebounceUnmount } from "../../hooks/useDebounceUnmount";

interface Cords {
  top: number;
  left: number;
}

type elements = { tipEl: HTMLDivElement; contentEl: HTMLDivElement; contentMetrics: DOMRect, prevCords: Cords };

interface TipPositionHelperProps {
  tip: JSX.Element;
  children: JSX.Element;
  customCords?: (({ tipEl, contentEl, contentMetrics, prevCords }: elements) => Cords | null)
  onTopOverflow?: (({ tipEl, contentEl, contentMetrics, prevCords }: elements) => Cords | null) | null;
  onBottomOverflow?: (({ tipEl, contentEl, contentMetrics, prevCords }: elements) => Cords | null) | null;
  onLeftOverflow?: (({ tipEl, contentEl, contentMetrics, prevCords }: elements) => Cords | null) | null;
  onRightOverflow?: (({ tipEl, contentEl, contentMetrics, prevCords }: elements) => Cords | null) | null;
  isOpen: boolean;
  gapX?: number;
  gapY?: number;
  unmountDelay?: number;
}

export default function TipPositionHelper({
  tip,
  children,
  customCords: getCustomCords,
  onTopOverflow,
  onBottomOverflow,
  onLeftOverflow,
  onRightOverflow,
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

    const tipEl = tipRef.current;
    const contentEl = contentRef.current;

    const contentMetrics = contentEl.getBoundingClientRect();

    const defaultTopPosition = contentMetrics.top - tipEl.offsetHeight - gapY;
    const defaultLeftPosition = contentMetrics.left + contentEl.offsetWidth / 2 - tipEl.offsetWidth / 2 + gapX;

    let newCords = { top: defaultTopPosition, left: defaultLeftPosition };

    const customCords = getCustomCords && getCustomCords({ tipEl, contentEl, contentMetrics, prevCords: newCords })
    if (customCords) newCords = customCords

    //check Boundaries
    let { top, left } = newCords;

    const customPrms = { contentEl, contentMetrics, tipEl, prevCords: { ...newCords } }

    const isTopOverflow = top < 0;
    const isBottomOverflow = top + tipEl.offsetHeight > window.innerHeight;
    const isLeftOverflow = left < 0;
    const isRightOverflow = left + tipEl.offsetWidth > window.innerWidth;

    if (isTopOverflow) {
      const newTop = contentMetrics.top + tipEl.offsetHeight;
      top = (onTopOverflow && onTopOverflow(customPrms)?.top) || newTop
    } else if (isBottomOverflow) {
      const newTop = contentMetrics.top - tipEl.offsetHeight;
      top = (onBottomOverflow && onBottomOverflow(customPrms)?.top) || newTop
    }

    if (isLeftOverflow) {
      const newLeft = 0;
      left = (onLeftOverflow && onLeftOverflow(customPrms)?.left) || newLeft
    } else if (isRightOverflow) {
      const newLeft = window.innerWidth - tipEl.offsetWidth;
      left = (onRightOverflow && onRightOverflow(customPrms)?.left) || newLeft
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
