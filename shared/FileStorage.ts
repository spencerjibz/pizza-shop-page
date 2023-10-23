import { Storage, OrderRecord } from './common';
import fs from 'fs';
class FileStorage implements Storage {
    private path: string = 'store.json';

    private backingStore: Record<string, OrderRecord> | null = {};
    constructor(path?: string) {
        if (path) {
            this.path = path;
        }

        try {
            this.createFile();
            const data = fs.readFileSync(this.path, 'utf8');
            this.backingStore = JSON.parse(data);
        } catch (e) {
            console.log('Error reading file', e);
        }
    }
    
    getOrders(): Record<string, OrderRecord> {
        return this.backingStore || {};
    }
    addOrder(key: string, order: OrderRecord): void {
        if (this.backingStore && !this.exists(key)) {
            this.backingStore[key] = order;
            this.save();
        }
      
    }
    removeOrder(key: string): void {
        if (this.backingStore && !this.exists(key)) {
            delete this.backingStore[key];
            this.save();
        } else {

            throw new Error('Order not found');
        }
    }
    clearOrders(): void {
        this.backingStore = {};
        this.save();
    }
    updateOrder(key: string, order: OrderRecord): void {
        if (!this.backingStore || !this.exists(key)) throw new Error('Order not found');

        this.backingStore[key] = order;
        this.save();
    }
    exists(key: string): boolean {
        return !!this.backingStore && !!this.backingStore[key];
    }

    private save() {
        const store = this.backingStore;
        // delete the existing file;an
        let done = false;

        if (store) {
            const str = JSON.stringify(store, null, 2);
            fs.unlinkSync(this.path);

            fs.writeFileSync(this.path, str, 'utf8');
            done = true;
        }

        return done;
    }
    createFile() {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, '{}', 'utf8');
        }
    }

    getOrder(key: string): OrderRecord | null {
        if (!this.backingStore) return null;
        return this.backingStore[key] || null;
    }
}
export const fileStorage = new FileStorage();
