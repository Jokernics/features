import { useEffect, useState } from "react";

export function useDebounceUnmount({ opened, delay = 200 }: { opened: boolean; delay?: number }) {
  const [mounted, setMounted] = useState(() => opened);

  useEffect(() => {
    if (opened && !mounted) {
      setMounted(true);
    } else if (!opened && mounted) {
      setTimeout(() => {
        setMounted(false);
      }, delay);
    }
  }, [delay, mounted, opened]);

  return { mounted };
}
