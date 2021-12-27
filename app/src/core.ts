
import { addData, readData } from './app';

let result1 = addData('testkey1', 'testvalue1');
let result2 = readData('testkey1');

console.log(result1);
console.log(result2);