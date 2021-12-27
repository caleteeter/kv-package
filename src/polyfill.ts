// file polyfill.ts

import { TextEncoder, TextDecoder } from "util";

// Note: It is important that only types are imported here to prevent executing
// the module at this point (which would query the ccf global before we polyfilled it).
import { CCF, KvMaps, KvMap, JsonCompatible } from "./global";

// JavaScript's Map uses reference equality for non-primitive types,
// whereas CCF compares the content of the ArrayBuffer.
// To achieve CCF's semantics, all keys are base64-encoded.
class KvMapPolyfill implements KvMap {
    map = new Map<string, ArrayBuffer>();

    has(key: ArrayBuffer): boolean {
        return this.map.has(base64(key));
    }
    get(key: ArrayBuffer): ArrayBuffer | undefined {
        return this.map.get(base64(key));
    }
    getVersionOfPreviousWrite(key: ArrayBuffer): number | undefined {
        throw new Error("Not implemented");
    }
    set(key: ArrayBuffer, value: ArrayBuffer): KvMap {
        this.map.set(base64(key), value);
        return this;
    }
    delete(key: ArrayBuffer): boolean {
        return this.map.delete(base64(key));
    }
    clear(): void {
        this.map.clear();
    }
    forEach(
        callback: (value: ArrayBuffer, key: ArrayBuffer, kvmap: KvMap) => void
    ): void {
        this.map.forEach((value, key, _) => {
            callback(value, unbase64(key), this);
        });
    }
    get size(): number {
        return this.map.size;
    }
}

class CCFPolyfill implements CCF {
    kv = new Proxy(<KvMaps>{}, {
        get: (target, name, receiver) => {
            if (typeof name === "string") {
                return name in target
                    ? target[name]
                    : (target[name] = new KvMapPolyfill());
            }
            return Reflect.get(target, name, receiver);
        },
    });

    strToBuf(s: string): ArrayBuffer {
        return typedArrToArrBuf(new TextEncoder().encode(s));
    }

    bufToStr(v: ArrayBuffer): string {
        return new TextDecoder().decode(v);
    }

    jsonCompatibleToBuf<T extends JsonCompatible<T>>(v: T): ArrayBuffer {
        return this.strToBuf(JSON.stringify(v));
    }

    bufToJsonCompatible<T extends JsonCompatible<T>>(v: ArrayBuffer): T {
        return JSON.parse(this.bufToStr(v));
    }
}

(<any>globalThis).ccf = new CCFPolyfill();


function base64(buf: ArrayBuffer): string {
    return Buffer.from(buf).toString("base64");
}

function unbase64(s: string): ArrayBuffer {
    return nodeBufToArrBuf(Buffer.from(s, "base64"));
}

function typedArrToArrBuf(ta: ArrayBufferView) {
    return ta.buffer.slice(ta.byteOffset, ta.byteOffset + ta.byteLength);
}

function nodeBufToArrBuf(buf: Buffer): ArrayBuffer {
    // Note: buf.buffer is not safe, see docs.
    const arrBuf = new ArrayBuffer(buf.byteLength);
    buf.copy(new Uint8Array(arrBuf));
    return arrBuf;
}