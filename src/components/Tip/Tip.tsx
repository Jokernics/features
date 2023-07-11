import React, { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type cords = { top: number; left: number };

type props = {
  children: JSX.Element | string;
  text?: string | JSX.Element;
};

export default function Tip({ children, text = "tip" }: props) {
  const [isOpened, setIsOpened] = useState(false);
  const [cords, setCords] = useState<cords | null>(null);
  const triggerEvent = useRef<React.MouseEvent<HTMLDivElement, MouseEvent> | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const event = triggerEvent.current;

    if (isOpened && tipRef.current && event) {
      if (containerRef.current) {
        const containerCords = containerRef.current.getBoundingClientRect();
        const tipCords = tipRef.current.getBoundingClientRect();
        const { top, left } = containerCords;
        setCords({ top: top - tipCords.height, left });
        return;
      }

      const clickX = event.clientX;
      const clickY = event.clientY;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const rootW = tipRef.current.offsetWidth;
      const rootH = tipRef.current.offsetHeight;
      const right = screenW - clickX > rootW;
      const left = !right;
      const top = screenH - clickY > rootH;
      const bottom = !top;
      const cords = {} as cords;

      if (right) {
        cords.left = clickX + 5;
      }

      if (left) {
        cords.left = clickX - rootW - 5;
      }

      if (top) {
        cords.top = clickY - rootH - 5;
      }

      if (bottom) {
        cords.top = clickY - rootH - 5;
      }

      setCords(cords);
    }
  }, [isOpened]);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsOpened(true);
    triggerEvent.current = event;
  };
  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsOpened(false);
    triggerEvent.current = null;
  };
  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="w-fit" ref={containerRef}>
      {isOpened &&
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
          >
            {text}
          </div>,
          document.body
        )}
      {children}
    </div>
  );
}
