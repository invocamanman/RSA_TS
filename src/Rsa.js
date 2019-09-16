"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var bcu = require('bigint-crypto-utils');
var PubKey = /** @class */ (function () {
    function PubKey(e, n) {
        this.e = e;
        this.n = n;
    }
    return PubKey;
}());
var PrivKey = /** @class */ (function () {
    function PrivKey(d, n) {
        this.d = d;
        this.n = n;
    }
    return PrivKey;
}());
function egcd(a, b) {
    if (a == BigInt(0)) {
        return [b, BigInt(0), BigInt(1)];
    }
    var _a = egcd(b % a, a), g = _a[0], y = _a[1], x = _a[2];
    return [g, x - (b / a) * y, y];
}
function modinv(a, m) {
    var _a = egcd(a, m), g = _a[0], x = _a[1], y = _a[2];
    if (g != BigInt(1)) {
        console.log("error, g ", { g: g });
    }
    var result = x % m;
    if (result < 0)
        return result + m;
    else
        return result;
}
function newKeys(bitLength) {
    if (bitLength === void 0) { bitLength = 2048; }
    return __awaiter(this, void 0, void 0, function () {
        var p, q, n, phi, e, pubK, d, privK;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcu.prime(Math.floor(bitLength / 2) + 1)];
                case 1:
                    p = _a.sent();
                    return [4 /*yield*/, bcu.prime(Math.floor(bitLength / 2))];
                case 2:
                    q = _a.sent();
                    n = p * q;
                    _a.label = 3;
                case 3:
                    if (q === p || bcu.bitLength(n) != bitLength) return [3 /*break*/, 0];
                    _a.label = 4;
                case 4:
                    phi = (p - BigInt(1)) * (q - BigInt(1));
                    e = BigInt(65537);
                    pubK = new PubKey(e, n);
                    d = modinv(e, phi);
                    privK = new PrivKey(d, n);
                    return [2 /*return*/, { privK: privK, pubK: pubK }];
            }
        });
    });
}
exports.newKeys = newKeys;
function encrypt(pubk, m) {
    var c = bcu.modPow(m, pubk.e, pubk.n);
    return c;
}
exports.encrypt = encrypt;
function decrypt(privk, c) {
    var m_d = bcu.modPow(c, privk.d, privk.n);
    return m_d;
}
exports.decrypt = decrypt;
function sign(privk, m) {
    var s = bcu.modPow(m, privk.d, privk.n);
    return s;
}
exports.sign = sign;
function verify(pubk, s, m) {
    var v = bcu.modPow(s, pubk.e, pubk.n);
    return v == m;
}
exports.verify = verify;
function homomorphic_mul(pubk, c, multiplier) {
    var c_mul = (c * multiplier) % pubk.n;
    return c_mul;
}
newKeys().then(function (result) {
    var privK = result.privK, pubK = result.pubK;
    console.log({ privK: privK, pubK: pubK });
    var criptotest = encrypt(pubK, BigInt(123456789));
    console.log({ criptotest: criptotest });
    var decrypttest = decrypt(privK, criptotest);
    var signtest = sign(privK, BigInt(123456789));
    var verifytest = verify(pubK, signtest, BigInt(123456789));
    console.log({ decrypttest: decrypttest, verifytest: verifytest });
});
