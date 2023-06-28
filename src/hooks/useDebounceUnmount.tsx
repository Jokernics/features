import { useEffect, useState } from "react";

export function useDebounceUnmount({ opened, animation_time = 200 }: { opened: boolean; animation_time?: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (opened && !mounted) {
      setMounted(true);
    } else if (!opened && mounted) {
      setTimeout(() => {
        setMounted(false)
      }, animation_time);
    }
  }, [animation_time, mounted, opened]);

  return { mounted };
}
