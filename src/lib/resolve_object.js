import isThenable from './is_thenable.js';
import isArray from 'is-array';
import normalValue from './normal_value.js';
import resolveArray from './resolve_array.js';
import objectKeys from 'object-keys';
import forEach from 'array-foreach';
import resolveAll from './resolve_all.js';

export default function resolveObject(object, the){
    return resolveProperties(object, the);
}

function resolveProperties(object, the){
    let resolutions = [];
    let dest = {};

    the.visited.push(object);

    forEach(objectKeys(object), name=>{

        if(normalValue(object[name])){ return; }

        if(isThenable(object[name])){
            resolutions.push(
                resolveProp(object[name], name)
                .then(prop=>{
                    return resolveProp(
                        resolveAll(prop.value, the), prop.name
                    );
                })
            );
        }else if(isArray(object[name])){
            resolutions.push(
                resolveProp(
                    resolveArray(object[name], the), name
                )
            );
        }else if(typeof object[name] === 'object'){

            for(let i=0; i<the.visited.length; i++){
                if(the.visited[i] === object[name]){
                    return;
                }
            }

            the.visited.push(object[name]);

            resolutions.push(
                resolveChild(object[name], name)
            );
        }
    });

    function resolveChild(obj, name){
        return resolveObject(obj, the).then(value=>{
            return {
                name: name,
                value: value
            };
        });
    }

    return the.Promise.all(resolutions)
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
