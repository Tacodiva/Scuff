
interface VMMessageBase {
    type: string;
}

export interface VMChildboundMessageBase extends VMMessageBase { }
export interface VMParentboundMessageBase extends VMMessageBase {
    id: string;
}

export interface VMParentboundHandshakeMessage extends VMParentboundMessageBase {
    type: "handshake"
}

export interface VMChildboundHandshakeMessage extends VMChildboundMessageBase {
    type: "handshake"
}

export type VMParentboundMessage = VMParentboundHandshakeMessage;
export type VMChildboundMessage = VMChildboundHandshakeMessage;

