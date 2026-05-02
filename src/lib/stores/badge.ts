import { writable } from 'svelte/store';

export type BadgeType = 'success' | 'error' | 'info' | 'warning';

export interface BadgeMessage {
    id: number;
    text: string;
    type: BadgeType;
}

function createBadgeStore() {
    const { subscribe, set, update } = writable<BadgeMessage[]>([]);
    let nextId = 1;

    return {
        subscribe,
        show: (text: string, type: BadgeType = 'info', durationMs: number = 3000) => {
            const id = nextId++;
            update(messages => [...messages, { id, text, type }]);
            
            setTimeout(() => {
                update(messages => messages.filter(m => m.id !== id));
            }, durationMs);
        },
        remove: (id: number) => {
            update(messages => messages.filter(m => m.id !== id));
        },
        clear: () => set([])
    };
}

export const badge = createBadgeStore();
