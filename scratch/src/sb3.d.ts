export namespace SB3 {

    type ExtensionID = "pen" | "wedo2" | "music" | "microbit" | "text2speech" | "translate" | "videoSensing" | "ev3" | "makeymakey" | "boost" | "gdxfor";

    type Value = string | number | boolean;

    export type Variable = [
        name: string,
        value: Value,
        isCloud?: true
    ];

    export type List = [
        name: string,
        value: (Value)[]
    ];

    export const enum BlockInputType {
        SHADOW_ONLY = 1,
        INPUT_ONLY = 2,
        SHADOWED_INPUT = 3
    }

    export const enum BlockInputValueType {
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

    export type BlockInputValueSimple = [
        type: BlockInputValueType.NUMBER | BlockInputValueType.POSITIVE_NUMBER | BlockInputValueType.POSITIVE_INTEGER | BlockInputValueType.INTEGER | BlockInputValueType.ANGLE | BlockInputValueType.COLOR | BlockInputValueType.STRING,
        /** The number value. */
        value: string
    ];

    export type BlockInputValueNameID = [
        type: BlockInputValueType.BROADCAST | BlockInputValueType.VARIABLE | BlockInputValueType.LIST,
        /** The name of the broadcast, variable or list as shown in the editor. */
        name: string,
        /** The ID of the broadcast, variable or list. */
        id: string,
    ];

    export type InputValue = null | string | BlockInputValueSimple | BlockInputValueNameID;

    export type BlockInputShadowOnly<T extends InputValue = InputValue> = [
        type: BlockInputType.SHADOW_ONLY,
        shadow: T
    ];

    export type BlockInputInputOnly<T extends InputValue = InputValue> = [
        type: BlockInputType.INPUT_ONLY,
        input: T
    ];

    export type BlockInputShadowed<T extends InputValue = InputValue> = [
        type: BlockInputType.SHADOWED_INPUT,
        input: T,
        shadow: T
    ];

    export type BlockInput<T extends InputValue = InputValue> = undefined | BlockInputShadowOnly<T> | BlockInputInputOnly<T> | BlockInputShadowed<T>;

    type BlockFieldValue = [
        value: Value,
        id: null
    ];

    type BlockFieldID = [
        name: string,
        id: string
    ];

    export type BlockField = BlockFieldValue | BlockFieldID

    interface BlockMutation {
        tagName: "mutation",
        children: [],
    }

    export type TopLevelVariable = [
        type: BlockInputValueType.VARIABLE | BlockInputValueType.LIST,
        /** The name of the broadcast, variable or list as shown in the editor. */
        name: string,
        /** The ID of the broadcast, variable or list. */
        id: string,

        x: number,
        y: number
    ];

    export interface Comment {
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

    interface Asset {
        /** The MD5 hash of the asset file. */
        assetId: string;
        name: string;
        /** The name of the asset file. */
        md5ext: string;
        dataFormat: string;
    }

    export interface Costume extends Asset {
        /** The reciprocal of the scaling factor, if this costume is a bitmap. */
        bitmapResolution?: number;
        /** The x-coordinate of the center of the image. */
        rotationCenterX: number;
        /** The y-coordinate of the center of the image. */
        rotationCenterY: number;
    }

    export interface Sound extends Asset {
        /** The sample rate of the sound in Hz. */
        rate: number;
        /** The number of samples in the sound. */
        sampleCount: number;
    }

    interface TargetBase {
        isStage: boolean;
        name: string;
        /** A record associating IDs with variables.  */
        variables: Record<string, Variable>;
        /** A record associating IDs with lists.  */
        lists: Record<string, List>;
        /** A record associating broadcast IDs with their name. Normally only present in the stage. */
        broadcasts?: Record<string, string>;
        /** A record associating IDs with lists.  */
        blocks: Record<string, Block>;
        /** A record associating IDs with comments.  */
        comments: Record<string, Comment>;
        /** The index in the costumes array of the current costume.  */
        currentCostume: number;
        costumes: Costume[];
        sounds: Sound[];
        /** The layer of the current sprite. Sprites with a higher layer are shown infront of those with a lower layer. */
        layerOrder: number;
        volume: number;
    }

    export interface Sprite extends TargetBase {
        isStage: false;
        visible: boolean;
        x: number;
        y: number;
        size: number;
        direction: number;
        draggable: boolean;
        rotationStyle: "all around" | "left-right" | "don't rotate";
    }

    export interface Stage extends TargetBase {
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

    export type Target = Sprite | Stage;

    interface MonitorBase {
        /** The ID of this monitor. */
        id: string;
        mode: string;
        /** The opcode of the block the monitor belongs to. */
        opcode: string;
        /** An object associating names of inputs of the block the monitor belongs to with their values. */
        params: Record<string, Value>;
        /** The name of the target the monitor belongs to, if any. */
        spriteName?: string;
        width: number;
        height: number;
        x: number;
        y: number;
        visible: boolean;
    }

    export interface MonitorVariable extends MonitorBase {
        mode: "default" | "large" | "slider";
        /** The value appearing on the monitor. */
        value: number | string;

        sliderMin: number;
        sliderMax: number;
        /** True if the monitor's slider allows only integer values. */
        isDiscrete: boolean;
    }

    export interface MonitorList extends MonitorBase {
        mode: "list";
        /** The values appearing on the monitor. */
        value: (number | string)[];
    }

    export type Monitor = MonitorVariable | MonitorList;

    type BlockInputSubstack = BlockInput<string | null>;
    type BlockInputBoolean = BlockInput<string>;

    interface BlockPropertiesOperatorBool {
        inputs: {
            OPERAND1?: BlockInput,
            OPERAND2?: BlockInput
        },
        fields: {}
    }

    interface BlockPropertiesOperatorNum {
        inputs: {
            NUM1?: BlockInput,
            NUM2?: BlockInput
        },
        fields: {}
    }

    type Effect = "COLOR" | "FISHEYE" | "WHIRL" | "PIXELATE" | "MOSAIC" | "BRIGHTNESS" | "BRIGHTNESS";

    type BlockProperties = {
        looks_seteffectto: {
            inputs: {
                VALUE: BlockInput
            },
            fields: {
                EFFECT: [Effect, null]
            }
        }

        event_whenflagclicked: {},

        control_if: {
            inputs: {
                SUBSTACK: BlockInputSubstack,
                CONDITION: BlockInputBoolean
            }
        },
        control_forever: {
            inputs: {
                SUBSTACK: BlockInputSubstack,
            }
        },

        operator_add: BlockPropertiesOperatorNum,
        operator_equals: BlockPropertiesOperatorBool,

        data_setvariableto: {
            inputs: {
                VALUE: BlockInput
            },
            fields: {
                VARIABLE: BlockFieldID
            }
        }

    };

    interface BlockBase {
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
         * An object associating input names and their values.
         */
        inputs: {};
        /**
         * An object associating field names and their values.
         */
        fields: {};

        /** True if this block is a shadow. */
        shadow: boolean;
        /** True if this block has no parent. */
        topLevel: boolean;
        /** The ID of the attached comment, if there is one. */
        comment?: string;
        /** Present when opcode is "procedures_call", "procedures_prototype" or "control_stop". */
        mutation?: BlockMutation;
    }

    interface BlockBaseTopLevel extends BlockBase {
        topLevel: true;
        parent: null;
        x: number;
        y: number;
    }

    interface BlockBaseInput extends BlockBase {
        topLevel: false;
        parent: string;
    }

    export type BlockOpcode = keyof BlockProperties;

    export type Blocks = {
        [Opcode in BlockOpcode]: BlockProperties[Opcode] & { opcode: Opcode; } & (BlockBaseTopLevel | BlockBaseInput);
    };

    export type Block<Opcode extends BlockOpcode = BlockOpcode> = Blocks[Opcode];
}

export interface SB3 {
    targets: SB3.Target[],
    monitors: SB3.Monitor[],

    meta: {
        /** Semantic Version */
        semver: "3.0.0",
        /** VM Version, like 0.2.0 */
        vm: string,
        /** The user agent of the client which created this SB3. */
        agent: string
    },

    /** An array of the identifiers of the extensions used. */
    extensions: (string | SB3.ExtensionID)[],
}