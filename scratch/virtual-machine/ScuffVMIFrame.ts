import { ScuffVM } from "./ScuffVM";
import { ScuffVMConfigIFrame } from "./ScuffVMConfig";
import LLK from "./llk";
import { MessageReceiverMap, Messenger } from "../shared/Messenger";
import { VMChildboundMessages, VMParentboundMessages } from "../shared/messages";

export class ScuffVMIFrame extends ScuffVM {

    public readonly messenger: Messenger<VMChildboundMessages, VMParentboundMessages>;

    public constructor(config: ScuffVMConfigIFrame) {
        super(config, document.body);
        this.messenger = new Messenger(
            message => window.parent.postMessage(message, "*"),
            this._messages
        );
        window.addEventListener("message", this._messageListener);
        this.messenger.send('handshake');
    }

    public override destroy() {
        window.removeEventListener("message", this._messageListener);
        super.destroy();
    }

    private _messageListener = (e: MessageEvent<any>) => {
        this.messenger.receive(e.data);
    }

    private readonly _messages: MessageReceiverMap<VMChildboundMessages> = {

    }
}