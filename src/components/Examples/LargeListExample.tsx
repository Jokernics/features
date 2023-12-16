import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import useRenderLargeList, { rangeType } from '../../hooks/useRenderLargeList';
import { getIndexForMap } from '../../utils/utils';
import VerticalSlider from '../VerticalSlider';
import { faker } from '@faker-js/faker';

const totalCount = 12
const initialIndex = 12
const fakeData = Array.from({ length: totalCount }).map(() => faker.lorem.lines({ min: 11, max: 13 }))

export default function LargeListExample() {
  const [miniMapIndex, setMiniMapIndex] = useState(initialIndex)


  const handleScroll = useCallback(
    (e: Event, range: rangeType | null) => {


      if (range) {
        const newMapIndex = getIndexForMap(range, totalCount)
        console.log('newMapIndex', newMapIndex)
        setMiniMapIndex(newMapIndex);
      }
      console.log('handleScroll')
    },
    [setMiniMapIndex]
  );

  const LargeListInstance = useRenderLargeList({
    total: totalCount,
    initialIndex,
    onScroll: handleScroll,
  });

  const handleMiniMapScroll = (i: number) => {
    console.log('index', i)
    setMiniMapIndex(i)

    LargeListInstance.renderRowsByIndex(i)
  }

  const miniMapContainerRef = useRef<HTMLDivElement | null>(null)
  const [miniMapContainerMetrics, setMiniMapContainerMetrics] = useState<{ height: number, width: number } | null>(null)

  const getHeightOfMiniMapContainer = useCallback(() => {
    if (miniMapContainerRef.current) {
      const { offsetHeight, offsetWidth } = miniMapContainerRef.current

      setMiniMapContainerMetrics({ height: offsetHeight, width: offsetWidth })
    }
  }, [])

  useLayoutEffect(() => {
    getHeightOfMiniMapContainer()
  }, [])

  return (
    <div className='h-full flex items-center justify-center grow shrink-0 gap-6'>
      <div
        ref={LargeListInstance.scrollElementRef}
        className="grow overflow-auto border border-t-0 font-mono-light text-xs scroll-hide"
        style={{
          height: "100%",
          width: "100%",
          overflowY: "auto",
          contain: "strict",
        }}
      >
        {LargeListInstance.rowIndexes.map((cacheIndex, i) => {
          return (
            <div
              key={cacheIndex}
              className="flex w-full p-4"
              data-index={cacheIndex}
              data-row={true}
            >
              {cacheIndex} {fakeData[cacheIndex]}
            </div>
          );
        })}
      </div>
      <div className='w-32 h-full' ref={miniMapContainerRef}>
        <VerticalSlider
          scrollHeight={miniMapContainerMetrics?.height}
          onChange={handleMiniMapScroll}
          currentIndex={miniMapIndex}
          totalCount={totalCount} />
      </div>    </div>
  )
}
