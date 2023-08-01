import { useState } from "react";
import ConfirmDialog from "../Tip/ConfirmDialog";
import TipPositionHelper from "../Tip/TipPositionHelper";
import useTip from "../../hooks/useTip";
import Tip from "../Tip/Tip";

export default function TipExample() {
  const [isTipPositionOpen, setIsTipPositionOpen] = useState(true);

  console.log("ererene");

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
            <Tip 
              key={i}
              tipContent='Tip'
            >
              <ConfirmDialog key={i}>
                <div className="contents">
                  <span style={{ backgroundColor: obj.color }} className="flex-1">
                    {obj.str}
                  </span>
                </div>
              </ConfirmDialog>
            </Tip>
          );
        })}
      </div>
      <Tip
        tipContent={'tip '}
        containerClassName="w-fit  ml-32"
      >
        <div style={{ width: 103 }} className=" bg-slate-300 w-fit">
          sdffsdf
        </div>
      </Tip
      >
    </div>
  );
}
