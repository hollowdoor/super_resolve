import resolveAll from './resolve_all.js';
import arrayMap from 'array-map';
export default function resolveArray(arr, the){
    return the.Promise.all(arrayMap(arr, value=>{
        return resolveAll(value, the);
    }));
}
