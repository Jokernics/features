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
      {/* <div
        className="mt-8 w-fit"
        onMouseDown={() => {
          setIsTipPositionOpen(false);
        }}
        onMouseUp={() => {
          setIsTipPositionOpen(true);
        }}
      >
        <button>CLICKCKCK</button>
        <TipPositionHelper
          isOpen={isTipPositionOpen}
          tip={<div>TipPositionHelperProps</div>}
          customCords={({ tipEl }) => {
            return { top: tipEl.offsetHeight, left: tipEl.offsetLeft }
          }}
          // customCords={({ contentEl, tipEl, contentMetrics }) => {
          //   return { top: contentMetrics.top - contentEl.offsetHeight, left: contentMetrics.left }
          // }}
          noContent
        >
          <span>TipPositionHelpers</span>
        </TipPositionHelper>
      </div> */}
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
