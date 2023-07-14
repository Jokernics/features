import Tip, { tipProps } from "./Tip";

interface ConfirmDialogProps extends tipProps {}

export default function ConfirmDialog({ children, ...tipProps }: ConfirmDialogProps) {
  return (
    <>
      <Tip {...tipProps}>{children}</Tip>
    </>
  );
}
