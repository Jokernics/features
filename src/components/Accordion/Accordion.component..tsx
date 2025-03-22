import { ElementBaseCssProps } from "@sber-emrm/focus-ui";
import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { waitUntilDOMUpdate } from "../../../../../libs/focus-bless/src/components/PaginationListBl/utils";
import { Styled } from "./Accordion.styles";

type AccordionProps = ElementBaseCssProps &
  PropsWithChildren<{
    isOpen: boolean;
    initialAnimationHeight?: number;
    onCloseAnimationEnd?: VoidFunction;
  }>;

export const Accordion: FC<AccordionProps> = ({
  children,
  isOpen,
  initialAnimationHeight = 0,
  onCloseAnimationEnd,
  testID,
  autoTestID,
  ...anotherProps
}) => {
  const [isRender, setIsRender] = useState(isOpen);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heightRef = useRef<number | null>(null);

  useEffect(() => {
    isOpen && setIsRender(isOpen);
  }, [isOpen]);

  useLayoutEffect(() => {
    const containerEl = containerRef.current;

    if (containerEl) {
      // защита от спама кнопки при анимации, высота должна быть такая же как при старте, а не на каком-то моменте анимации
      heightRef.current = heightRef.current ?? containerEl.offsetHeight;

      if (isOpen) {
        containerEl.style.maxHeight = `${initialAnimationHeight}px`;

        waitUntilDOMUpdate(() => {
          containerEl.style.maxHeight = `${heightRef.current}px`;
        });
      } else {
        containerEl.style.maxHeight = `${heightRef.current}px`;

        waitUntilDOMUpdate(() => {
          containerEl.style.maxHeight = `${initialAnimationHeight}px`;
        });
      }
    }
  }, [initialAnimationHeight, isOpen]);

  if (!isOpen && !isRender) {
    return null;
  }

  return (
    <Styled.Container
      ref={containerRef}
      onTransitionEnd={(e) => {
        if (e.target === containerRef.current) {
          if (!isOpen) {
            onCloseAnimationEnd?.();
            setIsRender(false);
          } else {
            containerRef.current.style.maxHeight = "";
          }

          heightRef.current = null;
        }
      }}
      isOpen={isOpen}
      data-testid={testID}
      data-autotestid={autoTestID}
      {...anotherProps}
    >
      {children}
    </Styled.Container>
  );
};
