import { useRef, useState } from "react";
import { useWindowEvent } from "../../hooks/useWindowEvent";
import Tip, { tipProps } from "./Tip";

interface ConfirmDialogProps extends Omit<tipProps, "tipContent"> {}

export default function ConfirmDialog({ children, ...tipProps }: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const closeTip = () => {
    setIsOpen(false);
  };

  const handleMouseClickOnContent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsOpen(true);
  };

  const onSuccess = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    closeTip();
  };

  const onReject = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    closeTip();
  };

  useWindowEvent("mousedown", (e) => {
    if (contentRef.current && e.target instanceof Node && !contentRef.current.contains(e.target)) {
      closeTip();
    }
  });

  return (
    <div className="flex flex-1" onClick={handleMouseClickOnContent}>
      <Tip
        manualOpen={isOpen}
        tipContent={
          <div ref={contentRef} className="flex flex-col w-fit items-center ">
            <h5 className="whitespace-nowrap">Подтвердите действие</h5>
            <div className="flex">
              <button onClick={onReject}>Нет</button>
              <button onClick={onSuccess}>Да</button>
            </div>
          </div>
        }
        {...tipProps}
      >
        {children}
      </Tip>
    </div>
  );
}
