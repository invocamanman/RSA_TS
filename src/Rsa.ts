"use strict";

const bcu = require('bigint-crypto-utils');

class PubKey{

    constructor(public e:bigint, public n:bigint){}
}

class PrivKey{

    constructor(public d:bigint, public n:bigint){}
}

interface Key {
    key: bigint;
    n: bigint;
}



function egcd(a :bigint, b: bigint):Array<bigint> {

   if (a == BigInt(0)){
       return [b,BigInt(0),BigInt(1)]
   }
   let [g,y,x] = egcd(b%a, a)
   return [g, x-(b/a)*y,y]
}
function modinv(a :bigint, m: bigint):bigint {
    let [g,x,y] = egcd(a, m)
    if (g!=BigInt(1)){
        console.log("error, g ", {g})
    }
    let result = x%m
    if (result <0)
        return result+m
    else
        return result
 }

 export async function newKeys(bitLength = 2048 ){
    let p : bigint, q:bigint, n:bigint;

    do {
        p = await bcu.prime(Math.floor(bitLength / 2) + 1);
        q = await bcu.prime(Math.floor(bitLength / 2));
        n = p * q;
    } while (q === p || bcu.bitLength(n) != bitLength);

    let phi = (p-BigInt(1))*(q-BigInt(1))
    let e = BigInt(65537);
    let pubK= new PubKey(e,n);
    let d = modinv(e,phi)
    let privK = new PrivKey(d,n)
    return {privK, pubK};
 }


export function encrypt(pubk: PubKey, m: bigint){
    let c= bcu.modPow(m,pubk.e,pubk.n)
    return c
}

export function decrypt(privk: PrivKey, c: bigint){
    let m_d= bcu.modPow(c,privk.d,privk.n)
    return m_d
}

export function sign(privk: PrivKey, m: bigint){
    let s= bcu.modPow(m,privk.d,privk.n)
    return s
}

export function verify(pubk: PubKey, s: bigint,m:bigint){
    let v= bcu.modPow(s,pubk.e,pubk.n)
    return v==m
}
 
function homomorphic_mul(pubk: PubKey, c:bigint, multiplier:bigint ){
    let c_mul = (c*multiplier)%pubk.n
    return c_mul
}

newKeys().then(function(result){
    let {privK,pubK}= result;

    console.log({privK,pubK})
    let criptotest = encrypt(pubK,BigInt(123456789))
    console.log({criptotest})
    let decrypttest = decrypt(privK,criptotest)

    let signtest = sign(privK,BigInt(123456789))
    let verifytest = verify(pubK,signtest,BigInt(123456789))

    console.log({decrypttest, verifytest})
})



//  coperen els 2 : ( 10%)
// si ucopera y l'altreno:: qui engaña guanya un 10+10) 10%    (pot)+5%(persona)
//  si els dos traeixen ( 30%)