
function translate(id: string): l10nString {
    return new l10nString(id, true);
}

function raw(text: string): l10nString {
    return new l10nString(text, false);
}

class l10nString {

    private readonly id: string;
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


export { l10nString as default, translate, raw };