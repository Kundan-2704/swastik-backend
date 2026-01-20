const User = require("../model/User");
const jwtProvider = require("../util/jwtProvider");


class UserService {


    async findUserProfileByJwt(jwt) {
        const email = jwtProvider.getEmailFromjwt(jwt)

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error(`User does not exist with email ${email}`)
        }
        return user
    }


    async findUserByEmail(email){
        const user = await User.findOne({email})
        if(!user){
            throw new Error(`User does not exist with email ${email}`)
        }
        return user
    }


}

module.exports = new UserService()