import type { ScuffProject } from "../ScuffProject";
import type { TargetComponent } from "./TargetComponent";

export class Target {
    public readonly project: ScuffProject;

    private _components: Set<TargetComponent>;

    public constructor(project: ScuffProject) {
        this.project = project;
        this._components = new Set();
    }

    public addComponent<T extends TargetComponent>(component: T): T {
        this._components.add(component);
        return component;
    }

    public getRequiredComponent<T extends TargetComponent>(type: { new(...args: any): T }): T {
        const component = this.getComponent(type);
        if (component === undefined) throw new Error(`Required component ${type.name} not found on target.`);
        return component;
    }

    public getOrCreateComponent<T extends TargetComponent>(type: { new(...args: any): T }, factory: () => T): T {
        const component = this.getComponent(type);
        if (component) return this.addComponent(component);
        return factory();
    }

    public getComponent<T extends TargetComponent>(type: { new(): T }): T | undefined {
        for (const component of this._components)
            if (component instanceof type)
                return component;
        return undefined;
    }

    public *getComponents<T extends TargetComponent>(type: { new(): T }): Generator<T> {
        for (const component of this._components)
            if (component instanceof type)
                yield component;
    }
}
