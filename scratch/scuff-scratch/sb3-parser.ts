import { BlockInstance, BlockScript, BlockScriptInput, BlockScriptRoot, Target } from "scuff";
import { ScratchTargetComponent } from "./editor/ScratchTargetComponent";
import { ScuffScratchProject } from "./editor/ScuffScratchProject";
import { SB3 } from "./sb3";
import { ScratchInputString } from "./block";
import { ScratchVariable } from "./block/ScratchVariable";
import { VariableBlockGet } from "./blocks/VariableBlockGet";
import { ScratchInputVariable } from "./block/inputs/ScratchInputVariable";

type SB3BlockParser<Opcode extends SB3.BlockOpcode> = (block: SB3.Blocks[Opcode], parser: SB3Parser) => BlockInstance;

const BLOCK_PARSERS = {} as { [K in SB3.BlockOpcode]: SB3BlockParser<K> | undefined };

export function registerSB3Block<Opcode extends SB3.BlockOpcode>(opcode: Opcode, parser: (typeof BLOCK_PARSERS)[Opcode]) {
    if (BLOCK_PARSERS[opcode]) throw new Error(`SB3 block '${opcode}' already registered.`);
    BLOCK_PARSERS[opcode] = parser;
}

interface TargetIDMaps {
    readonly variables: Map<string, ScratchVariable>;
    readonly lists: Map<string, ScratchVariable>;
}

export class SB3Parser {
    public readonly project: ScuffScratchProject;
    public readonly stageMaps: TargetIDMaps;

    public readonly targetSB3: SB3.Target;
    public readonly targetMaps: TargetIDMaps;
    public readonly target: ScratchTargetComponent;

    public constructor(project: ScuffScratchProject, stageMaps: TargetIDMaps, target: ScratchTargetComponent, targetMaps: TargetIDMaps, targetSB3: SB3.Target) {
        this.project = project;
        this.target = target;
        this.targetMaps = targetMaps;
        this.targetSB3 = targetSB3;
        this.stageMaps = stageMaps;
    }

    public createVariableBlock(varID: string) {
        let variable = this.targetMaps.variables.get(varID);
        if (!variable) {
            variable = this.stageMaps.variables.get(varID);
            if (!variable) throw new Error(`No variable with ID '${varID}'.`);
        }
        return VariableBlockGet.INSTANCE.createInstance({ variable: new ScratchInputVariable(variable) });
    }

    public parseSubstack(input: SB3.BlockInput<string | null> | undefined): BlockScriptInput {
        const script = new BlockScriptInput();
        if (input && input[1])
            this.parseStack(this.targetSB3.blocks[input[1]], script);
        return script;
    }

    public parseBoolean(input: SB3.BlockInput<string> | undefined): BlockInstance | undefined {
        if (!input) return undefined;
        return this.parseBlock(this.targetSB3.blocks[input[1]]);
    }

    public parseInput(input: SB3.BlockInput | undefined): BlockInstance | ScratchInputString | undefined {
        if (!input) return undefined;
        const value = input[1];
        if (!value) return undefined;
        if (typeof value === "string") {
            return this.parseBlock(this.targetSB3.blocks[value]);
        }
        switch (value[0]) {
            case SB3.BlockInputValueType.NUMBER:
            case SB3.BlockInputValueType.POSITIVE_NUMBER:
            case SB3.BlockInputValueType.POSITIVE_INTEGER:
            case SB3.BlockInputValueType.INTEGER:
            case SB3.BlockInputValueType.ANGLE:
            case SB3.BlockInputValueType.COLOR:
            case SB3.BlockInputValueType.STRING:
                return new ScratchInputString("" + value[1]);
            case SB3.BlockInputValueType.BROADCAST:
                throw new Error(); // Not implimented
            case SB3.BlockInputValueType.VARIABLE:
                return this.createVariableBlock(value[2]);
            case SB3.BlockInputValueType.LIST:
                throw new Error(); // Not implimented
            default:
                throw new Error();
        }
    }

    public parseBlock<Opcode extends SB3.BlockOpcode>(block: SB3.Block<Opcode>) {
        const blockParser = BLOCK_PARSERS[block.opcode];

        if (!blockParser)
            throw new Error(`Unknown block opcode ${block.opcode}.`);

        return blockParser(block, this);
    }

    public parseStack(head: SB3.Block, script: BlockScript) {
        while (true) {
            script.blocks.push(this.parseBlock(head));

            if (!head.next) break;
            head = this.targetSB3.blocks[head.next];

            if (Array.isArray(head))
                throw new Error("Block next cannot be a variable.");
        }
    }
}

export function parseSB3(sb3: SB3): ScuffScratchProject {

    const project = new ScuffScratchProject();

    function createMaps(target: ScratchTargetComponent, targetSB3: SB3.Target) {
        const variables = new Map();
        const lists = new Map();
        for (const varID in targetSB3.variables) {
            const varSB3 = targetSB3.variables[varID];
            const variable = target.createVariable(varSB3[0], false);
            variables.set(varID, variable);
        }
        for (const listID in targetSB3.lists) {
            const listSB3 = targetSB3.lists[listID];
            const list = target.createVariable(listSB3[0], false);
            lists.set(listID, list);
        }
        return { variables, lists };
    }

    let stageSB3 = null;
    for (const target of sb3.targets) {
        if (target.isStage) {
            stageSB3 = target;
            break;
        }
    }
    if (!stageSB3) throw new Error("No stage found.");

    const stageMaps = createMaps(project.stage, stageSB3);

    let targetIdx = 1;
    for (const targetSB3 of sb3.targets) {

        let target, targetMaps;

        if (targetSB3.isStage) {
            target = project.stage;
            targetMaps = stageMaps;
        } else {
            const scuffTarget = project.addTarget(new Target(project));
            target = scuffTarget.addComponent(new ScratchTargetComponent(scuffTarget, targetSB3.name));
            targetMaps = createMaps(target, targetSB3);
        }

        const parser = new SB3Parser(project, stageMaps, target, targetMaps, targetSB3);

        for (const blockId in targetSB3.blocks) {
            let block = targetSB3.blocks[blockId];

            if (Array.isArray(block)) continue;
            if (!block.topLevel) continue;

            const script = new BlockScriptRoot();
            script.translation.x = block.x;
            script.translation.y = block.y;

            parser.parseStack(block, script);

            target.blocks.workspace.addScript(script);
        }
    }

    return project;
}