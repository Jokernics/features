import { faker } from '@faker-js/faker'

import { useVirtualizer, Virtualizer } from '@tanstack/react-virtual'
import useDebounce from '../hooks/useDebounce'
import { useRef, useState } from 'react'
import { useThrottle } from '../hooks/useThrottle'


const randomNumber = (min: number, max: number) =>
  faker.number.int({ min, max })

const sentences = new Array(10000)
  .fill(true)
  .map(() => faker.lorem.sentence(randomNumber(20, 70)))

export default function RowVirtualizerDynamic() {
  const parentRef = useRef<HTMLDivElement>(null)
  const [cache, setCache] = useState<Record<number, string>>({})



  const getData = async (startIndex: number, endIndex: number) => {
    let isAllItemsCached = true

    for (let i = startIndex; i <= endIndex; i++) {
      if (!cache.hasOwnProperty(i)) isAllItemsCached = false
    }

    if (isAllItemsCached) return

    const res = await fetch('https://jsonplaceholder.typicode.com/comments/2')
    const data = await res.json()
    const str = data.body + data.name

    let newData: Record<number, string> = {}
    for (let i = startIndex; i <= endIndex; i++) {
      newData[i] = str
    }

    setCache(p => ({ ...p, ...newData }))
  }


  const handleChange = async (instance: Virtualizer<HTMLDivElement, Element>) => {
    const { startIndex, endIndex } = instance.range
    console.log(startIndex, endIndex)

    getData(startIndex, endIndex)
  }

  const handleChangeDebounce = useDebounce(handleChange, 500)


  const count = sentences.length
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    onChange: handleChangeDebounce
  })

  const items = virtualizer.getVirtualItems()

  return (
    <div className='w-screen h-screen flex flex-col'>
      <div className='flex'>
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
            virtualizer.scrollToIndex(count / 2)
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
              transform: `translateY(${items[0].start}px)`,
            }}
          >
            {items.map((virtualRow) => {
              const isItemLoaded = cache.hasOwnProperty(virtualRow.index)

              return <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={
                  virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'
                }
              >
                {!isItemLoaded && <div>Loading...</div>}
                {isItemLoaded && <div style={{ padding: '10px 0' }}>
                  <div>{cache[virtualRow.index]}</div>
                </div>}
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}