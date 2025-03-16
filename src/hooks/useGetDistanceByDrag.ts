import { useCallback, useRef } from "react";
import { useAddEventListener } from "./useAddEventListener";
import { useWindowEvent } from "./useWindowEvent";

type metricsType = { x: number; y: number };

export const useGetDistanceByDrag = (onDrag: ({ x, y }: metricsType) => void) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isMouseDownRef = useRef(false);
  const prevOffsetRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!ref.current) return;

    console.log("handleMouseDown", e.clientX);
    isMouseDownRef.current = true;
    prevOffsetRef.current = { x: ref.current.offsetLeft - e.clientX, y: ref.current.offsetTop - e.clientY };
  }, []);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    isMouseDownRef.current = false;
    prevOffsetRef.current = null;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isMouseDownRef.current || !prevOffsetRef.current || !ref.current) return;

      console.log("handleMouseMove", e.clientX);
      const newOffset = { x: e.clientX + prevOffsetRef.current.x + ref.current.offsetWidth, y: e.clientY + prevOffsetRef.current.y };

      onDrag(newOffset);
    },
    [onDrag]
  );

  useAddEventListener(ref, "mousedown", handleMouseDown);
  useWindowEvent("mousemove", handleMouseMove);
  useWindowEvent("mouseup", handleMouseUp);

  return { ref };
};
