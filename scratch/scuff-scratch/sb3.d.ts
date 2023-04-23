
type ProjectSB3Extension = "pen" | "wedo2" | "music" | "microbit" | "text2speech" | "translate" | "videoSensing" | "ev3" | "makeymakey" | "boost" | "gdxfor";

export type ProjectSB3Variable = [
    name: string,
    value: string | number,
    isCloud?: true
];

export type ProjectSB3List = [
    name: string,
    value: (string | number)[]
];

export const enum ProjectSB3InputValueType {
    SHADOW_ONLY = 1,
    INPUT_ONLY = 2,
    SHADOWED_INPUT = 3
}

export const enum ProjectSB3InputValueType {
    NUMBER = 4,
    POSITIVE_NUMBER = 5,
    POSITIVE_INTEGER = 6,
    INTEGER = 7,
    ANGLE = 8,
    COLOR = 9,
    STRING = 10,
    BROADCAST = 11,
    VARIABLE = 12,
    LIST = 13
}

export type ProjectSB3InputValueNumber = [
    type: ProjectSB3InputValueType.NUMBER | ProjectSB3InputValueType.POSITIVE_NUMBER | ProjectSB3InputValueType.POSITIVE_INTEGER | ProjectSB3InputValueType.INTEGER | ProjectSB3InputValueType.ANGLE,
    /** The number value. */
    value: string
];

export type ProjectSB3InputValueColor = [
    type: ProjectSB3InputValueType.COLOR,
    /** '#' followed by a hexadecimal number representing the color */
    value: string
];

export type ProjectSB3InputValueString = [
    type: ProjectSB3InputValueType.STRING,
    /** The string value. */
    value: string
];

export type ProjectSB3InputValueNameID = [
    type: ProjectSB3InputValueType.BROADCAST | ProjectSB3InputValueType.VARIABLE | ProjectSB3InputValueType.LIST,
    /** The name of the broadcast, variable or list as shown in the editor. */
    name: string,
    /** The ID of the broadcast, variable or list. */
    id: string,
];

export type ProjectSB3InputValue = string | ProjectSB3InputValueNumber | ProjectSB3InputValueColor | ProjectSB3InputValueString | ProjectSB3InputValueNameID;

export const enum ProjectSB3InputType {
    SHADOW_ONLY = 1,
    INPUT_ONLY = 2,
    SHADOWED_INPUT = 3
}

export type ProjectSB3InputShadowOnly = [
    type: ProjectSB3InputType.SHADOW_ONLY,
    shadow: ProjectSB3InputValue
];

export type ProjectSB3InputInputOnly = [
    type: ProjectSB3InputType.INPUT_ONLY,
    input: ProjectSB3InputValue
];

export type ProjectSB3InputShadowedInput = [
    type: ProjectSB3InputType.INPUT_ONLY,
    input: ProjectSB3InputValue,
    shadow: ProjectSB3InputValue
];

export type ProjectSB3Input = ProjectSB3InputShadowOnly | ProjectSB3InputInputOnly | ProjectSB3InputShadowedInput;

export type ProjectSB3Field = [
    value: string | number,
    /** The ID of the field's value. On present on certain fields. */
    id?: string
];

interface ProjectSB3MutationBase {
    tagName: "mutation",
    children: [],
}

export interface ProjectSB3MutationProcedure extends ProjectSB3MutationBase {
    /** The name of the custom block, including inputs: %s for string/number inputs and %b for boolean inputs. */
    proccode: string;
    /** An array of the ids of the arguments; these can also be found in the input property of the main block. */
    argumentids: string[];
    /** True if this block runs without screen refresh. */
    warp: boolean;
}

export interface ProjectSB3MutationProcedurePrototype extends ProjectSB3MutationProcedure {
    /** An array of the names of the arguments. */
    argumentnames: string[];
    /** An array of the defaults of the arguments. For round inputs this is "" and for booleans it's false. */
    argumentdefaults: ("" | false)[];
}

export interface ProjectSB3MutationControlStop extends ProjectSB3MutationBase {
    /** True if this block can have a block following it or not. True for stop other scripts in sprite otherwise false.  */
    hasnext: boolean;
}

export type ProjectSB3Mutation = ProjectSB3MutationProcedure | ProjectSB3MutationProcedurePrototype | ProjectSB3MutationControlStop;


interface ProjectSB3BlockBase {
    /** A string naming the block. */
    opcode: string;
    /** The ID of the following block */
    next: string | null;
    /** 
     * If the block is a stack block and is preceded, this is the ID of the preceding block. 
     * If the block is the first stack block in a C mouth, this is the ID of the C block. 
     * If the block is an input to another block, this is the ID of that other block.
     * Otherwise it is null. 
     */
    parent: string | null;
    /** 
     * An object associating input names with the ID of the block inside the input, or an array
     * representing the value of the input.
     */
    inputs: Record<string, ProjectSB3Input>;
    /**
     * An object associating field names and their values.
     */
    fields: Record<string, ProjectSB3Field>;
    /** True if this block is a shadow. */
    shadow: boolean;
    /** True if this block has no parent. */
    topLevel: boolean;
    /** The ID of the attached comment, if there is one. */
    comment?: string;
    /** Present when opcode is "procedures_call", "procedures_prototype" or "control_stop". */
    mutation?: ProjectSB3Mutation;
}

export interface ProjectSB3BlockTopLevel extends ProjectSB3BlockBase {
    topLevel: true;
    x: number;
    y: number;
}

export interface ProjectSB3BlockInput extends ProjectSB3BlockBase {
    topLevel: false;
}

export type ProjectSB3Block = ProjectSB3BlockTopLevel | ProjectSB3BlockInput;

export interface ProjectSB3Comment {
    /** The ID of the block the comment is attached to. */
    blockId: string;
    /** The x-coordinate of the comment. */
    x: number;
    /** The y-coordinate of the comment. */
    y: number;
    /** The width of the comment. */
    width: number
    /** The height of the comment. */
    height: number
    /** True if the comment is collapsed. */
    minimized: boolean;
    /** The content of the comment. */
    text: string;
}

interface ProjectSB3Asset {
    /** The MD5 hash of the asset file. */
    assetId: string;
    name: string;
    /** The name of the asset file. */
    md5ext: string;
    dataFormat: string;
}

export interface ProjectSB3Costume extends ProjectSB3Asset {
    /** The reciprocal of the scaling factor, if this costume is a bitmap. */
    bitmapResolution?: number;
    /** The x-coordinate of the center of the image. */
    rotationCenterX: number;
    /** The y-coordinate of the center of the image. */
    rotationCenterY: number;
}

export interface ProjectSB3Sound {
    /** The sample rate of the sound in Hz. */
    rate: number;
    /** The number of samples in the sound. */
    sampleCount: number;
}

interface ProjectSB3TargetBase {
    isStage: boolean;
    name: string;
    /** A record associating IDs with variables.  */
    variables: Record<string, ProjectSB3Variable>;
    /** A record associating IDs with lists.  */
    lists: Record<string, ProjectSB3List>;
    /** A record associating broadcast IDs with their name. Normally only present in the stage. */
    broadcasts?: Record<string, string>;
    /** A record associating IDs with lists.  */
    blocks: Record<string, ProjectSB3Block>;
    /** A record associating IDs with comments.  */
    comments: Record<string, ProjectSB3Comment>;
    /** The index in the costumes array of the current costume.  */
    currentCostume: number;
    costumes: ProjectSB3Costume[];
    sounds: ProjectSB3Sound[];
    /** The layer of the current sprite. Sprites with a higher layer are shown infront of those with a lower layer. */
    layerOrder: number;
    volume: number;
}

export interface ProjectSB3Sprite extends ProjectSB3TargetBase {
    isStage: false;
    visible: boolean;
    x: number;
    y: number;
    size: number;
    direction: number;
    draggable: boolean;
    rotationStyle: "all around" | "left-right" | "don't rotate";
}

export interface ProjectSB3Stage extends ProjectSB3TargetBase {
    isStage: true;
    name: "Stage";
    layerOrder: 0;
    tempo: number;
    /** If "on" or "on-flipped", video is visible on the stage. If "on-flipped" the video is flipped. */
    videoState: "on" | "off" | "on-flipped",
    videoTransparency: number;
    /** The language of the TTS extension. Defaults to the editor's language. */
    textToSpeechLanguage?: string;
}

export type ProjectSB3Target = ProjectSB3Sprite | ProjectSB3Stage;

interface ProjectSB3MonitorBase {
    /** The ID of this monitor. */
    id: string;
    mode: string;
    /** The opcode of the block the monitor belongs to. */
    opcode: string;
    /** An object associating names of inputs of the block the monitor belongs to with their values. */
    params: Record<string, string | number>;
    /** The name of the target the monitor belongs to, if any. */
    spriteName?: string;
    width: number;
    height: number;
    x: number;
    y: number;
    visible: boolean;
}

export interface ProjectSB3MonitorVariable extends ProjectSB3MonitorBase {
    mode: "default" | "large" | "slider";
    /** The value appearing on the monitor. */
    value: number | string;

    sliderMin: number;
    sliderMax: number;
    /** True if the monitor's slider allows only integer values. */
    isDiscrete: boolean;
}

export interface ProjectSB3MonitorList extends ProjectSB3MonitorBase {
    mode: "list";
    /** The values appearing on the monitor. */
    value: (number | string)[];
}

export type ProjectSB3Monitor = ProjectSB3MonitorVariable | ProjectSB3MonitorList;

export interface ProjectSB3 {
    targets: ProjectSB3Target[],
    monitors: ProjectSB3Monitor[],

    meta: {
        /** Semantic Version */
        semver: "3.0.0",
        /** VM Version, like 0.2.0 */
        vm: string,
        /** The user agent of the client which created this SB3. */
        agent: string
    },

    /** An array of the identifiers of the extensions used. */
    extensions: (string | ProjectSB3Extension)[],
}