
type ComponentType<T> = { prototype: T, readonly id: string };

export class ComponentContainer<Component = any> {
    public readonly components: Map<string, Component>;

    public constructor() {
        this.components = new Map();
    }

    public addComponent<T extends Component>(type: ComponentType<T>, component: T) {
        this.components.set(type.id, component);
    }

    public getComponent<T extends Component>(type: ComponentType<T>): T | undefined {
        return this.components.get(type.id) as T | undefined;
    }

    public getRequiredComponent<T extends Component>(type: ComponentType<T>): T {
        const component = this.getComponent(type);
        if (component === undefined) throw new Error(`Required component '${type.id}' not found.`);
        return component;
    }

}