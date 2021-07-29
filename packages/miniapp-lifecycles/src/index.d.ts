declare module 'miniapp-lifecycles' {
  export function registerNativeEventListeners(Klass: any, events: string[]);
  export function addNativeEventListener(eventName: string, callback: any);
  export function removeNativeEventListener(eventName: string, callback: any);
}
