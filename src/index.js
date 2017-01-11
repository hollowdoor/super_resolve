import resolveAll from './lib/resolve_all.js';
export default function superResolve(value, P){
    return resolveAll(
        value,
        P || superResolve.promise || Promise,
        []
    );
}

superResolve.promise = null;
