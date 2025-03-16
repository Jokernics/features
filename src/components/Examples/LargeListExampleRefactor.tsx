import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { rangeType } from "../../hooks/useRenderLargeList";
import { getIndexForMap } from "../../utils/utils";
import VerticalSlider from "../VerticalSlider";
import { faker } from "@faker-js/faker";
import useRenderLargeListRefactor from "../../hooks/useRenderLargeListRefactor";
import { useOverflowAnchor } from "../../hooks/useOverfloAuto/useOverflowAnchor";

const totalCount = 122;
const initialIndex = 10;
const fakeData2 = Array.from({ length: totalCount }).map((_, index) => ({
  index,
  desc: faker.lorem.lines({ min: 11, max: 13 }),
}));
let tempIndex = 0;

export default function LargeListExampleRefactor() {
  const [miniMapIndex, setMiniMapIndex] = useState(initialIndex);
  const [fakeData, setFakeData] = useState(fakeData2);

  const handleScroll = useCallback(
    (e: Event, range: rangeType | null) => {
      if (range) {
        const newMapIndex = getIndexForMap(range, fakeData.length);
        setMiniMapIndex(newMapIndex);
      }
    },
    [fakeData.length]
  );

  const LargeListInstance = useRenderLargeListRefactor({
    total: fakeData.length,
    initialIndex,
    onScroll: handleScroll,
  });

  const handleMiniMapScroll = (i: number) => {
    setMiniMapIndex(i);

    LargeListInstance.renderRowsByIndex(i);
  };

  const miniMapContainerRef = useRef<HTMLDivElement | null>(null);
  const [miniMapContainerMetrics, setMiniMapContainerMetrics] = useState<{ height: number; width: number } | null>(null);

  const getHeightOfMiniMapContainer = useCallback(() => {
    if (miniMapContainerRef.current) {
      const { offsetHeight, offsetWidth } = miniMapContainerRef.current;

      setMiniMapContainerMetrics({ height: offsetHeight, width: offsetWidth });
    }
  }, []);

  useLayoutEffect(() => {
    getHeightOfMiniMapContainer();
  }, []);

  const disableCorrection = useRef(false);
  const { scrollCorrectionRef } = useOverflowAnchor({
    disableCorrection,
    scrollContainerRef: LargeListInstance.scrollElementRef,
  });

  return (
    <div className="h-full flex flex-col items-center justify-center grow shrink-0 gap-6">
      <div className="flex gap-5 justify-start w-full">
        <button
          onClick={() => {
            const getExamples = (count: number) => {
              const examples = Array.from({ length: count }).map((_, i) => {
                tempIndex--;

                return { index: tempIndex, desc: faker.lorem.lines({ min: 11, max: 13 }) };
              });

              return examples.reverse();
            };

            const count = 500

            setFakeData((prev) => [...getExamples(count), ...prev]);

            LargeListInstance.setWhtenAddTotheTop(count);

          }}
        >
          Add to Start
        </button>
      </div>
      <div className="flex w-full grow gap-6">
        <div
          ref={LargeListInstance.scrollElementRef}
          className="grow overflow-auto border border-t-0 font-mono-light text-xs"
          style={{
            height: "100%",
            width: "100%",
            overflowY: "auto",
            contain: "strict",
            overflowAnchor: 'none'
          }}
        >
          {LargeListInstance.rowIndexes.map((cacheIndex) => {
            const key = fakeData[cacheIndex].index;
            // const key = cacheIndex

            return (
              <div
                key={key}
                className="flex w-full p-4"
                data-index={cacheIndex}
                data-row={true}
                ref={scrollCorrectionRef}
                data-overflow-anchor={key}
              >
                {fakeData[cacheIndex].index} {fakeData[cacheIndex].desc}
              </div>
            );
          })}
        </div>
        <div className="w-32 h-full mr-auto" ref={miniMapContainerRef}>
          <VerticalSlider
            scrollHeight={miniMapContainerMetrics?.height}
            onChange={handleMiniMapScroll}
            currentIndex={miniMapIndex}
            totalCount={fakeData.length}
          />
        </div>
      </div>
    </div>
  );
}
