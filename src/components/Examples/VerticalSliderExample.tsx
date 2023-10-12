import { useState } from "react";
import VerticalSlider from "../Inputs/VerticalSlider";

export default function VerticalSliderExample() {
  const [currentIndex, setCurrentIndex] = useState(1);

  return (
    <div className="p-3 flex-col gap-2 h-screen w-screen flex items-center justify-center">
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