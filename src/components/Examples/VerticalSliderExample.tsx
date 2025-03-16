import { useCallback, useMemo, useState } from "react";
import { useGetDistanceByDrag } from "../../hooks/useGetDistanceByDrag";
import VerticalSlider from "../Inputs/VerticalSlider";

export default function VerticalSliderExample() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [width, setWidth] = useState(20)

  const handleDrag: Parameters<typeof useGetDistanceByDrag>[0] = useCallback(
    ({ x, y }) => {
      console.log(x, y)

      setWidth(x)
    },
    [],
  )

  const { ref } = useGetDistanceByDrag(handleDrag)

  return (
    <div className="p-3 flex-col gap-2 h-screen w-screen flex  justify-center">
      <div className="relative">
        <div style={{
          width
        }} className="border flex justify-end"><div ref={ref} className="h-5 relative w-2 bg-slate-500"></div></div>
      </div>
      <input
        className="border"
        type="number"
        value={currentIndex}
        onChange={(e) => {
          setCurrentIndex(+e.target.value);
        }}

      />
      <VerticalSlider
        totalCount={4}
        onChange={(currentIndex) => {
          setCurrentIndex(currentIndex);
        }}
        currentIndex={currentIndex}
      />
    </div>

  );
}