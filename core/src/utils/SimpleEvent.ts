

type SimpleEventListener<Args extends any[]> = (...args: Args) => void | boolean;

export class SimpleEvent<Args extends any[] = []> {

    private _listeners: SimpleEventListener<Args>[];

    public constructor() {
        this._listeners = [];
    }

    public addListener(listener: SimpleEventListener<Args>, start?: boolean) {
        if (start) {
            this._listeners.splice(0, 0, listener);
        } else {
            this._listeners.push(listener);
        }
    }

    public addListenerAfter(listener: SimpleEventListener<Args>, before: SimpleEventListener<Args>) {
        this._listeners.splice(this._listeners.indexOf(before) + 1, 0, listener);
    }

    public addListenerBefore(listener: SimpleEventListener<Args>, after: SimpleEventListener<Args>) {
        this._listeners.splice(this._listeners.indexOf(after), 0, listener);
    }

    public removeListener(listener: SimpleEventListener<Args>): boolean {
        const index = this._listeners.indexOf(listener);
        if (index === -1) return false;
        this._listeners.splice(index, 1);
        return true;
    }

    public emit(...args: Args) {
        for (const listener of this._listeners)
            if (listener(...args)) break;
    }
}