import { useEffect } from "react";
import { useEvent } from "./useEvent";

type prmsType = {
  onIntersecting: () => void;
  elementRef: React.RefObject<HTMLElement>;
};

const observerOptions = {
  root: document.querySelector("#scrollArea"),
  rootMargin: "0px",
  threshold: 1.0,
};

export const useIntersectionObserver = ({
  onIntersecting,
  elementRef,
}: prmsType) => {
  const onIntersectingRef = useEvent(onIntersecting);

  useEffect(() => {
    if (!elementRef.current) return;

    const callback = function (entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
      const intersecting = entries[0].isIntersecting;

      if (intersecting) onIntersectingRef()
    };
    const observer = new IntersectionObserver(callback, observerOptions);

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, onIntersectingRef]);
};
