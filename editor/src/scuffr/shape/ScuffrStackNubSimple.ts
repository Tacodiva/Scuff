import type { ScuffrStackNub } from "./ScuffrStackNub";

export class ScuffrStackNubSimple implements ScuffrStackNub {

    public static readonly defaultNub = new ScuffrStackNubSimple(12, 12, 8, 8);

    public readonly width: number;
    public readonly height: number;
    public readonly padding: number;
    public readonly inclineDist: number;

    private readonly _rightPath: string;
    private readonly _leftPath: string;

    public constructor(width: number, inclineDist: number, height: number, padding: number) {
        this.width = width;
        this.padding = padding;
        this.height = height;
        this.inclineDist = inclineDist;

        // I don't wanna talk about how long this took to work out xD
        let curveHeight = this.height / 4;
        let lineHight = this.height / 2;
        let segmentWidth = inclineDist / 3;
        let lineGradient = lineHight / segmentWidth;
        this._leftPath = `c ${-segmentWidth / 2} 0 ${1 - segmentWidth} ${curveHeight - lineGradient} ${-segmentWidth} ${curveHeight} l ${-segmentWidth} ${lineHight} c -1 ${lineGradient} ${segmentWidth / 2 - segmentWidth} ${curveHeight} ${-segmentWidth} ${curveHeight} h ${-this.width} c ${-segmentWidth / 2} 0 ${1 - segmentWidth} ${lineGradient - curveHeight} ${-segmentWidth} ${-curveHeight} l ${-segmentWidth} ${-lineHight} c -1 ${-lineGradient} ${segmentWidth / 2 - segmentWidth} ${-curveHeight} ${-segmentWidth} ${-curveHeight} h ${-this.padding}`;
        this._rightPath = `h ${this.padding} c ${segmentWidth / 2} 0 ${segmentWidth - 1} ${curveHeight - lineGradient} ${segmentWidth} ${curveHeight} l ${segmentWidth} ${lineHight} c 1 ${lineGradient} ${segmentWidth - segmentWidth / 2} ${curveHeight} ${segmentWidth} ${curveHeight} h ${this.width} c ${segmentWidth / 2} 0 ${segmentWidth - 1} ${lineGradient - curveHeight} ${segmentWidth} ${-curveHeight} l ${segmentWidth} ${-lineHight} c 1 ${-lineGradient} ${segmentWidth - segmentWidth / 2} ${-curveHeight} ${segmentWidth} ${-curveHeight}`;
    }

    public getLeftPath(endX: number): string {
        return `H ${endX + this.inclineDist * 2 + this.width + this.padding} ` + this._leftPath;
    }

    public getRightPath(): string {
        return this._rightPath;
    }
}