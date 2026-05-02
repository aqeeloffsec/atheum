export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

const createToastStore = () => {
    let toasts = $state<ToastMessage[]>([]);
    let idCounter = 0;
    
    return {
        get toasts() { return toasts; },
        add: (message: string, type: ToastType = "info", duration: number = 4000) => {
            const id = idCounter++;
            toasts = [...toasts, { id, message, type }];
            if (duration > 0) {
                setTimeout(() => {
                    toasts = toasts.filter(t => t.id !== id);
                }, duration);
            }
        },
        remove: (id: number) => {
            toasts = toasts.filter(t => t.id !== id);
        }
    };
};

export const toast = createToastStore();
