// file app.ts

const ccfapp = require('@microsoft/ccf-app');

let testkv = ccfapp.typedKv("test", ccfapp.string, ccfapp.string);

export function addData(key: string, data: string): boolean {
    let result = testkv.set(key, data);
    return true;
}

export function readData(key: string): string | undefined {
    let result = testkv.get(key);
    return result;
}