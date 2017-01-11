import resolveObject from './resolve_object.js';
import normalValue from './normal_value.js';
import isThenable from './is_thenable.js';
import resolveArray from './resolve_array.js';
import isArray from 'is-array';

export default function resolveAll(value, Promise, visited){

    const type = typeof value;

    if(type === 'undefined'){
        return Promise.reject(new TypeError('undefined value'));
    }

    if(isThenable(value)){
        return value.then(v=>resolveAll(v, Promise, visited));
    }

    if(normalValue(value)){
        return Promise.resolve(value);
    }

    if(isArray(value)){
        return resolveArray(value, Promise, visited);
    }

    return resolveObject(value, Promise, visited);
}
