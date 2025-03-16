import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { rangeType } from '../../hooks/useRenderLargeList';
import { getIndexForMap } from '../../utils/utils';
import VerticalSlider from '../VerticalSlider';
import { faker } from '@faker-js/faker';
import useRenderLargeListRefactor from '../../hooks/useRenderLargeListRefactor';
import { useOverflowAnchor } from '../../hooks/useOverfloAuto/useOverflowAnchor';

const totalCount = 12222
const initialIndex = 1222
const fakeData2 = Array.from({ length: totalCount }).map((_, index) => ({ index, desc: faker.lorem.lines({ min: 11, max: 13 }) }))
let tempIndex = 0

export default function LargeListExample() {
  const [miniMapIndex, setMiniMapIndex] = useState(initialIndex)
  const [fakeData, setFakeData] = useState(fakeData2)

  const handleScroll = useCallback(
    (e: Event, range: rangeType | null) => {


      if (range) {
        const newMapIndex = getIndexForMap(range, fakeData.length)
        setMiniMapIndex(newMapIndex);
      }
      console.log('handleScroll')
    },
    [fakeData.length]
  );

  const LargeListInstance = useRenderLargeListRefactor({
    total: fakeData.length,
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

  const disableCorrection = useRef(true)
  // const { scrollCorrectionRef } = useOverflowAnchor({ disableCorrection, scrollContainerRef: LargeListInstance.scrollElementRef })

  const test2 = useRef(1)

  return (
    <div className='h-full flex items-center justify-center grow shrink-0 gap-6'>
      <button onClick={
        () => {
          const getExample = () => {
            tempIndex--
            return { index: tempIndex, desc: faker.lorem.lines({ min: 11, max: 13 }) }
          }
          const mayExamples = Array.from({ length: 50 * test2.current }).map(() => getExample())
          setFakeData(prev => ([...mayExamples, ...prev]))

          test2.current++

        }
      }>Add to Start</button>
      <div
        ref={LargeListInstance.scrollElementRef}
        className="grow overflow-auto border border-t-0 font-mono-light text-xs"
        style={{
          height: "100%",
          width: "100%",
          overflowY: "auto",
          contain: "strict",
          // overflowAnchor: 'none'
        }}
      >
        {LargeListInstance.rowIndexes.map((cacheIndex, i) => {
          const key = fakeData[cacheIndex].index
          // const key = cacheIndex

          return (
            <div
              key={key}
              className="flex w-full p-4"
              data-index={cacheIndex}
              data-row={true}
              // ref={scrollCorrectionRef}
              data-overflow-anchor={key}
            >
              {fakeData[cacheIndex].index} {fakeData[cacheIndex].desc}
            </div>
          );
        })}
      </div>
      <div className='w-32 h-full' ref={miniMapContainerRef}>
        <VerticalSlider
          scrollHeight={miniMapContainerMetrics?.height}
          onChange={handleMiniMapScroll}
          currentIndex={miniMapIndex}
          totalCount={fakeData.length} />
      </div>    </div>
  )
}
