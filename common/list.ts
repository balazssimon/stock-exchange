
export class List<T> {
    private _items: T[];
    private _count: number;
    private _capacity: number;

    constructor() {
        this._count = 0;
        this._items = [];
        this._capacity = 1;
        this._items.length = this._capacity;
    }

    private ensureCapacity(capacity: number): void {
        if (this._capacity < capacity) {
            while (this._capacity < capacity) {
                this._capacity *= 2;
            }
            this._items.length = this._capacity;
        }
    }

    public get(index: number): T {
        return this._items[index];
    }

    public count(): number {
        return this._count;
    }

    public isEmpty(): boolean {
        return this._count == 0;
    }

    public clear(): void {
        this._count = 0;
    }

    public contains(item: T): boolean {
        return this.indexOf(item) >= 0;
    }

    public add(item: T): void {
        this.ensureCapacity(this._count+1);
        this._items[this._count] = item;
        ++this._count;
    }

    public addRange(items: T[]): void {
        if (items) {
            this.ensureCapacity(this._count+items.length);
            for (var i = 0; i < items.length; ++i) {
                this._items[this._count+i] = items[i];
            }
            this._count += items.length;
        }
    }

    public delete(index: number): T {
        var result: T = null;
        if (index >= 0 && index < this._count) {
            result = this._items[index];
            for (var i = index; i+1 < this._count; ++i) {
                this._items[i] = this._items[i+1];
            }
            --this._count;
        }
        return result;
    }

    public truncate(index: number): T {
        var result: T = null;
        if (index >= 0 && index < this._count) {
            this._count = index;
        }
        return result;
    }

    public remove(item: T): boolean {
        var index = this.indexOf(item);
        if (index >= 0) {
            this.delete(index);
            return true;
        } 
        return false;
    }

    public indexOf(item: T, fromIndex?: number): number {
        if (fromIndex == null) {
            fromIndex = 0;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this._items.length + fromIndex);
        }
        for (var i = fromIndex, j = this._items.length; i < j; i++) {
            if (this._items[i] == item)
                return i;
        }
        return -1;
    }

    public toArray(): T[] {
        var result: T[] = [];
        result.length = this._count;
        for (var i = 0; i < this._count; ++i) {
            result[i] = this._items[i];
        }
        return result;
    }

    public toString(): string {
        return "[" + this.toArray().toString() + "]";
    }
}
