import resolveAll from './resolve_all.js';
import arrayMap from 'array-map';
export default function resolveArray(arr, Promise, visited){
    return Promise.all(arrayMap(arr, value=>{
        return resolveAll(value, Promise, visited);
    }));
}
