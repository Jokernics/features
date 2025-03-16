import { VIRTUAL_LIST_SCROLL_RESTORATION_STORAGE } from "./constants";
import { ScrollRestorationDataType } from "./types";

export const getScrollRestorationData = (): ScrollRestorationDataType => {
  const savedScrollRestorationData = sessionStorage.getItem(
    VIRTUAL_LIST_SCROLL_RESTORATION_STORAGE
  );

  return savedScrollRestorationData
    ? JSON.parse(savedScrollRestorationData)
    : {};
};

export const setScrollRestorationData = (
  data: ScrollRestorationDataType
): void => {
  sessionStorage.setItem(
    VIRTUAL_LIST_SCROLL_RESTORATION_STORAGE,
    JSON.stringify(data)
  );
};

const getLocation = (): string =>
  `scroll_${window.location.pathname}${window.location.search}`;

export const getScrollRestorationKey = (customKey?: string): string =>
  customKey || getLocation();
