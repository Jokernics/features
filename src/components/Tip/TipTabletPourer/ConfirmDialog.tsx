import { forwardRef, useRef, useState } from "react";
import Tip, { tipPropsType } from "./Tip";
import { useWindowEvent } from "../../../hooks/useWindowEvent";
import { useCombinedRef } from "../../../hooks/useCombinedRef";
import { useAddEventListener } from "../../../hooks/useAddEventListener";

interface ConfirmDialogProps extends Omit<tipPropsType, "tipContent" | "children"> {
  children: JSX.Element | (({ isOpen }: { isOpen: boolean }) => JSX.Element);
  dialogText: React.ReactElement | string;
  successCb?: () => void;
  rejectCb?: () => void;
  successBtnTitle?: string
  rejectBtnTitle?: string
  onTipOpen?: (state: boolean) => void
  onTipClose?: (state: boolean) => void
}

const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(function ConfirmDialog(
  { children, dialogText, successCb, rejectCb, successBtnTitle = 'Да', rejectBtnTitle = 'Нет', onTipOpen, onTipClose, ...tipProps },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const closeTip = () => {
    setIsOpen(false);
    if (onTipClose) onTipClose(false)
  };

  const handleMouseClickOnContent = (event: MouseEvent) => {
    setIsOpen(true);
    if (onTipOpen) onTipOpen(true)
  };

  const onSuccess = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    closeTip();
    if (successCb) successCb();
  };

  const onReject = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    closeTip();
    if (rejectCb) rejectCb();
  };

  useWindowEvent("mousedown", (e) => {
    if (contentRef.current && e.target instanceof Node && !contentRef.current.contains(e.target)) {
      closeTip();
    }
  });

  const myRef = useRef<HTMLDivElement>(null);

  const myRefComined = useCombinedRef(ref, myRef);

  useAddEventListener(myRef, "click", handleMouseClickOnContent);

  return (
    <div className="flex flex-1">
      <Tip
        ref={myRefComined}
        manualOpen={isOpen}
        tipContent={
          <div ref={contentRef} className="flex flex-col w-fit items-center gap-4">
            <h5 className="whitespace-nowrap">{dialogText}</h5>
            <div className="flex font-bold justify-around w-full">
              <button className="w-[4.5rem] tracking-wider min-w-fit px-2 py-2 bg-red-400 rounded-md" onClick={onSuccess}>
                {successBtnTitle}
              </button>
              <button className="w-[4.5rem] tracking-wider min-w-fit px-2 py-2 bg-green-500 rounded-md" onClick={onReject}>
                {rejectBtnTitle}
              </button>
            </div>
          </div>
        }
        tipContainerClassName="px-4 py-4 text-2xl"
        {...tipProps}
      >
        {typeof children === "function" ? children({ isOpen }) : children}
      </Tip>
    </div>
  );
});

export default ConfirmDialog;
