import { faker } from '@faker-js/faker'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useScrollRestoration } from '../hooks/useScrollRestoration/useScrollRestoration'
import { waitUntilDOMUpdate } from '../hooks/useOverfloAuto/utils/waitUntilDOMUpdate'
import { useOverflowAnchor } from '../hooks/useOverfloAuto/useOverflowAnchor'


const randomNumber = (min: number, max: number) =>
  faker.number.int({ min, max })

const getValue = () => {
  return faker.lorem.sentence(randomNumber(20, 70))
}

let index = 0

const sentences = new Array(100_000)
  .fill(true)
  .map((_, i) => ({
    id: `${i}`,
    value: getValue()
  }))


export default function RowVirtualizerDynamic() {
  const parentRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState(sentences)

  const count = data.length


  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    getItemKey: (index) => data[index].id,
    overscan: 1,
    
  })

  const items = virtualizer.getVirtualItems()


  const getRestorationData = useScrollRestoration({ scrollContainerRef: parentRef, virtualizer })
  const restorationDataRef = useRef(getRestorationData())
  const handleScrollRestoration = useCallback(() => {
    const restoda = getRestorationData()

    restorationDataRef.current = restoda
  }, [getRestorationData])


  const makeRestorationByIndex = useCallback((index: number) => {
    const restorationData = restorationDataRef.current
    const isAboveTop = virtualizer.range ? virtualizer.range.startIndex > index : false

    console.log('isAbove', virtualizer.range, index, isAboveTop)

    if (restorationData && isAboveTop) {
      const scrollCorrectionByOffset = (): void => {
        virtualizer.scrollBy(restorationData.offset);
      };

      const scrollCorrectionByRangeStartIndex = (): void => {
        virtualizer.scrollToIndex(restorationData.index, {
          align: "start",
        });
        //можно и один requestAnimationFrame, но возникают траблы с модалкой
        // virtualizer зарендерит по индексу, ждем, делаем корректировку в карточке по оффсету
        waitUntilDOMUpdate(scrollCorrectionByOffset);
      };

      // ждем пока tanstack зарендерится, можно и один requestAnimationFrame, но возникают траблы с модалкой - мб анимация открытия
      waitUntilDOMUpdate(scrollCorrectionByRangeStartIndex);

    }
  }, [virtualizer])

  const inputDeleteRef = useRef<HTMLInputElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const disableCorrection = useRef(false)
  const { scrollCorrectionRef } = useOverflowAnchor({ disableCorrection, scrollContainerRef: parentRef })

  return (
    <div className=' h-screen flex flex-col'>
      <div className='flex gap-4 '>
        <button onClick={() => {
          const createItem = () => {
            index--

            return { value: getValue(), id: `${index}` }
          }

          const createArr = (count: number) => {
            return Array.from({ length: count }).map(createItem).reverse()
          }

          const count = 200

          setData(prev => [...createArr(count), ...prev])

          makeRestorationByIndex(-200)
        }}>Add to Start</button>

        <div className='flex gap-2'>
          <input ref={inputDeleteRef} />
          <button onClick={() => {
            if (inputDeleteRef) {
              const inputValue = inputDeleteRef.current?.value || ''

              setData(prev => {
                const copy = [...prev]
                const index = copy.findIndex(el => el.id === inputValue)

                copy.splice(index, 1)

                return copy
              })
            }

          }}>delete</button>
        </div>

        <button onClick={() => {
          setData(prev => [...prev, { id: `${data.length + 1}`, value: getValue() }])
        }}>Add to End</button>

        <button onClick={() => {
          setIsLoading(p => !p)
        }}>Toggle isLoading</button>

        <button
          onClick={() => {
            virtualizer.scrollToIndex(0)
          }}
        >
          scroll to the top
        </button>
        <span style={{ padding: '0 4px' }} />
        <button
          onClick={() => {
            virtualizer.scrollToIndex(Math.round(count / 2))
          }}
        >
          scroll to the middle
        </button>
        <span style={{ padding: '0 4px' }} />
        <button
          onClick={() => {
            virtualizer.scrollToIndex(count - 1)
          }}
        >
          scroll to the end
        </button>
      </div>
      <hr />
      <div

        ref={parentRef}
        className="grow"
        style={{
          height: "100%",
          width: '100%',
          overflowY: 'auto',
          contain: 'strict',
        }}
        onScroll={handleScrollRestoration}
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${items[0]?.start}px)`,
              overflowAnchor: 'none'
            }}
          >
            <div data-overflow-anchor={'s'} ref={scrollCorrectionRef}>
              {isLoading && <span>Loading...</span>}
            </div>
            {items.map((virtualRow) => {
              return <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={
                  virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'
                }
              >
                <div style={{ padding: '10px 0' }}>
                  <div>{data[virtualRow.index].id} {data[virtualRow.index].value} {virtualRow.index}</div>
                </div>
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}