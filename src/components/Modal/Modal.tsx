import React, { forwardRef } from "react";
import "./index.css";
import { useDebounceUnmount } from "../../hooks/useDebounceUnmount";
import Portal from "../Portal";

type props = {
  children: JSX.Element;
  open: boolean;
} & React.ComponentProps<"div">;

export default forwardRef<HTMLDivElement, props>(function Modal({ children, open, ...props }, ref) {
  const { mounted } = useDebounceUnmount({ opened: open });

  return (
    <Portal open={mounted}>
      <div ref={ref} className={`modal z-[1] ${!open ? "modal-hidden" : ""}`.trim()} {...props}>
        {children}
      </div>
    </Portal>
  );
});
