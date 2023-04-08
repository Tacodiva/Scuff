const MONACO = new Promise<MonacoAPI>((resolve, reject) => {
    let monaco = window["monaco" as keyof Window];

    if (monaco) {
        resolve(monaco);
        return;
    }
    requirejs.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' } });

    requirejs(["vs/editor/editor.main"], () => {
        resolve(<MonacoAPI>window["monaco" as keyof Window]);
    }, (err: any) => {
        reject(err);
    })
});

export default MONACO;