import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrShapeContentLine } from "./ScuffrShapeContentLine";
import type { ScuffrShapeStackBody } from "./ScuffrShapeStackBody";

export interface ScuffrShapeModifier {
    getPath(size: Vec2, shape: ScuffrShapeStackBody, line: ScuffrShapeContentLine): string | null;
}