export function waitForSalesIQ(cb: () => void) {
  const maxWaitMs = 10000;
  const start = Date.now();
  const t = setInterval(() => {
    const api = (window as any).$zoho?.salesiq;
    const hasApi =
      api &&
      typeof api === "object" &&
      api.floatwindow &&
      typeof api.floatwindow.visible === "function" &&
      api.chatwindow &&
      typeof api.chatwindow.visible === "function";

    if (hasApi) {
      clearInterval(t);
      cb();
    } else if (Date.now() - start > maxWaitMs) {
      clearInterval(t);
      console.warn("[SalesIQ] timed out waiting for API");
    }
  }, 50);
}