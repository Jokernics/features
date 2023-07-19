import { useLayoutEffect, useRef, useState } from "react";
import Portal from "../Portal";

interface Cords {
  top: number;
  left: number;
}

interface CustomCordsPrms {
  tipEl: HTMLDivElement;
  contentEl: HTMLDivElement;
  contentMetrics: DOMRect;
  defaultCords: Cords;
}
type CustomCordsPrmsWithoutChildren = Pick<CustomCordsPrms, "tipEl">;

type CustomCordsFunction = ({ tipEl, contentEl, contentMetrics, defaultCords }: CustomCordsPrms) => Cords;
type CustomCordsFunctionWithoutChildren = ({ tipEl }: CustomCordsPrmsWithoutChildren) => Cords;

type OverflowFunction = ({ tipEl, contentEl, contentMetrics, defaultCords }: CustomCordsPrms) => number;
type OverflowFunctionWithoutChildren = ({ tipEl }: CustomCordsPrmsWithoutChildren) => number;

interface Props {
  tip: JSX.Element;
  children: JSX.Element;
  customCords?: CustomCordsFunction;
  onTopOverflow?: OverflowFunction;
  onBottomOverflow?: OverflowFunction;
  onLeftOverflow?: OverflowFunction;
  onRightOverflow?: OverflowFunction;
  isOpen: boolean;
  gapX?: number;
  gapY?: number;
}

interface PropsWithoutChildren {
  tip: JSX.Element;
  children?: undefined;
  customCords: CustomCordsFunctionWithoutChildren;
  onTopOverflow?: OverflowFunctionWithoutChildren;
  onBottomOverflow?: OverflowFunctionWithoutChildren;
  onLeftOverflow?: OverflowFunctionWithoutChildren;
  onRightOverflow?: OverflowFunctionWithoutChildren;
  isOpen: boolean;
  gapX?: number;
  gapY?: number;
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
}: Props | PropsWithoutChildren) {
  const [cords, setCords] = useState<Cords | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!isOpen || !tipRef.current) return;

    const tipEl = tipRef.current;
    const contentEl = contentRef.current;

    const getOverflowStatus = (cords: Cords) => {
      const isTopOverflow = cords.top < 0;
      const isBottomOverflow = cords.top + tipEl.offsetHeight > window.innerHeight;
      const isLeftOverflow = cords.left < 0;
      const isRightOverflow = cords.left + tipEl.offsetWidth > window.innerWidth;

      return { isTopOverflow, isBottomOverflow, isLeftOverflow, isRightOverflow };
    };

    // if content is missing
    if (children === undefined) {
      let newCords = getCustomCords({ tipEl });

      //check Boundaries
      const { isTopOverflow, isBottomOverflow, isLeftOverflow, isRightOverflow } = getOverflowStatus(newCords);
      const customPrms = { tipEl };

      if (isTopOverflow) {
        const defaultNewTop = tipEl.offsetHeight;
        newCords.top = (onTopOverflow && onTopOverflow(customPrms)) || defaultNewTop;
      } else if (isBottomOverflow) {
        const defaultNewTop = window.innerHeight - tipEl.offsetHeight;
        newCords.top = (onBottomOverflow && onBottomOverflow(customPrms)) || defaultNewTop;
      }

      if (isLeftOverflow) {
        const defaultNewLeft = 0;
        newCords.left = (onLeftOverflow && onLeftOverflow(customPrms)) || defaultNewLeft;
      } else if (isRightOverflow) {
        const defaultNewLeft = window.innerWidth - tipEl.offsetWidth;
        newCords.left = (onRightOverflow && onRightOverflow(customPrms)) || defaultNewLeft;
      }

      setCords(newCords);
    } else if (contentEl) {
      const contentMetrics = contentEl.getBoundingClientRect();

      const defaultTopPosition = contentMetrics.top - tipEl.offsetHeight - gapY;
      const defaultLeftPosition = contentMetrics.left + contentEl.offsetWidth / 2 - tipEl.offsetWidth / 2 + gapX;

      let newCords = { top: defaultTopPosition, left: defaultLeftPosition };

      const customCords = getCustomCords && getCustomCords({ tipEl, contentEl, contentMetrics, defaultCords: newCords });
      if (customCords) newCords = customCords;

      //check Boundaries
      const { isTopOverflow, isBottomOverflow, isLeftOverflow, isRightOverflow } = getOverflowStatus(newCords);
      const customPrms = { tipEl, contentEl, contentMetrics, defaultCords: newCords };

      if (isTopOverflow) {
        const newTop = contentMetrics.top + tipEl.offsetHeight;
        newCords.top = (onTopOverflow && onTopOverflow(customPrms)) || newTop;
      } else if (isBottomOverflow) {
        const newTop = contentMetrics.top - tipEl.offsetHeight;
        newCords.top = (onBottomOverflow && onBottomOverflow(customPrms)) || newTop;
      }

      if (isLeftOverflow) {
        const newLeft = 0;
        newCords.left = (onLeftOverflow && onLeftOverflow(customPrms)) || newLeft;
      } else if (isRightOverflow) {
        const newLeft = window.innerWidth - tipEl.offsetWidth;
        newCords.left = (onRightOverflow && onRightOverflow(customPrms)) || newLeft;
      }

      setCords(newCords);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      {children && (
        <div className={`flex flex-1`} ref={contentRef}>
          {children}
        </div>
      )}
      <Portal open={isOpen}>
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
