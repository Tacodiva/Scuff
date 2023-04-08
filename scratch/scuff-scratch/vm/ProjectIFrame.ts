import { ScuffEditorLoadingComponent } from 'scuff';
import vmSource from '../../virtual-machine.js.txt';
import { VMChildboundMessage, VMParentboundMessage } from "../../messages";
import { EXT } from '../ScuffScratch';

export class ProjectIFrame {

    public readonly target: HTMLElement;
    public readonly frame: HTMLIFrameElement;
    public get frameWindow() { return this.frame.contentWindow as any; }
    public readonly id: string;

    private _completedHandshake: boolean;

    public constructor(target: HTMLElement) {
        this.target = target;

        this.frame = target.appendChild(document.createElement("iframe"));
        this.id = "" + Math.floor(Math.random() * 1e16);
        this.frame.setAttribute("sandbox", "allow-scripts");
        this.frame.classList.add("project-frame");

        window.addEventListener("message", this._messageListener);
        this._completedHandshake = false;

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
                        id: "${this.id}",
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

    private _messageListener = (e: MessageEvent<VMParentboundMessage>) => {
        if (e.data.id !== this.id) return;
        if (!this._completedHandshake) {
            if (e.data.type != "handshake")
                throw new Error(`Expected handhake from iframe but got "${e.data.type}".`);
            this.sendMessage({ type: "handshake" });
            this.target.children[1].remove(); // Remove the loading twirl
            this.frame.style.display = "";
        }
    }

    public sendMessage(data: VMChildboundMessage) {
        this.frameWindow.postMessage(data, "*");
    }
}