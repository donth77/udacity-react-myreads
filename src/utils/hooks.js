import { useEffect, useCallback } from "react";
import { debounce } from "lodash";

export function useDebounce(callback, delay = 1000, deps = []) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCallback = useCallback(debounce(callback, delay), [
    delay,
    ...deps,
  ]);
  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCallback, delay, ...deps]);
  return debouncedCallback;
}
