import isArray from 'lodash/isArray'

export default function formatGraphParams(params, url = false) {
    let obj = {
        minfreq: null,
        maxfreq: null,
        sumid: [],
        p: [],
        ns: []
    };

    if (typeof params.minfreq !== 'undefined') {
        const constant = url ? -1 : 0;
        obj.minfreq = Number(params.minfreq) - constant;
    }

    if (typeof params.maxfreq !== 'undefined') {
        obj.maxfreq = Number(params.maxfreq);
    }

    if (typeof params.sumid !== 'undefined') {
        if (isArray(params.sumid)) {
            obj.sumid = params.sumid;
        } else {
            obj.sumid.push(params.sumid);
        }
    }

    if (typeof params.p !== 'undefined') {
        if (isArray(params.p)) {
            obj.p = params.p;
        } else {
            obj.p.push(params.p);
        }
    }

    if (typeof params.ns !== 'undefined') {
        if (isArray(params.ns)) {
            obj.ns = params.ns;
        } else {
            obj.ns.push(params.ns);
        }
    }

    return obj
}