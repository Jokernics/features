import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWindowEvent } from "../../hooks/useWindowEvent";

type props = {
  currentIndex: number;
  totalCount: number;
  onChange: (currentIndex: number) => void;
  height?: number;
};

const minScrollheight = 50;

export default function VerticalSlider({ currentIndex, totalCount, onChange, height = 300 }: props) {
  const scrollHeight = useMemo(() => {
    console.log('1aa1', height / totalCount)
    return Math.max(minScrollheight, height / totalCount)
  }, [height, totalCount]);

  const getScrollInitialPosition = useCallback(() => {
    console.log('currentIndex', currentIndex)
    console.log('totalCount', totalCount)
    const procent = Math.min(totalCount, currentIndex) / totalCount;
    console.log(procent);

    return procent * (height - scrollHeight);
  }, [currentIndex, height, scrollHeight, totalCount])
  const dragAreaRef = useRef<HTMLDivElement | null>(null);
  const scrollBarRef = useRef<HTMLDivElement | null>(null);
  const isMouseDownRef = useRef(false)
  const offsetRef = useRef<number | null>(null)


  const [scrollOffestTop, setScrollOffestTop] = useState(() => getScrollInitialPosition())

  const prevScrollOffestTop = useRef<null | number>(null)

  const scrollOffestBottom = useMemo(() => {
    return height - scrollOffestTop - scrollHeight;
  }, [height, scrollHeight, scrollOffestTop]);


  useEffect(() => {
    console.log('here')
    setScrollOffestTop(getScrollInitialPosition())
  }, [currentIndex, getScrollInitialPosition, totalCount])


  useWindowEvent('mouseup', () => {
    isMouseDownRef.current = false
  })

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isMouseDownRef.current || !offsetRef.current) return

    const newHeight = event.clientY + offsetRef.current

    if (newHeight > height - scrollHeight || newHeight < 0) return

    setScrollOffestTop(newHeight)
    const countRate = newHeight / (height - scrollHeight)

    const newCount = Math.max(1, Math.round(countRate * totalCount))

    onChange(newCount)
  }, [height, onChange, scrollHeight, totalCount])

  useWindowEvent('mousemove', handleMouseMove)

  return (
    <div ref={scrollBarRef} style={{ height }} className="relative border-l-[1px] border-l-slate-200">
      <div className="" style={{ height: scrollOffestTop }}></div>
      <div

        ref={dragAreaRef}
        onMouseDown={(e) => {
          isMouseDownRef.current = true
          if (dragAreaRef.current) {
            offsetRef.current = dragAreaRef.current.offsetTop - e.clientY
            console.log(offsetRef.current)
            console.log(dragAreaRef.current.offsetTop)
            console.log(e.clientY)
          }
        }}

        className="flex select-none items-center h-[50px] ml-[-0.22em] cursor-s-resize gap-2"
        style={{ height: scrollHeight }}
      >
        <div className="w-[0.35em] h-full border-r-[0.8em] bg-blue-300"></div>
        <div className="">число ПИ</div>
      </div>
      <div className="" style={{ height: scrollOffestBottom }}></div>
    </div>
  );
}
