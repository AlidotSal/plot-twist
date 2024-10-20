export const clamp = (val: number, min = 0, max = 1): number => Math.min(Math.max(val, min), max);

export function throttleRAF(callback: () => void) {
  let queuedCallback: (() => void) | undefined = undefined;
  requestAnimationFrame(() => {
    const cb = queuedCallback;
    queuedCallback = undefined;
    if (cb) {
      cb();
    }
  });
  queuedCallback = callback;
}
