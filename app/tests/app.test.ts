
import { addData, readData } from '../src/app';

describe('app tests', () => {
    it('should test adding a new value', () => {
        let result = addData("testkey1", "testdata1");
        expect(result).toBe(true);
    });

    it('should test reading existing values', () => {
        let result = readData("testkey1");
        expect(result).toBe("testdata1");
    });

    it('should test reading non keyed value', () => {
        let result = readData("testkey2");
        expect(result).toBe(undefined);
    });
})