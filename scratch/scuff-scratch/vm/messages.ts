import { MessageReceiverMap } from "../../shared/Messenger";
import { VMParentboundMessages } from "../../shared/messages";
import { ProjectIFrame } from "./ProjectIFrame";

export function vmMessageHandlers(iframe: ProjectIFrame) : MessageReceiverMap<VMParentboundMessages> {
    return {
        handshake() {
            iframe.handshake();
        }
    };
}

export default vmMessageHandlers;