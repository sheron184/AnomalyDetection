import React from 'react';
import ReactDOM from 'react-dom';
import ListMetric from "./components/ListMetric";
import NewAnomalyMetric from "./components/NewAnomalyMetric";
import AnomalyReport from "./components/AnomalyReport";
import EditAnomalyMetric from "./components/EditAnomalyMetric";
import {getParams} from "./utils/tools.";



// NOTE: Fixture for the Chart js Prototype js conflict
// DO NOT REMOVE

Array.from = (items, mapfn, thisArg) =>{
    const isCallable = (fn) => typeof fn === 'function';
    const isConstructor = (obj) => obj && obj.prototype && obj.prototype.constructor === obj;
    const C = this || Array;
    let mapping = false;
    let T;

    if (mapfn !== undefined) {
        if (!isCallable(mapfn)) {
            throw new TypeError('mapfn is not a function');
        }
        if (thisArg !== undefined) {
            T = thisArg;
        }
        mapping = true;
    }

    const usingIterator = items[Symbol.iterator];

    if (usingIterator !== undefined) {
        const A = isConstructor(C) ? new C() : [];
        const iterator = items[Symbol.iterator]();

        let k = 0;
        let next = iterator.next();

        while (!next.done) {
            const nextValue = next.value;

            let mappedValue;
            if (mapping) {
                mappedValue = mapfn.call(T, nextValue, k);
            } else {
                mappedValue = nextValue;
            }

            A[k] = mappedValue;
            k++;
            next = iterator.next();
        }

        A.length = k;
        return A;
    }

    const arrayLike = Object(items);
    const len = Math.min(Math.max(Number(arrayLike.length), 0), Number.MAX_SAFE_INTEGER);

    const A = isConstructor(C) ? new C(len) : Array(len);

    for (let k = 0; k < len; k++) {
        const kValue = arrayLike[k];

        let mappedValue;
        if (mapping) {
            mappedValue = mapfn.call(T, kValue, k);
        } else {
            mappedValue = kValue;
        }

        A[k] = mappedValue;
    }

    A.length = len;
    return A;
}



// Simple routing hack as react routes not works with current url with params
const section = getParams('s');
let  elem = (<ListMetric />);
switch(section){
    case '1':
        elem = (<NewAnomalyMetric/>)
        break;
    case '2':
        elem = <EditAnomalyMetric/>
        break;
    default:
        // Do nothing
}

// This is for configuration
if(document.getElementById('module-root') !== null) {
    ReactDOM.render(elem, document.getElementById('module-root'));
}
// This is for monitoring
// Keeping all together for convenience
if(document.getElementById('module-monitoring') !== null) {
    ReactDOM.render(<AnomalyReport/>, document.getElementById('module-monitoring'));
}