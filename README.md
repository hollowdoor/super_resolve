super-resolve
====

Install
-------

`npm install --save super-resolve`

`super-resolve` will work in browsers (with browserify, webpack, or rollup), and node. For browsers you might need a Promise polyfill/ponyfill. See how to use a Promise polyfill/ponyfill below.

Usage
-----

```javascript
import superResolve from 'super-resolve';
const log = v=>console.log(v);

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
    //Mock asynchronous data retrieval.
    return new Promise(res=>{
        setTimeout(()=>{
            res(value);
        }, 20);
    });
}

```

Explanation
-----------

`super-resolve` takes a value, and returns a promise.

Any value passed to `super-resolve` is traversed, and all promise values are resolved.

For instance if you pass an object that has properties with waiting promises those promises will resolved before `super-resolve` resolves to the object you passed in.

In simpler terms:

```javascript
let myObject = {value: Promise.resolve('a value')};

superResolve(myObject)
.then(myObject=>{
    //myObject = {value: "a value"}
});
```

In that last example the property `value` resolves to the string `'a value'` before `superResolve` resolves to `myObject`.

Any other properties which includes nested object(s) properties would also be resolved before `myObject` returns. Like:

```javascript
let myObject = {
    value: Promise.resolve('a value'),
    nested: {
        prop: Promise.resolve('a nested value')
    }
};

superResolve(myObject)
.then(myObject=>{
    //myObject = {value: "a value", nested: {prop: "a nested value"}}
});
```

Yes really.

About
-----

I like it when values just look like values don't you?

For some usages this library could be overkill. When you want to grab data from a lot of different data sources in a very tight time interval this library could be very useful.

Note that some values might not work correctly. The type checking mechanism in `super-resolve` has been tuned to work with almost all possible javascript types. Some native types might trip up `super-resolve`. Typically you won't have to worry about this since most data returned from a promise will be JSON compatible.

The best possible values to pass to `super-resolve`:

* JSON compatible objects
* Arrays
* Numbers, strings, dates, and other javascript objects.
* Objects you define

Values that might cause `super-resolve` to fail:

* DOM nodes
* Other host objects

API
---

### superResolve(value, PromiseConstructor) -> promise

The `value` parameter can be any value except undefined. What ever you pass to `value` if it is a promise, or has promises it will all be resolved. If promises are found by `superResolve`, or not found the return value will still be what you expect.

`superResolve` will not resolve promises on the prototype. Promises on the prototype would be odd anyway.

`PromiseConstructor` should be a custom polyfill/ponyfill from a library that implements the Promises/A+ spec (e.g. Bluebird).

### superResolve.promise

`superResolve.promise` is a static property that equals null. Set this to a promise constructor to change the custom promise implementation instead of using the `PromiseConstructor` parameter of `superResolve()`.

Why?
----

Someone probably would have made it anyway. Several months before the first code was written for `super-resolve` I was planning on making making something like it. I can predict some usages for this library. As a parameter consumer for other libraries, or as a helper for complex applications that are data heavy. Both are things I plan to use it for.

Happy coding!
