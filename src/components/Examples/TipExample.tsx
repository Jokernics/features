import { useRef, useState } from "react";
import ConfirmDialog from "../Tip/ConfirmDialog";
import TipPositionHelper from "../Tip/TipPositionHelper";
import useTip from "../../hooks/useTip";
import Tip from "../Tip/Tip";
import { useAddEventListener } from "../../hooks/useAddEventListener";

export default function TipExample() {
  const [isTipPositionOpen, setIsTipPositionOpen] = useState(true);

  const semeRef = useRef<HTMLDivElement>(null)
  useAddEventListener(semeRef, 'click', () => {
    console.log('click')
  })

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
            <ConfirmDialog key={i} 
              ref={semeRef}
              containerClassName="flex flex-1"
            >
              <div className="contents">
                <span style={{ backgroundColor: obj.color }} className="flex-1">
                  {obj.str}
                </span>
              </div>
            </ConfirmDialog>
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
