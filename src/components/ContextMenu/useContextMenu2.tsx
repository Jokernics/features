import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import TipPositionHelper from "../Tip/TipPositionHelper";
import "./index.css";
import { useEvent } from "../../hooks/useEvent";

type triggerData = { event: React.MouseEvent<HTMLElement, MouseEvent> | null; data: any | null };
type ContextMenuWrapper = { className?: string; children: ReactElement };
type MenuItem = {
  className?: string;
  children: ReactElement;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};
type ContextMenuTrigger = { children: ReactElement; data?: any };

export const useContextMenu2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation, setAnimation] = useState("");

  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerData = useRef<triggerData>({
    event: null,
    data: null,
  });

  const handleOpen = () => {
    setAnimation("");
    setIsOpen(true);
  };

  const close = useCallback(() => {
    setAnimation("fadeOut");
  }, []);

  const unMount = useCallback(() => {
    setIsOpen(false);
    triggerData.current.data = null;
    triggerData.current.event = null;
  }, []);

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLDivElement>) => {
      if (e.animationName === "fadeOut") {
        unMount();
      }
    },
    [unMount]
  );

  const ContextMenuWrapper = useCallback(
    ({ className, children }: ContextMenuWrapper) => {
      return (
        <TipPositionHelper
          isOpen={isOpen}
          tip={
            <div onAnimationEnd={handleAnimationEnd} ref={menuRef} className={`${animation}`}>
              {children}
            </div>
          }
          customCords={() => {
            const event = triggerData.current.event;

            if (!event) return { top: 0, left: 0 };

            const clickX = event.clientX;
            const clickY = event.clientY;

            return { left: clickX + 3, top: clickY + 5 };
          }}
          noContent
        />
      );
    },
    [isOpen, handleAnimationEnd, animation]
  );

  const MenuItem = useCallback(({ className, onClick, children }: MenuItem) => {
    return (
      <div
        {...{ className }}
        onClick={(e) => {
          onClick && onClick(e);
          setAnimation("fadeOut");
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

        if (!isOnMenu) close();
      }
    };

    window.addEventListener("mousedown", handleClick);

    return () => window.removeEventListener("mousedown", handleClick);
  }, [close]);

  return {
    ContextMenuTrigger,
    ContextMenuWrapper,
    MenuItem,
    triggerData: triggerData.current,
    isOpen,
    close,
  };
};
