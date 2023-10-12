import { faker } from '@faker-js/faker'

import { useVirtualizer, Virtualizer } from '@tanstack/react-virtual'
import useDebounce from '../hooks/useDebounce'
import { useRef, useState } from 'react'
import { useThrottle } from '../hooks/useThrottle'


const randomNumber = (min: number, max: number) =>
  faker.number.int({ min, max })

const getRandomId = () => Math.random().toString(36).slice(2)

const getValue = () => {
  return faker.lorem.sentence(randomNumber(20, 70))
}

const sentences = new Array(10000)
  .fill(true)
  .map((_, i) => ({
    id: Math.random().toString(36).slice(2),
    value: getValue()
  }))

export default function RowVirtualizerDynamic() {
  const parentRef = useRef<HTMLDivElement>(null)
  const [cache, setCache] = useState<Record<string, string>>({})
  const [data, setData] = useState(sentences)

  const getData = async (startIndex: number, endIndex: number) => {
    let isAllItemsCached = true

    for (let i = startIndex; i <= endIndex; i++) {
      if (!cache.hasOwnProperty(i)) isAllItemsCached = false
    }

    if (isAllItemsCached) return

    const res = await fetch('https://jsonplaceholder.typicode.com/comments/2')
    const resData = await res.json()
    const str = resData.body + resData.name

    let newData: Record<string, string> = {}
    for (let i = startIndex; i <= endIndex; i++) {
      const id = data[i].id
      newData[id] = str
    }

    setCache(p => ({ ...p, ...newData }))
  }


  const handleChange = async (instance: Virtualizer<HTMLDivElement, Element>) => {
    const { startIndex, endIndex } = instance.range
    console.log(startIndex, endIndex)

    getData(startIndex, endIndex)
  }

  const handleChangeDebounce = useDebounce(handleChange, 100)


  const count = data.length
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    onChange: handleChangeDebounce,
getItemKey: (index) => data[index].id

  })

  const items = virtualizer.getVirtualItems()
  console.log(count)
  return (
    <div className='w-screen h-screen flex flex-col'>
      <div className='flex'>
        <button onClick={() => {
          setData(prev => [{ value: getValue(), id: getRandomId() }, ...prev])
        }}>Add to Start</button>
        <button onClick={() => {
          setData(prev => [...prev, { id: getRandomId(), value: getValue() }])
        }}>Add to End</button>
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
              const id = data[virtualRow.index].id
              const isItemLoaded = cache.hasOwnProperty(id)

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
                  <div>{cache[id]}</div>
                </div>}
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}