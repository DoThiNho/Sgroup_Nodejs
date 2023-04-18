const jsonwebtoken = require('jsonwebtoken')

// const secret = 'thinh12345'

// const user = {
//     name: 'Thinh',
//     org: 'Sgroup'
// };

// const jwt = jsonwebtoken.sign(user, secret, {
//     algorithm: 'HS384'
// })

// console.log(jwt);
const userToken = 'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGhpbmgiLCJvcmciOiJTZ3JvdXAxIiwiaWF0IjoxNjgxNzM2MTI0fQ.bmxffmMAVPj05zIsZNrojf6ak4s4Gs-ZVhQQ12Crqmn9FDN2uvsuQnp9Qaz8o2BT'
const secret = 'nho12345'

const isTokenValid = jsonwebtoken.verify(userToken, secret)

console.log(isTokenValid);