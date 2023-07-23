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
  cords: Cords;
}
type CustomCordsPrmsWithoutChildren = Pick<CustomCordsPrms, "tipEl">;

type CustomCordsFunction = ({ tipEl, contentEl, contentMetrics, cords }: CustomCordsPrms) => Cords;
type CustomCordsFunctionWithoutChildren = ({ tipEl }: CustomCordsPrmsWithoutChildren) => Cords;

type OverflowFunctionPrmsWithChildren = Omit<CustomCordsPrms, "prevCords">;
type OverflowTopFunctionWithChildren = (prms: OverflowFunctionPrmsWithChildren & { overflowTop: number; cords: Cords }) => {
  top: number;
};
type OverflowLeftFunctionWithChildren = (prms: OverflowFunctionPrmsWithChildren & { overflowLeft: number; cords: Cords }) => {
  left: number;
};

type OverflowFunctionPrmsWithoutChildren = CustomCordsPrmsWithoutChildren;
type OverflowTopFunctionWithoutChildren = (prms: OverflowFunctionPrmsWithoutChildren & { overflowTop: number; cords: Cords }) => {
  top: number;
};
type OverflowLeftFunctionWithoutChildren = (
  prms: OverflowFunctionPrmsWithoutChildren & { overflowLeft: number; cords: Cords }
) => {
  left: number;
};

type PropsWithChildren = {
  noContent?: false
  children: JSX.Element
  customCords?: CustomCordsFunction;
  onTopOverflow?: OverflowTopFunctionWithChildren;
  onBottomOverflow?: OverflowTopFunctionWithChildren;
  onLeftOverflow?: OverflowLeftFunctionWithChildren;
  onRightOverflow?: OverflowLeftFunctionWithChildren;
  gapX?: number;
  gapY?: number;
};

interface PropsWithoutChildren {
  noContent: true
  children: JSX.Element;
  customCords: CustomCordsFunctionWithoutChildren;
  onTopOverflow?: OverflowTopFunctionWithoutChildren;
  onBottomOverflow?: OverflowTopFunctionWithoutChildren;
  onLeftOverflow?: OverflowLeftFunctionWithoutChildren;
  onRightOverflow?: OverflowLeftFunctionWithoutChildren;
  gapX?: undefined;
  gapY?: undefined;
}

type Props = {
  tip: JSX.Element;
  isOpen: boolean;
} & (PropsWithChildren | PropsWithoutChildren);

export default function TipPositionHelper({
  children,
  tip,
  customCords: getCustomCords,
  onTopOverflow,
  onBottomOverflow,
  onLeftOverflow,
  onRightOverflow,
  isOpen,
  gapX = 0,
  gapY = 5,
  noContent
}: Props) {
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
    if (noContent) {
      let cords = getCustomCords({ tipEl });

      //check Boundaries
      const { isTopOverflow, isBottomOverflow, isLeftOverflow, isRightOverflow } = getOverflowStatus(cords);

      const cordsWithOverflowCheck = JSON.parse(JSON.stringify(cords));

      if (isTopOverflow) {
        const overflowTop = tipEl.offsetHeight;
        const customOverflowTop = onTopOverflow && onTopOverflow({ tipEl, cords, overflowTop }).top;

        cordsWithOverflowCheck.top = customOverflowTop || overflowTop;
      } else if (isBottomOverflow) {
        const overflowTop = window.innerHeight - tipEl.offsetHeight;
        const customOverflowTop = onBottomOverflow && onBottomOverflow({ tipEl, cords, overflowTop }).top;

        cordsWithOverflowCheck.top = customOverflowTop || overflowTop;
      }

      if (isLeftOverflow) {
        const overflowLeft = 0;
        const customOverflowLeft = onLeftOverflow && onLeftOverflow({ tipEl, cords, overflowLeft }).left;

        cordsWithOverflowCheck.left = customOverflowLeft || overflowLeft;
      } else if (isRightOverflow) {
        const overflowLeft = window.innerWidth - tipEl.offsetWidth;
        const customOverflowLeft = onRightOverflow && onRightOverflow({ tipEl, cords, overflowLeft }).left;

        cordsWithOverflowCheck.left = customOverflowLeft || overflowLeft;
      }

      setCords(cordsWithOverflowCheck);
      //if content exist
    } else if (!noContent && contentEl) {
      const contentMetrics = contentEl.getBoundingClientRect();

      const defaultTopPosition = contentMetrics.top - tipEl.offsetHeight - gapY;
      const defaultLeftPosition = contentMetrics.left + contentEl.offsetWidth / 2 - tipEl.offsetWidth / 2 + gapX;

      let cords = { top: defaultTopPosition, left: defaultLeftPosition };

      const customCords = getCustomCords && getCustomCords({ tipEl, contentEl, contentMetrics, cords });
      if (customCords) cords = customCords;

      const cordsWithOverflowCheck = JSON.parse(JSON.stringify(cords));

      //check Boundaries
      const { isTopOverflow, isBottomOverflow, isLeftOverflow, isRightOverflow } = getOverflowStatus(cords);

      if (isTopOverflow) {
        const overflowTop = contentMetrics.top + tipEl.offsetHeight;
        const customOverflowTop = onTopOverflow && onTopOverflow({ contentEl, contentMetrics, tipEl, cords, overflowTop });

        cordsWithOverflowCheck.top = customOverflowTop || overflowTop;
      } else if (isBottomOverflow) {
        const overflowTop = contentMetrics.top - tipEl.offsetHeight;
        const customOverflowTop = onBottomOverflow && onBottomOverflow({ contentEl, contentMetrics, tipEl, cords, overflowTop });

        cordsWithOverflowCheck.top = customOverflowTop || overflowTop;
      }

      if (isLeftOverflow) {
        const overflowLeft = 0;
        const customOverflowLeft = onLeftOverflow && onLeftOverflow({ contentEl, contentMetrics, tipEl, cords, overflowLeft });

        cordsWithOverflowCheck.left = customOverflowLeft || overflowLeft;
      } else if (isRightOverflow) {
        const overflowLeft = window.innerWidth - tipEl.offsetWidth;
        const customOverflowLeft = onRightOverflow && onRightOverflow({ contentEl, contentMetrics, tipEl, cords, overflowLeft });

        cordsWithOverflowCheck.left = customOverflowLeft || overflowLeft;
      }

      setCords(cordsWithOverflowCheck);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      {!noContent && (
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
