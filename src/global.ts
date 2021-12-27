// file global.ts

export const ccf: CCF = (<any>globalThis).ccf;

export type JsonCompatible<T> = any;

export interface KvMap {
    has(key: ArrayBuffer): boolean;
    get(key: ArrayBuffer): ArrayBuffer | undefined;
    getVersionOfPreviousWrite(key: ArrayBuffer): number | undefined;
    set(key: ArrayBuffer, value: ArrayBuffer): KvMap;
    delete(key: ArrayBuffer): boolean;
    clear(): void;
    forEach(callback: (value: ArrayBuffer, key: ArrayBuffer, kvmap: KvMap) => void): void;
    size: number;
}

export type KvMaps = { [key: string]: KvMap };

export interface CCF {
    strToBuf(v: string): ArrayBuffer;
    bufToStr(v: ArrayBuffer): string;
    jsonCompatibleToBuf<T extends JsonCompatible<T>>(v: T): ArrayBuffer;
    bufToJsonCompatible<T extends JsonCompatible<T>>(v: ArrayBuffer): T;
    kv: KvMaps;
}