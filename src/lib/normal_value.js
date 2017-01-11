import toType from './to_type.js';

const regularTypes = [
    'string', 'number', 'boolean', 'function', 'symbol'
];

const otherTypes = [
    'error', 'date', 'regexp', 'json', 'math',
    'global', 'document', 'alert', 'node', 'process'
];



export default function isNormalValue(value){

    let type = typeof value;

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
