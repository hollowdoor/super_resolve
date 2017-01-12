'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isArray = _interopDefault(require('is-array'));
var arrayMap = _interopDefault(require('array-map'));
var objectKeys = _interopDefault(require('object-keys'));
var forEach = _interopDefault(require('array-foreach'));

function isThenable(value){
    return typeof value === 'object' && typeof value['then'] === 'function';
}

var g = (function (){
    if(typeof global !== 'undefined'){
        return global;
    }else if(typeof window !== 'undefined'){
        return window;
    }
})();
//https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
var toType = (function (_global, doc, alert, proc){
    return function _toType(obj) {
        if(_global === obj){
            return 'global';
        }else if(doc && obj === doc){
            return 'document';
        }else if(obj === alert){
            return 'alert';
        }else if(proc && obj === proc){
            return 'process'
        }

        if(typeof obj === 'object' && obj.nodeType){
            return 'node';
        }

        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    };
})(
    g,
    (g.document ? document : null),
    (g.alert ? alert : null),
    (g.process ? process : null)
);

var regularTypes = [
    'string', 'number', 'boolean', 'function', 'symbol'
];

var otherTypes = [
    'error', 'date', 'regexp', 'json', 'math',
    'global', 'document', 'alert', 'node', 'process'
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

function resolveArray(arr, the){
    return the.Promise.all(arrayMap(arr, function (value){
        return resolveAll(value, the);
    }));
}

function resolveObject(object, the){
    return resolveProperties(object, the);
}

function resolveProperties(object, the){
    var resolutions = [];
    var dest = {};

    the.visited.push(object);

    forEach(objectKeys(object), function (name){

        if(isNormalValue(object[name])){ return; }

        if(isThenable(object[name])){
            resolutions.push(
                resolveProp(object[name], name)
                .then(function (prop){
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

            for(var i=0; i<the.visited.length; i++){
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
        return resolveObject(obj, the).then(function (value){
            return {
                name: name,
                value: value
            };
        });
    }

    return the.Promise.all(resolutions)
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

function resolveAll(value, the){

    var type = typeof value;

    if(type === 'undefined'){
        return the.Promise.reject(new TypeError('undefined value'));
    }

    if(isThenable(value)){
        return value.then(function (v){ return resolveAll(v, the); });
    }

    if(isNormalValue(value)){
        return the.Promise.resolve(value);
    }

    if(isArray(value)){
        return resolveArray(value, the);
    }

    return resolveObject(value, the);
}

function superResolve(value, P){
    
    if(typeof P === 'undefined'){
        if(superResolve.Promise !== null){
            P = superResolve.Promise;
        }else{
            P = Promise;
        }
    }

    return resolveAll(
        value,
        {
            Promise: P,
            visited: []
        }
    );
}

superResolve.Promise = null;

module.exports = superResolve;
