import { Order, Storage } from './common';

export class BrowerStorage implements Storage {
    _backingStore = window.localStorage;
    static instance: BrowerStorage;

    private constructor() {}
    public static getInstance(): BrowerStorage {
        if (!BrowerStorage.instance) {
            BrowerStorage.instance = new BrowerStorage();
        }
        return BrowerStorage.instance;
    }

    getOrders(): Map<string, Order> {
        const entries = Object.entries(this._backingStore);

        return new Map(entries.map(([key, value]) => [key, JSON.parse(value)]));
    }

    addOrder(key: string, order: Order) {
        this._backingStore.setItem(key, JSON.stringify(order));
    }

    removeOrder(key: string) {
        this._backingStore.removeItem(key);
    }
    clearOrders() {
        this._backingStore.clear();
    }

    updateOrder(key: string, order: Order) {
        this._backingStore.setItem(key, JSON.stringify(order));
    }
}

export const browserStorage = BrowerStorage.getInstance();
