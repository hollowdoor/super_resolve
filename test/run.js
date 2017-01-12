const superResolve = require('../');
const log = v=>console.log('test complete ', v);

superResolve(p({
    value1: 1,
    value2: 2
})).then(log);

superResolve({
    value1: p(1),
    value2: p(2),
    obj: {
        value3: p(3), value4: p(4),
        sub: subp(44)
    },
    list: [p(1), subp(2)]
}).then(log).catch(log);

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

function subp(value){
    return new Promise(res=>{
        setTimeout(()=>{
            res({
                avalue: 33
            });
        }, 20);
    }).then(obj=>{
        obj.subvalue = p('a sub value of '+value);
        return obj;
    });
}
