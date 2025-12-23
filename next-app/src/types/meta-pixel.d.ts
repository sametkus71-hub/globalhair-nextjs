declare global {
    interface Window {
        fbq: (
            action: 'track' | 'trackCustom' | 'init',
            eventName: string,
            params?: Record<string, any>
        ) => void;
        _fbq: any;
    }
}

export { };
