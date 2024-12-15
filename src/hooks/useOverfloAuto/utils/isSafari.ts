export const isSafari = (): boolean => {
  return (
    !!navigator.vendor.match(/apple/i) &&
    !navigator.userAgent.match(/crios/i) &&
    !navigator.userAgent.match(/fxios/i) &&
    !navigator.userAgent.match(/Opera|OPT\//)
  );
};
