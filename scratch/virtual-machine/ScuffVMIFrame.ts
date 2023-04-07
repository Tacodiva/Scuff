import { ScuffVM } from "./ScuffVM";
import { ScuffVMConfigIFrame } from "./ScuffVMConfig";
import { VMChildboundMessage } from "../messages";
import LLK from "./llk";

export class ScuffVMIFrame extends ScuffVM {

    public static create(config: ScuffVMConfigIFrame): Promise<ScuffVMIFrame> {
        return new Promise((resolve, error) => {
            window.parent.postMessage({
                type: "handshake",
                id: config.id
            }, "*");
            window.addEventListener("message", (message: MessageEvent<VMChildboundMessage>) => {
                if (message.data.type !== "handshake")
                    return error(new Error(`Expected parent to respond with "handshake" message but got "${message.data.type}".`));
                resolve(new ScuffVMIFrame(config));
            }, true);
        });
    }

    public readonly iframeID: string;

    private constructor(config: ScuffVMConfigIFrame) {
        super(config, document.body);
        this.iframeID = config.id;
    }
}