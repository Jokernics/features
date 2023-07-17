import { createPortal } from "react-dom";
import { useDebounceUnmount } from "../hooks/useDebounceUnmount";

type props = {
  open: boolean;
  children: JSX.Element;
  unmountDelay?: number;
};

export default function Modal({ open, unmountDelay = 0, children }: props) {
  const { mounted } = useDebounceUnmount({ opened: open, delay: unmountDelay });

  return <>{mounted && createPortal(children, document.body)}</>;
}
