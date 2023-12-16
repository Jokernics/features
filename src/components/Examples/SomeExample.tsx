import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useEvent } from '../../hooks/useEvent';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomString = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

let id = 0

type objType = { id: number, str: string }

const getStr = () => generateRandomString(getRandomInt(4, 1000))
const getObj = (): objType => {
  const res = { id, str: getStr() }
  id++
  return res
}

const getStrByLenght = (length?: number) => {
  if (!length) return [getObj()]

  let res: objType[] = []
  for (let index = 0; index < length; index++) {
    res = [...res, getObj()]
  }

  return res
}
const initialListItems = Array.from({ length: 100 }).map(getObj)

const Button = ({ className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button className={`${className} border rounded-lg px-2 py-1 bg-slate-200 hover:bg-slate-300 transition-all`} {...props} />
}
const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <input className={`${className}border rounded-lg pl-2`} {...props} />
}

const topElementHeightInitial = 50

const isChildInTopOfView = (scrollElement: HTMLElement, child: HTMLElement) => {
  const { scrollTop } = scrollElement;

  return scrollTop >= child.offsetTop
}
const isChildInView = (scrollElement: HTMLElement, child: HTMLElement) => {
  const { offsetHeight, scrollTop } = scrollElement;

  return scrollTop <= child.offsetTop + child.offsetHeight && scrollTop + offsetHeight >= child.offsetTop;
}

const newItemsCount = 1

export default function SomeExample() {
  const [listItems, setListItems] = useState(initialListItems)
  const [topElementHeightInput, setTopElementHeightInput] = useState(topElementHeightInitial)
  const [topElementHeight, setTopElementHeight] = useState(topElementHeightInitial)
  const [elementHeights, setElementHeights] = useState<Record<string, number>>({})
  const [changeElementsHeightsInputValue, setChangeElementsHeightsInputValue] = useState('0')
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const overflowAnchorData = useRef<Record<string, number>>({})
  console.log(elementHeights)
  const prevSum = useRef(0)
  const sum = useRef(0)

  const addToStart = () => {
    setListItems([...getStrByLenght(newItemsCount), ...listItems])
  }
  const addToEnd = () => {
    setListItems([...listItems, ...getStrByLenght(newItemsCount)])
  }
  const changeTopElementHeight = () => {
    setTopElementHeight(topElementHeightInput)
  }
  const changeHeightOfElementForAWhile = () => {
    const prevHeight = overflowAnchorData.current[changeElementsHeightsInputValue]
    setElementHeights(prev => ({ ...prev, [changeElementsHeightsInputValue]: 500 }))

    setTimeout(() => {
      setElementHeights(prev => ({ ...prev, [changeElementsHeightsInputValue]: prevHeight }))
    }, 2000);

  }


  useLayoutEffect(() => {
    const containerEl = scrollContainerRef.current

    if (prevSum.current && sum.current && containerEl) {
      const newElementHeight = sum.current - prevSum.current
      console.log('correction')
      containerEl.scrollTop = containerEl.scrollTop + newElementHeight
    }

    prevSum.current = sum.current

  }, [listItems.length])

  // const handleResizeObserver = useCallback((entries: ResizeObserverEntry[]) => {
  //   const height = entries[0].contentBoxSize[0].blockSize
  //   const scrollContainerInnerPrevHeight = scrollContainerInnerPrevHeightRef.current
  //   const scrollContainer = scrollContainerRef.current


  //   if (scrollContainerInnerPrevHeight) {
  //     const heightDifference = height - scrollContainerInnerPrevHeight
  //     console.log(heightDifference)

  //     if (scrollContainer) {
  //       // scrollContainer.scrollTop = scrollContainer.scrollTop + heightDifference
  //     }
  //   }

  //   scrollContainerInnerPrevHeightRef.current = height
  // }, [])

  //resize observer start
  const handleResizeObserver = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.target instanceof HTMLElement) {
        const overflowAnchorId = entry.target.dataset.overflowAnchor

        if (overflowAnchorId) {
          const prevHeight = overflowAnchorData.current[overflowAnchorId]
          const height = entry.contentBoxSize[0].blockSize

          if (prevHeight) {
            const heightDifference = height - prevHeight
            const containerEl = scrollContainerRef.current

            if (containerEl) {
              const isInTopofViewOfParent = isChildInTopOfView(containerEl, entry.target);

              if (isInTopofViewOfParent) {
                containerEl.scrollTop = containerEl.scrollTop + heightDifference
              }
            }
          }
          overflowAnchorData.current[overflowAnchorId] = height
        }
      }
    }
  }, [])
  const handleResizeObserverEvent = useEvent(handleResizeObserver)

  const resizeObserverRef = useRef(new ResizeObserver(handleResizeObserverEvent))

  const childRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      resizeObserverRef.current.observe(el)
    }

    if (el && !scrollContainerRef.current) {
      sum.current += el.offsetHeight
    } else if (el && scrollContainerRef.current) {

      const isInViewOfParent = isChildInView(scrollContainerRef.current, el)
      const isInTopofViewOfParent = isChildInTopOfView(scrollContainerRef.current, el)

      if (isInViewOfParent || isInTopofViewOfParent) {
        sum.current += el.offsetHeight
      }
    }
  }, [])

  useEffect(() => {
    const resizeObserver = resizeObserverRef.current

    return () => {
      resizeObserver.disconnect()
    }
  }, [])


  return (
    <div className='flex flex-col grow gap-3'>
      <div className='p-2 flex justify-center items-center grow rounded-xl gap-2'>
        <div className='flex gap-2 pr-2 border-r'>
          <Input value={topElementHeightInput} onChange={(e) => { setTopElementHeightInput(+e.target.value) }} type='number' className='border rounded-lg' />
          <Button onClick={changeTopElementHeight}>Change Top elementHeight</Button>
        </div>
        <div className='flex gap-2 pr-2 border-r'>
          <Input value={changeElementsHeightsInputValue} onChange={(e) => { setChangeElementsHeightsInputValue(e.target.value) }} className='border rounded-lg' />
          <Button onClick={changeHeightOfElementForAWhile}>Change height of element to 2 s</Button>
        </div>
        <Button onClick={addToStart}>
          addToStart
        </Button>
        <Button onClick={addToEnd}>
          addToEnd
        </Button>
      </div>
      <div ref={scrollContainerRef} style={{ height: '90vh', overflow: 'auto', overflowAnchor: 'none' }} className='grow relative flex flex-col' >
        <div ref={childRef} data-overflow-anchor={'item1'} style={{ minHeight: topElementHeight, clear: 'both' }} className='bg-slate-200'> </div>
        {listItems.map((item, i) => {
          return (
            <div key={item.id} className='break-all' ref={childRef} style={{ minHeight: elementHeights[item.id] }} data-overflow-anchor={item.id}>
              <span className='text-red-400'>{item.id} </span>
              {item.str}
            </div>
          )
        })}
      </div>
    </div>
  )
}


