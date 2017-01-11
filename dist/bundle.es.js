import isArray from 'is-array';
import arrayMap from 'array-map';
import objectKeys from 'object-keys';
import forEach from 'array-foreach';

function isThenable(value){
    return typeof value === 'object' && typeof value['then'] === 'function';
}

//https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
var toType = (function (_global, doc, alert){
    return function _toType(obj) {
        if(_global === obj){
            return 'global';
        }else if(doc && obj === doc){
            return 'document';
        }else if(obj === alert){
            return 'alert';
        }

        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    };
})(
    (window || global || undefined),
    (document || null),
    (alert || null)
);

var regularTypes = [
    'string', 'number', 'boolean', 'function', 'symbol'
];

var otherTypes = [
    'error', 'date', 'regexp', 'json', 'math'
];



function isNormalValue(value){

    var type = typeof value;

    if(value === null){
        return true;
    }

    if(regularTypes.indexOf(type) !== -1){
        return true;
    }

    type = toType(value);

    if(otherTypes.indexOf(type) !== -1){
        return true;
    }

    return false;
}

function resolveArray(arr, Promise, visited){
    return Promise.all(arrayMap(arr, function (value){
        return resolveAll(value, Promise, visited);
    }));
}

function resolveObject(object, Promise, visited){
    return resolveProperties(object, Promise, visited);
}

function resolveProperties(object, Promise, visited){
    var resolutions = [];
    var dest = {};

    visited.push(object);

    forEach(objectKeys(object), function (name){

    //Object.keys(object).forEach(name=>{

        if(isNormalValue(object[name])){ return; }

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

            for(var i=0; i<visited.length; i++){
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
        return resolveObject(obj, Promise, visited).then(function (value){
            return {
                name: name,
                value: value
            };
        });
    }

    return Promise.all(resolutions)
    .then(function (values){

        for(var i=0; i<values.length; i++){
            object[values[i].name] = values[i].value;
        }

        values = null;
        resolutions = null;

        return object;
    });
}

function resolveProp(p, name){
    return p.then(function (value){
        return {
            name: name,
            value: value
        };
    });
}

function resolveAll(value, Promise, visited){

    var type = typeof value;

    if(type === 'undefined'){
        return Promise.reject(new TypeError('undefined value'));
    }

    if(isThenable(value)){
        return value.then(function (v){ return resolveAll(v, Promise, visited); });
    }

    if(isNormalValue(value)){
        return Promise.resolve(value);
    }

    if(isArray(value)){
        return resolveArray(value, Promise, visited);
    }

    return resolveObject(value, Promise, visited);
}

function superResolve(value, P){
    return resolveAll(
        value,
        P || superResolve.promise || Promise,
        []
    );
}

superResolve.promise = null;

export default superResolve;
