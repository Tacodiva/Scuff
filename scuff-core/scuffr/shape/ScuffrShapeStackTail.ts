import { ScuffrShapeStackBody } from "./ScuffrShapeStackBody";

export class ScuffrShapeStackTail extends ScuffrShapeStackBody {
    public override createBottomPath(): string {
        return `a 4 4 0 0 1 -4 4 H -4 a 4 4 0 0 1 -4 -4 z`;
    }
}