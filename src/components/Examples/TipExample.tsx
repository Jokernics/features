import { useState } from "react";
import ConfirmDialog from "../Tip/ConfirmDialog";
import TipPositionHelper from "../Tip/TipPositionHelper";

export default function TipExample() {
  const [isTipPositionOpen, setIsTipPositionOpen] = useState(true);

  return (
    <div className="flex flex-col">
      <div className="flex">
        <textarea className="resize-x" value={"22"} disabled />
        {[
          { str: "Пони зеленый", color: "green" },
          { str: "Пони крассный", color: "red" },
          { str: "Пони синий", color: "blue" },
        ].map((obj, i) => {
          return (
            <ConfirmDialog key={i}>
              <div className="contents">
                <span style={{ backgroundColor: obj.color }} className="flex-1">
                  {obj.str}
                </span>
              </div>
            </ConfirmDialog>
          );
        })}
      </div>
      <div
        className="mt-8 w-fit"
        onMouseDown={() => {
          setIsTipPositionOpen(false);
        }}
        onMouseUp={() => {
          setIsTipPositionOpen(true);
        }}
      >
        <TipPositionHelper
          isOpen={isTipPositionOpen}
          tip={<div>Tip</div>}
        >
          <span>TipPositionHelperProps</span>
        </TipPositionHelper>
      </div>
    </div>
  );
}
