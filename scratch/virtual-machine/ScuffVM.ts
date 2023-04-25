import { ScuffVMTypeMap } from ".";
import { ScuffVMConfig } from "./ScuffVMConfig";
import DANGO_SVG, { CAT_SVG } from "./cat";
import LLK from "./llk";

export abstract class ScuffVM {

    public readonly type: keyof ScuffVMTypeMap;

    public readonly canvas: HTMLCanvasElement;
    public readonly renderer: RenderWebGL;

    public constructor(config: ScuffVMConfig, target: HTMLElement) {
        this.type = config.type;

        this.canvas = target.appendChild(document.createElement("canvas"));
        this.renderer = new LLK.renderEngine(this.canvas);
        this.renderer.draw();

        this.renderer.setLayerGroupOrdering(["group1"]);
        const drawableID = this.renderer.createDrawable("group1");
        this.renderer.updateDrawableProperties(drawableID, {
            position: [0, 0],
            scale: 100,
            direction: 90
        });

        // createDrawable returns a number not void
        const drawableID2 = this.renderer.createDrawable("group1");

        // createSVGSkin returns a number not an SVGSkin. I think this is the same with all the create___Skin methods
        const skinId = this.renderer.createSVGSkin(CAT_SVG, [50, 50]);

        this.renderer.updateDrawableSkinId(drawableID2, skinId);

        this.renderer.resize(480, 360);

        const drawStep = () => {
            this.renderer.updateDrawableEffect(drawableID2, LLK.renderEngine.Effect.Whirl, Math.sin(Date.now() * 0.0005) * 200)
            this.renderer.updateDrawableEffect(drawableID2, LLK.renderEngine.Effect.Color, Math.sin(Date.now() * 0.0001) * 100)
            this.renderer.draw();
            requestAnimationFrame(drawStep);
        }
        drawStep();
        // this.renderer.draw();
    }

    public start() {
    }

    public destroy() {
        
    }
}