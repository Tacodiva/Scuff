import type { Vec2 } from "../../utils/Vec2";
import { ScuffrShape } from "./ScuffrShape";
import type { ScuffrShapeContentLine } from "./ScuffrShapeContentLine";

export abstract class ScuffrShapeInput extends ScuffrShape {
    public override createPath(size: Vec2, lines: ScuffrShapeContentLine[]): string {
        if (lines.length !== 1 || lines[0].modifier)
            throw new Error("Input shapes do not support multiple lines.");
        return this._inputCreatePath(size);
    }

    protected abstract _inputCreatePath(size: Vec2) : string;
}