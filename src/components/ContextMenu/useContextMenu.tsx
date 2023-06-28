import React, { ReactElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type cords = { top: number; left: number };
type triggerData = { event: React.MouseEvent<HTMLElement, MouseEvent> | null; data: any | null };
type ContextMenuWrapper = { className?: string; children: ReactElement };
type MenuItem = {
  className?: string;
  children: ReactElement;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};
type ContextMenuTrigger = { children: ReactElement; data?: any };

export const useContextMenu = () => {
  const [menuCords, setMenuCords] = useState<cords | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerData = useRef<triggerData>({
    event: null,
    data: null,
  });
  
  const handleOpen = () => {
    setIsOpen(true);
  };

  const hide = () => {
    setMenuCords(null);
    setIsOpen(false);
    triggerData.current.data = null;
    triggerData.current.event = null;
  };

  useLayoutEffect(() => {
    const event = triggerData.current.event;

    if (isOpen && menuRef.current && event) {
      const clickX = event.clientX;
      const clickY = event.clientY;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const rootW = menuRef.current.offsetWidth;
      const rootH = menuRef.current.offsetHeight;
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
        cords.top = clickY + 5;
      }

      if (bottom) {
        cords.top = clickY - rootH - 5;
      }

      setMenuCords(cords);
    }
  }, [isOpen]);

  const ContextMenuWrapper = useCallback(
    ({ className, children }: ContextMenuWrapper) => {
      return (
        <>
          {isOpen &&
            createPortal(
              <menu
                ref={menuRef}
                style={{
                  top: menuCords?.top,
                  left: menuCords?.left,
                  position: "fixed",
                  zIndex: "10",
                  display: "block",
                }}
                className={className}
              >
                {children}
              </menu>,
              document.body
            )}
        </>
      );
    },
    [isOpen, menuCords]
  );

  const MenuItem = useCallback(({ className, onClick, children }: MenuItem) => {
    return (
      <div
        {...{ className }}
        onClick={(e) => {
          onClick && onClick(e);
          hide();
        }}
      >
        {children}
      </div>
    );
  }, []);
  const ContextMenuTrigger = useCallback(({ children, data }: ContextMenuTrigger) => {
    return (
      <div
        className="contents"
        onContextMenu={(event) => {
          event.preventDefault();

          triggerData.current.event = event;
          if (data) triggerData.current.data = data;

          handleOpen();
        }}
      >
        {children}
      </div>
    );
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (target instanceof Node && menuRef.current) {
        const isOnMenu = menuRef.current.contains(target);

        if (!isOnMenu) hide();
      }
    };

    window.addEventListener("mousedown", handleClick);

    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  return {
    ContextMenuTrigger,
    ContextMenuWrapper,
    MenuItem,
    triggerData: triggerData.current,
    isOpen: !!menuCords,
    hide,
  };
};
