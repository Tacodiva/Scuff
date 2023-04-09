
export type MessengerMessages = Record<string, (...args: any[]) => any>
export type MessageReceiver<Messages extends MessengerMessages, T extends keyof Messages> = (...args: Parameters<Messages[T]>) => ReturnType<Messages[T]> | Promise<ReturnType<Messages[T]>>;
export type MessageReceiverMap<Messages extends MessengerMessages> = { [T in keyof Messages]: MessageReceiver<Messages, T> };

export interface RequestMessage<Messages extends MessengerMessages, T extends keyof Messages = keyof Messages> {
    id: number,
    req: true,
    msg: T,
    args: Parameters<Messages[T]>
}

export interface ResponseMessage<Messages extends MessengerMessages, T extends keyof Messages = keyof Messages> {
    id: number,
    req: false,
    ret: ReturnType<Messages[T]>
}

type Message<Messages extends MessengerMessages> = RequestMessage<Messages> | ResponseMessage<Messages>;
type MessageSender<Messages extends MessengerMessages> = (msg: Message<Messages>) => void;

export class Messenger<InboundMessages extends MessengerMessages, OutboundMessages extends MessengerMessages> {

    public readonly receivers: MessageReceiverMap<InboundMessages>;
    public readonly sender: MessageSender<OutboundMessages>;

    private _lastTransationID;
    private _transactionResolvers: Map<number, ((...args: any[]) => void) | null>;

    public constructor(sender: MessageSender<OutboundMessages>, receivers: MessageReceiverMap<InboundMessages>) {
        this.receivers = receivers;
        this.sender = sender;
        this._lastTransationID = 0;
        this._transactionResolvers = new Map();
    }

    public send<T extends keyof OutboundMessages>(msg: T, ...args: Parameters<OutboundMessages[T]>): Promise<ReturnType<OutboundMessages[T]>> {
        return new Promise(resolve => {
            const id = ++this._lastTransationID;
            this._transactionResolvers.set(id, resolve);
            this.sender({ id, req: true, msg, args });
        });
    }

    public receive(msgAny: any) {
        if (!msgAny.id)
            throw new Error(`Invalid message received. '${JSON.stringify(msgAny)}'.`)
        const msgObj = msgAny as Message<InboundMessages>;
        if (msgObj.req) {
            const receiver = this.receivers[msgAny.msg];
            if (!receiver)
                throw new Error(`Unknown message received '${String(msgObj.msg)}'.`);
            const response = receiver(...msgObj.args) as any;

            if (typeof response === 'object' && typeof response.then === 'function') {
                response.then((response: any) => {
                    this._sendResponse(msgObj.id, response);
                });
            } else {
                this._sendResponse(msgObj.id, response);
            }
        } else {
            const resolver = this._transactionResolvers.get(msgObj.id);
            if (resolver === undefined)
                throw new Error(`Unknown transaction '${msgObj.id}'.`);
            this._transactionResolvers.delete(msgObj.id);
            if (resolver)
                resolver(msgObj.ret);
        }
    }

    private _sendResponse(id: number, ret: any) {
        this.sender({ id, req: false, ret });
    }
}