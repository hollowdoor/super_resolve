//https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
const toType = ((_global, doc, alert, proc)=>{
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
    (global || window),
    (document || null),
    (alert || null),
    (process || null)
);

export default toType;
