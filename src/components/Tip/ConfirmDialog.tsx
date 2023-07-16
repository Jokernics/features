import { useState } from "react";
import Tip, { tipProps } from "./Tip";

interface ConfirmDialogProps extends Omit<tipProps, 'tipContent'> { }

export default function ConfirmDialog({ children, ...tipProps }: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const closeTip = () => {
    setIsOpen(false)
  }

  const handleMouseClickOnContent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsOpen(true)
  }

  const onSuccess = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    closeTip()
  }

  const onReject = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    closeTip()
  }


  return (
    <div className="flex flex-1" onClick={handleMouseClickOnContent}>
      <Tip
        manualOpen={isOpen}
        tipContent={
          <div className="flex flex-col">
            <h5>Подтвердите действие</h5>
            <div className="flex">
              <button onClick={onReject}>Нет</button>
              <button onClick={onSuccess}>Да</button>
            </div>
          </div>
        }
        {...tipProps}>
        {children}
      </Tip>
    </div>
  );
}
