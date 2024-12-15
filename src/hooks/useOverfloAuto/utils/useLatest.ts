import { MutableRefObject, useInsertionEffect, useRef } from "react";

/**
 * Хук, который оборачивает переменные в реф. Используется, например, для переменных в useEffect,
 * которые не должны триггериться при изменении этой самой переменной
 * @param value значение
 * @returns ref этой переменной
 */

export const useLatest = function <Value>(
  value: Value
): MutableRefObject<Value> {
  const latestValue = useRef(value);

  useInsertionEffect(() => {
    latestValue.current = value;
  });

  return latestValue;
};
