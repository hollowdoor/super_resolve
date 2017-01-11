import isThenable from './is_thenable.js';
import isArray from 'is-array';
import normalValue from './normal_value.js';
import resolveArray from './resolve_array.js';
import objectKeys from 'object-keys';
import forEach from 'array-foreach';

export default function resolveObject(object, Promise, visited){
    return resolveProperties(object, Promise, visited);
}

function resolveProperties(object, Promise, visited){
    let resolutions = [];
    let dest = {};

    visited.push(object);

    forEach(objectKeys(object), name=>{

    //Object.keys(object).forEach(name=>{

        if(normalValue(object[name])){ return; }

        if(isThenable(object[name])){
            resolutions.push(
                resolveProp(object[name], name)
            );
        }else if(isArray(object[name])){
            resolutions.push(
                resolveProp(
                    resolveArray(object[name], APromise, visited), name
                )
            );
        }else if(typeof object[name] === 'object'){

            for(let i=0; i<visited.length; i++){
                if(visited[i] === object[name]){
                    return;
                }
            }

            visited.push(object[name]);

            resolutions.push(
                resolveChild(object[name], name)
            );
        }
    });

    function resolveChild(obj, name){
        return resolveObject(obj, Promise, visited).then(value=>{
            return {
                name: name,
                value: value
            };
        });
    }

    return Promise.all(resolutions)
    .then(values=>{

        for(let i=0; i<values.length; i++){
            object[values[i].name] = values[i].value;
        }

        values = null;
        resolutions = null;

        return object;
    });
}

function resolveProp(p, name){
    return p.then(value=>{
        return {
            name: name,
            value: value
        };
    });
}
