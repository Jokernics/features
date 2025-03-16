export const waitUntilDOMUpdate = (callback: VoidFunction): void => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      callback();
    });
  });
};
