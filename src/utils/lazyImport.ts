import { FC, lazy, LazyExoticComponent } from "react";

const CHECK_LOAD_TIMER = 1000;

/**
 * lazy который не падает при ошибке, а пытается загрузиться снова, показывая fallback все время
 */
export function lazyImport<T extends object>(fileImport: () => Promise<{ default: FC<T> }>): LazyExoticComponent<FC<T>> {
  return lazy(() => {
    return new Promise<{ default: React.FC<T> }>((resolve) => {
      const tryToLoad = (): void => {
        const checkLoadAccessibility = (): void => {
          setTimeout(() => {
            tryToLoad();
          }, CHECK_LOAD_TIMER);
        };

        if (navigator.onLine) {
          fileImport()
            .then((file) => {
              resolve(file);
            })
            .catch(checkLoadAccessibility);
        } else {
          checkLoadAccessibility();
        }
      };

      tryToLoad();
    });
  });
}
