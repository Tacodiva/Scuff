
export const l10n = {
    translate(id: string): l10nString {
        return new l10nString(id, true);
    },

    raw(text: string): l10nString {
        return new l10nString(text, false);
    }
}

export class l10nString {

    public readonly id: string;
    private readonly translate: boolean;

    constructor(id: string, translate: boolean) {
        this.id = id;
        this.translate = translate;
    }

    get str(): string {
        if (!this.translate) return this.id;
        throw new Error();
    }
}
