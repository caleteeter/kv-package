// file kv.ts

import { ccf, KvMap, KvMaps } from "./global";
import { DataConverter } from "./converters";

export class TypedKvMap<K, V> {
    constructor(private kv: KvMap, private kt: DataConverter<K>, private vt: DataConverter<V>) { }

    has(key: K): boolean {
        return this.kv.has(this.kt.encode(key));
    }

    get(key: K): V | undefined {
        const v = this.kv.get(this.kt.encode(key));
        return v === undefined ? undefined : this.vt.decode(v);
    }

    set(key: K, value: V): TypedKvMap<K, V> {
        this.kv.set(this.kt.encode(key), this.vt.encode(value));
        return this;
    }

    delete(key: K): boolean {
        return this.kv.delete(this.kt.encode(key));
    }

    clear(): void {
        this.kv.clear();
    }

    forEach(callback: (value: V, key: K, table: TypedKvMap<K, V>) => void): void {
        let kt = this.kt;
        let vt = this.vt;
        let typedMap = this;
        this.kv.forEach(function (raw_v: ArrayBuffer, raw_k: ArrayBuffer, table: KvMap) {
            callback(vt.decode(raw_v), kt.decode(raw_k), typedMap);
        });
    }

    get size(): number {
        return this.kv.size;
    }
}

export function typedKv<K, V>(nameOrMap: string | KvMap, kt: DataConverter<K>, vt: DataConverter<V>) {
    const kvMap = typeof nameOrMap === "string" ? ccf.kv[nameOrMap] : nameOrMap;
    return new TypedKvMap(kvMap, kt, vt);
}

export const rawKv = ccf.kv;

export { KvMap, KvMaps } from "./global";