var Keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

function Decrypt(value) {
    var n = value.substr(0, 9)
        , i = f1(value.substr(9));
    try {
        i = decodeURIComponent(i)
    } catch (err) { }
    return f2(n, i)
}

function f1(value) {
    if ((value = (value = "".concat(value)).replace(/[ \t\n\f\r]/g, "")).length % 4 == 0 && (value = value.replace(/==?$/, "")),
        value.length % 4 == 1 || /[^+/0-9A-Za-z]/.test(value))
        return null;
    for (var x, r, u = "", c = 0, e = 0, f = 0; f < value.length; f++)
        c <<= 6,
            c |= (x = value[f],
                r = void (0),
                (r = Keys.indexOf(x)) < 0 ? void (0) : r),
            24 === (e += 6) && (u += String.fromCharCode((16711680 & c) >> 16),
                u += String.fromCharCode((65280 & c) >> 8),
                u += String.fromCharCode((255 & c)),
                c = e = 0);
    return 12 === e ? (c >>= 4,
        u += String.fromCharCode(c)) : 18 === e && (c >>= 2,
            u += String.fromCharCode((65280 & c) >> 8),
            u += String.fromCharCode(((255) & c))),
        u
}

function f2(t, n) {
    for (var x, r = [], u = 0, c = "", e = 256, f =0; f < e; f += 1)
        r[f] = f;
    for (f = 0; f < e; f += 1)
        u = ((u + r[f] + t.charCodeAt(f % t.length)) % e),
            x = r[f],
            r[f] = r[u],
            r[u] = x;
    for (var s = u = f = 0; s < n.length; s += 1)
        u = (u + r[f = (f + 1) % e]) % e,
            x = r[f],
            r[f] = r[u],
            r[u] = x,
            c += String.fromCharCode(n.charCodeAt(s) ^ r[(r[f] + r[u]) % e]);
    return c
}
