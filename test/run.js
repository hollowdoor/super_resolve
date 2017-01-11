const superResolve = require('../');
const log = v=>console.log('test complete ', JSON.stringify(v, null, 2));

superResolve(p({
    value1: 1,
    value2: 2
})).then(log);

superResolve({
    value1: p(1),
    value2: p(2),
    obj: {
        value3: p(3), value4: p(4)
    }
}).then(log);

let obj = {one: p(1)};
obj.that = obj;
superResolve(obj).then(console.log.bind(console));

function p(value){
    return new Promise(res=>{
        setTimeout(()=>{
            res(value);
        }, 20);
    });
}
