import { ScuffEditorLoadingComponent } from 'scuff';
import vmSource from '../../virtual-machine.js.txt';
import { EXT } from '../ScuffScratch';
import { VMChildboundMessages, VMParentboundMessages } from '../../shared/messages';
import { Messenger } from '../../shared/Messenger';
import vmMessageHandlers from './messages';

export class ProjectIFrame {

    public readonly target: HTMLElement;
    public readonly frame: HTMLIFrameElement;
    public get frameWindow() { return this.frame.contentWindow as any; }

    private readonly _messenger: Messenger<VMParentboundMessages, VMChildboundMessages>;
    private _completedHandshake: boolean;

    public constructor(target: HTMLElement) {
        this.target = target;

        this.frame = target.appendChild(document.createElement("iframe"));
        this.frame.setAttribute("sandbox", "allow-scripts");
        this.frame.classList.add("project-frame");

        this._completedHandshake = false;
        this._messenger = new Messenger<VMParentboundMessages, VMChildboundMessages>(
            (message) => this.frame.contentWindow!.postMessage(message, "*"),
            vmMessageHandlers(this)
        );
        window.addEventListener("message", this._messageListener);

        this.frame.setAttribute("srcdoc", `<!DOCTYPE html>
        <html>
            <head>
            </head>
            <body style="margin: 0;">
                <script src='lib/require.js'></script>
                <script>${vmSource}</script>
                <script>
                    createScuffVM({
                        type: "IFrame",
                        libs: {
                            scratchAudio: "${EXT.getResourcePath("lib/scratch-audio.js")}",
                            scratchRender: "${EXT.getResourcePath("lib/scratch-render.min.js")}",
                        }
                    }).then(vm => {
                        window.vm = vm;
                        vm.start();
                    });
                </script>
            </body>
        </html>`);

        this.frame.style.display = "none";
        new ScuffEditorLoadingComponent({ target });
    }

    public remove() {
        this.frame.remove();
        window.removeEventListener("message", this._messageListener);
    }

    private _messageListener = (e: MessageEvent<any>) => {
        if (e.source !== this.frameWindow) return;
        this._messenger.receive(e.data);
    }

    public handshake() {
        if (this._completedHandshake) throw new Error("Already completed the handshake!");
        this.target.children[1].remove(); // Remove the loading twirl
        this.frame.style.display = "";
        this._completedHandshake = true;
    }
}