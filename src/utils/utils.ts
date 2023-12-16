import { rangeType } from "../hooks/useRenderLargeList";

export const getRange = (scrollElement: HTMLDivElement) => {
  const children = scrollElement.children;

  const range = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (!(child instanceof HTMLElement)) continue;

    const { offsetHeight, scrollTop } = scrollElement;

    const isInView = scrollTop <= child.offsetTop && scrollTop + offsetHeight >= child.offsetTop;

    if (!isInView) continue;

    const index = child.dataset.index;

    if (index === undefined) continue;

    range.push(+index);
  }

  if (range.length < 2) return null;

  return { startIndex: range[0], endIndex: range[range.length - 1] };
};

export const getIndexForMap = (range: rangeType, total: number) => {
  console.log('range', range)
  if (range.endIndex >= total) return total;
  if (range.startIndex === 1) return 1
  return range.startIndex;
};