import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Хук, возвращающий типизированный useSearchParams
 */
export const useTypedSearchParams = <T extends { [key: string]: string }>(): [
  Partial<T>,
  (newParams: Partial<T>, needReplace?: boolean) => void
] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const typedSearchParams = Object.fromEntries(searchParams) as Partial<T>;

  const changeSearchParams = useCallback(
    (newParams: Partial<T>, needReplace = false): void => {
      for (const [key, value] of Object.entries(newParams)) {
        if (value !== undefined) {
          searchParams.set(key, value);
        } else {
          searchParams.delete(key);
        }
      }

      setSearchParams(searchParams, { replace: needReplace });
    },
    [searchParams, setSearchParams]
  );

  return [typedSearchParams, changeSearchParams];
};
