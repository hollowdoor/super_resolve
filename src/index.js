import resolveAll from './lib/resolve_all.js';
export default function superResolve(value, P){
    
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
