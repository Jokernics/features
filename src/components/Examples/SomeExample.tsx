import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useOverflowAnchorAuto } from '../../hooks/useOverflowAnchorAuto';

export function useEvent<T extends Function>(fn: T) {
  const fnRef = useRef(fn);

  useLayoutEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const eventCb = useCallback(
    (...args: unknown[]) => {
      return fnRef.current.apply(null, args);
    },
    [fnRef]
  );

  return eventCb as unknown as T;
}

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

const Button = ({ style, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button style={{ padding: '0.5rem', background: '#c7b9b9', borderRadius: '1rem', ...style }} {...props} />
}
const Input = ({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <input style={{ border: '1px solid #c7b9b9', borderRadius: '0.3rem', paddingLeft: '0.5rem' }} {...props} />
}

const newItemsCount = 10

export default function SomeExample() {
  const [listItems, setListItems] = useState(initialListItems)
  const [elementHeights, setElementHeights] = useState<Record<string, number>>({})
  const [changeElementsHeightsInputValue, setChangeElementsHeightsInputValue] = useState('0')

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const addToStart = () => {
    setListItems([...getStrByLenght(newItemsCount), ...listItems])
  }
  const addToEnd = () => {
    setListItems([...listItems, ...getStrByLenght(newItemsCount)])
  }

  const changeHeightOfElementForAWhile = () => {
    const el = document.querySelector(`[data-overflow-anchor='${changeElementsHeightsInputValue}']`)

    if (el) {
      const prevHeight = el.clientHeight

      setElementHeights(prev => ({ ...prev, [changeElementsHeightsInputValue]: 500 }))

      setTimeout(() => {
        setElementHeights(prev => ({ ...prev, [changeElementsHeightsInputValue]: prevHeight }))
      }, 2000);
    }
  }

  const { childRef } = useOverflowAnchorAuto({ scrollContainerRef })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', padding: '0.5rem', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} >
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', borderRight: '1px solid gray' }} >
          <Input value={changeElementsHeightsInputValue} onChange={(e) => { setChangeElementsHeightsInputValue(e.target.value) }} />
          <Button onClick={changeHeightOfElementForAWhile}>Change element height to 2 s</Button>
        </div>
        <Button onClick={addToStart}>
          addToStart
        </Button>
        <Button onClick={addToEnd}>
          addToEnd
        </Button>
      </div>
      <div ref={scrollContainerRef} style={{ height: '90vh', overflow: 'auto', overflowAnchor: 'none', position: 'relative', display: 'flex', flexDirection: 'column' }} >
        {listItems.map((item, i) => {
          return (
            <div key={item.id} ref={childRef} style={{ minHeight: elementHeights[item.id], wordBreak: 'break-all' }} data-overflow-anchor={item.id}>
              <span style={{ color: 'red' }}>{item.id} </span>
              {item.str}
            </div>
          )
        })}
      </div>
    </div>
  )
}


