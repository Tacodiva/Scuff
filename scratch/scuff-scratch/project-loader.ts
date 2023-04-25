import { ScuffScratchProject } from "./editor/ScuffScratchProject";
import { parseSB3 } from "./sb3-parser";

const URL_TRAMPOLINE = "https://trampoline.turbowarp.org";
const URL_PROJECTS = "https://projects.scratch.mit.edu";

export async function loadProject(project: number): Promise<ScuffScratchProject> {

    const projectInfo = await fetch(`${URL_TRAMPOLINE}/proxy/projects/${project}`).then(r => r.json());
    const projectJson = await fetch(`${URL_PROJECTS}/${project}?token=${projectInfo.project_token}`).then(r => r.json());

    return parseSB3(projectJson);
}