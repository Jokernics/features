import { createPortal } from "react-dom";

type props = {
  open: boolean;
  children: JSX.Element;
};

export default function Portal({ open, children }: props) {
  if (!open) return null;

  return <>{createPortal(children, document.body)}</>;
}
