// const jwt = require("jsonwebtoken")

// const secretKey = "mhsiuhfhfjfiajhiorewivewryruerryorqpwfeuuuffffeiufewiererewrienrercepqdsniocdzuerrniifjcshiueiuejsfkuficndsfuasddsfesb4rcrw"

// class JwtProvider{

//     constructor(secretKey){
//         this.secretKey=secretKey
//     }

//     createJwt(payload){
//         return jwt.sign(payload, this.secretKey, {expiresIn:"24h"})
//     }

//     getEmailFromjwt(token){
//         try {
//             const decodedToken = jwt.verify(token, this.secretKey)
//             return decodedToken.email
//         } catch (error) {
//             throw new error ("Invalid token")
//         }
//     }

//     verifyJwt(token){
//         try {
//             return jwt.verify(token, this.secretKey)
            
//         } catch (error) {
//             throw new error ("Invalid token")
//         }
//     }
// }

// module.exports = new JwtProvider(secretKey);

const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

class JwtProvider {

    constructor(secretKey) {
        this.secretKey = secretKey;
    }

    createJwt(payload) {
        return jwt.sign(payload, this.secretKey, { expiresIn: "24h" });
    }

    getEmailFromjwt(token) {
        try {
            const decodedToken = jwt.verify(token, this.secretKey);
            return decodedToken.email; // ✅ returns email string
        } catch (error) {
            throw new Error("Invalid token");
        }
    }

    verifyJwt(token) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
}

module.exports = new JwtProvider(secretKey);
