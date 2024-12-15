import { useCallback, useEffect, useRef, useState } from 'react'
import { useEvent } from './SomeExample'

let timerCount = 0

export default function SomeExample2() {
  const [elementHeights, setElementHeights] = useState<string[]>([])
  const elementRef = useRef<HTMLDivElement>(null)
  const isIntersected = useRef(false)
  const [isFirstTimeLoad, setIsFirstTimeLoad] = useState(true)


  const addElements = useCallback(() => {
    console.log('preload add Elements')

    setTimeout(() => {
      console.log('add Elements')

      setElementHeights(prev => {
        const newHeights = [...prev, ...Array.from({ length: 25 }).map(() => '12344')]

        return newHeights
      })

      timerCount++
    }, 2000);
  }, [])

  const addElementsRef = useEvent(addElements)

  useEffect(() => {
    let options = {
      rootMargin: "0px",
      threshold: 1.0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          addElementsRef()
        }

        isIntersected.current = entry.isIntersecting
      })
    }

    const observer = new IntersectionObserver(handleIntersection, options);

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }


    return () => {
      observer.disconnect()
    }
  }, [addElementsRef])

  useEffect(() => {
    if (elementHeights.length) {
      setIsFirstTimeLoad(false)
    }

  }, [elementHeights.length])


  useEffect(() => {
    console.log('preload correction ')

    setTimeout(() => {
      if (isIntersected.current && !isFirstTimeLoad) {
        console.log('correction')

        addElementsRef()
      }
    }, 500);
  }, [addElementsRef, isFirstTimeLoad])

  console.log('timerCount', timerCount)

  return (
    <div>
      <button onClick={addElements}>Add Elements</button>
      <div>
        {elementHeights.map((el, i) => {
          return <div key={i}>{el}</div>
        })}
        <div ref={elementRef} className='min-w-full bg-slate-100 min-h-[3px]'></div>
      </div>
    </div>

  )
}
