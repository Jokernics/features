import ConfirmDialog from "../Tip/ConfirmDialog";
import Tip from "../Tip/Tip";

export default function TipExample() {
  return (
    <div className="flex">
      <textarea className="resize-x" value={"22"} disabled />
      {[
        { str: "Пони зеленый", color: "green" },
        { str: "Пони крассный", color: "red" },
        { str: "Пони синий", color: "blue" },
      ].map((obj) => {
        return (
          <Tip tipText="Текст подсказки">
            <div className="contents">
              <span style={{ backgroundColor: obj.color }} className="flex-1">
                {obj.str}
              </span>
            </div>
          </Tip>
        );
      })}
    </div>
  );
}
